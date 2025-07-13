import { api } from 'convex/_generated/api';
import { useAction } from 'convex/react';
import { useAtom } from 'jotai';
import {
    fileUploadingListAtom,
    useFileUploadingStatus,
    type FileUploadInfo,
} from '~/core/file';

import Axios from 'axios';
import { Effect, Schedule } from 'effect';
import { toast } from 'sonner';
import { ProjectCreatingSonner } from '~/components/common/project-creating-sonner';
import { md5HashBlob } from '~/lib/crypto';
import { getFilenameFromKey } from '~/lib/file';

const SINGLE_PART_UPLOAD_SIZE_LIMIT = 1024 * 1024 * 8; // 8MB
const MULTI_PART_UPLOAD_CONCURRENT_POOL_NUM = 2;
const MULTI_PART_UPLOAD_MAX_PART_SIZE = 1024 * 1024 * 8; // 8MB

export interface FileUploadResult {
    id: string;
    filename: string;
    fullFileKey: string;
    contentType: string;
    contentLength: number;
}

export interface UploadFileOptions {
    file: File;
    onFinish: (result: FileUploadResult) => void;
    onError: (error: Error) => void;
}

export function useFileUpload() {
    const [fileUploadingList, setFileUploadingList] = useAtom(
        fileUploadingListAtom
    );

    const { createFileUploadingItem, updateFileUploadingStatus } =
        useFileUploadingStatus();

    const getPresignedPutObjectUrl = useAction(
        api.large_files.getPresignedPutObjectUrl
    );

    const startMultipartUpload = useAction(
        api.large_files.startMultipartUpload
    );
    const getPresignedPartUploadUrl = useAction(
        api.large_files.getPresignedPartUploadUrl
    );
    const completeMultipartUpload = useAction(
        api.large_files.completeMultipartUpload
    );
    const abortMultipartUpload = useAction(
        api.large_files.abortMultipartUpload
    );

    const uploadFileInSinglePart = async (
        originalFilename: string,
        id: string,
        file: File
    ): Promise<FileUploadResult> => {
        // For single part upload, we assume the file is small enough and we don't check the content integrity
        const { url, fullFileKey, contentType } =
            await getPresignedPutObjectUrl({
                filename: originalFilename,
                contentType: file.type,
                contentLength: file.size,
            });

        const filename = getFilenameFromKey(fullFileKey);

        updateFileUploadingStatus(id, {
            status: 'uploading',
            name: filename,
        });

        await Axios.put(url, file, {
            headers: {
                'Content-Type': contentType,
            },
            onUploadProgress: (evt) => {
                if (evt.total) {
                    const pct = Math.round((evt.loaded / evt.total) * 100);
                    updateFileUploadingStatus(id, {
                        progress: pct,
                    });
                }
            },
        });

        updateFileUploadingStatus(id, {
            status: 'completed',
            progress: 100,
        });

        return {
            id,
            filename,
            fullFileKey,
            contentType,
            contentLength: file.size,
        };
    };

    const uploadFileInMultiPart = async (
        originalFilename: string,
        id: string,
        file: File
    ): Promise<FileUploadResult> => {
        // For multi part upload, we need to check the content integrity
        const totalSize = file.size;
        const partCount = Math.ceil(
            totalSize / MULTI_PART_UPLOAD_MAX_PART_SIZE
        );

        const { uploadId, fullFileKey, contentType } =
            await startMultipartUpload({
                filename: originalFilename,
                contentType: file.type,
                contentLength: file.size,
            });

        const filename = getFilenameFromKey(fullFileKey);

        updateFileUploadingStatus(id, {
            status: 'uploading',
            name: filename,
        });

        const innerUploadStatus = {
            finishedPartCount: 0,
            partTransferredSize: Array(partCount).fill(0),
        };

        const createPartUploadTask = (index: number) =>
            Effect.promise(async () => {
                const partNumber = index + 1;
                const partBlob = file.slice(
                    index * MULTI_PART_UPLOAD_MAX_PART_SIZE,
                    (index + 1) * MULTI_PART_UPLOAD_MAX_PART_SIZE
                );
                const partMd5 = await md5HashBlob(partBlob);
                const { url } = await getPresignedPartUploadUrl({
                    fullFileKey,
                    uploadId,
                    partNumber,
                });
                const response = await Axios.put(url, partBlob, {
                    headers: {
                        'Content-Type': contentType,
                    },
                    onUploadProgress: (evt) => {
                        if (evt.total) {
                            innerUploadStatus.partTransferredSize[index] =
                                evt.loaded;
                            const pct = Math.round(
                                (innerUploadStatus.partTransferredSize.reduce(
                                    (acc, curr) => acc + curr,
                                    0
                                ) /
                                    totalSize) *
                                    100
                            );
                            updateFileUploadingStatus(id, {
                                progress: pct,
                            });
                        }
                    },
                });
                const etag = response.headers['etag'] as string | undefined;
                if (!etag) {
                    throw new Error('Part upload failed: No etag');
                }
                if (
                    !etag
                        .toLocaleLowerCase()
                        .includes(partMd5.toLocaleLowerCase())
                ) {
                    throw new Error('Part upload failed: Etag mismatch');
                }
                innerUploadStatus.finishedPartCount++;
                innerUploadStatus.partTransferredSize[index] = partBlob.size;
                const pct = Math.round(
                    (innerUploadStatus.partTransferredSize.reduce(
                        (acc, curr) => acc + curr,
                        0
                    ) /
                        totalSize) *
                        100
                );
                updateFileUploadingStatus(id, {
                    progress: pct,
                });
                return { partNumber, etag };
            });

        const partTasks = Array.from({ length: partCount }, (_, index) =>
            Effect.retry(createPartUploadTask(index), {
                times: 3,
                schedule: Schedule.exponential(1000),
            })
        );

        const uploadMultipartResult = Effect.all(partTasks, {
            concurrency: MULTI_PART_UPLOAD_CONCURRENT_POOL_NUM,
        });

        try {
            const partResults = await Effect.runPromise(uploadMultipartResult);

            await completeMultipartUpload({
                fullFileKey,
                uploadId,
                parts: partResults.sort((a, b) => a.partNumber - b.partNumber),
            });

            updateFileUploadingStatus(id, {
                status: 'completed',
                progress: 100,
            });
        } catch (error) {
            await abortMultipartUpload({
                fullFileKey,
                uploadId,
            });
            throw error;
        }

        return {
            id,
            filename,
            fullFileKey,
            contentType,
            contentLength: file.size,
        };
    };

    const uploadFileInnerAsync = async (
        id: string,
        file: File
    ): Promise<FileUploadResult> => {
        const originalFilename = file.name;
        try {
            if (file.size > SINGLE_PART_UPLOAD_SIZE_LIMIT) {
                return await uploadFileInMultiPart(originalFilename, id, file);
            } else {
                return await uploadFileInSinglePart(originalFilename, id, file);
            }
        } catch (error) {
            updateFileUploadingStatus(id, {
                status: 'failed',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
            throw error;
        }
    };

    const startUploadFileTask = (options: UploadFileOptions) => {
        const id = createFileUploadingItem(options.file);
        uploadFileInnerAsync(id, options.file)
            .then(options.onFinish)
            .catch(options.onError);
        return id;
    };

    const handleBatchUploadFileTasks = <K extends string>(
        fileValues: Record<K, FileUploadInfo | undefined>
    ): Promise<{
        shouldUpdateFileKeys: boolean;
        fileKeys: Record<K, string | undefined>;
    }> => {
        return new Promise((resolve, reject) => {
            if (Object.values(fileValues).every((fileInfo) => !fileInfo)) {
                resolve({
                    shouldUpdateFileKeys: false,
                    fileKeys: Object.fromEntries(
                        Object.keys(fileValues).map((key) => [key, undefined])
                    ) as Record<K, string | undefined>,
                });
                return;
            }

            const trackingUploadingFileIds: string[] = [];
            const leftToCompleteUploadingFileIdSet = new Set<string>();

            const resultFileKeys: Record<K, string | undefined> =
                Object.fromEntries(
                    Object.keys(fileValues).map((key) => {
                        const fileInfo = fileValues[key as K];
                        return [key, fileInfo?.fileKey];
                    })
                ) as Record<K, string | undefined>;

            Object.keys(fileValues).forEach((_key) => {
                const key = _key as K;
                const fileInfo = fileValues[key];
                if (fileInfo?.file) {
                    const id = startUploadFileTask({
                        file: fileInfo.file,
                        onFinish: (result) => {
                            trackingUploadingFileIds.push(result.id);
                            leftToCompleteUploadingFileIdSet.delete(result.id);
                            resultFileKeys[key] = result.fullFileKey;
                            if (leftToCompleteUploadingFileIdSet.size === 0) {
                                resolve({
                                    shouldUpdateFileKeys: true,
                                    fileKeys: resultFileKeys,
                                });
                            }
                        },
                        onError: (error) => {
                            reject(error);
                        },
                    });
                    trackingUploadingFileIds.push(id);
                    leftToCompleteUploadingFileIdSet.add(id);
                }
            });

            if (trackingUploadingFileIds.length > 0) {
                const sonnerInfo: {
                    id: string | number | undefined;
                } = {
                    id: undefined,
                };

                const onAllUploadingFilesFinished = () => {
                    if (sonnerInfo.id) {
                        toast.dismiss(sonnerInfo.id);
                    }
                    resolve({
                        shouldUpdateFileKeys: true,
                        fileKeys: resultFileKeys,
                    });
                };
                sonnerInfo.id = toast.loading(
                    <ProjectCreatingSonner
                        uploadingFileIds={trackingUploadingFileIds}
                        onAllUploadingFilesFinished={
                            onAllUploadingFilesFinished
                        }
                    />,
                    {
                        duration: Infinity,
                    }
                );
            } else {
                resolve({
                    shouldUpdateFileKeys: false,
                    fileKeys: resultFileKeys,
                });
            }
        });
    };

    return {
        fileUploadingList,
        setFileUploadingList,
        startUploadFileTask,
        handleBatchUploadFileTasks,
    };
}
