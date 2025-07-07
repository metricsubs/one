import axios from 'axios';
import { api } from 'convex/_generated/api';
import { useAction } from 'convex/react';
import { Effect, Schedule } from 'effect';
import { useState } from 'react';
import LogoIcon from '~/components/common/logo-icon';
import { Button } from '~/components/ui/button';
import { md5HashBlob } from '~/lib/crypto';
import type { Route } from './+types/example';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'MetricSubs - Tech Without Boundaries' },
        {
            name: 'description',
            content:
                'MetricSubs is a volunteer-powered localization studio committed to turning the world’s best tech videos into native-quality Mandarin content.',
        },
    ];
}

export default function Example() {
    const getPresignedUploadUrl = useAction(
        api.large_files.getPresignedPutObjectUrl
    );
    const getObjectMetadata = useAction(api.large_files.getObjectMetadata);
    const startMultipartUpload = useAction(
        api.large_files.startMultipartUpload
    );
    const getPresignedPartUploadUrl = useAction(
        api.large_files.getPresignedPartUploadUrl
    );
    const completeMultipartUpload = useAction(
        api.large_files.completeMultipartUpload
    );

    const [file, setFile] = useState<File | null>(null);
    const [uploadMessage, setUploadMessage] = useState<string | null>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
        } else {
            setFile(null);
        }
    };

    const handleUploadInSinglePart = async () => {
        if (!file) return;
        try {
            setUploadMessage('Getting presigned upload url...');
            const { url, fullFileKey, contentType, contentLength } =
                await getPresignedUploadUrl({
                    filename: file.name,
                    contentType: file.type,
                    contentLength: file.size,
                });
            setUploadMessage('Uploading file...');
            await axios.put(url, file, {
                headers: {
                    'Content-Type': contentType,
                },
                onUploadProgress: (evt) => {
                    if (evt.total) {
                        const pct = Math.round((evt.loaded / evt.total) * 100);
                        setUploadMessage(`Uploading file... ${pct}%`);
                    }
                },
            });
            const metadata = await getObjectMetadata({
                fullFileKey,
            });
            console.log(metadata);
            setUploadMessage('Uploaded file');
        } catch (error) {
            console.error(error);
            setUploadMessage('Error: ' + error);
        }
    };

    const handleUploadInMultiPart = async () => {
        if (!file) return;
        try {
            setUploadMessage('Getting presigned upload url...');
            const totalSize = file.size;
            const maxPartSize = 1024 * 1024 * 8; // 8MB
            const partCount = Math.ceil(totalSize / maxPartSize);
            const { uploadId, fullFileKey, contentType } =
                await startMultipartUpload({
                    filename: file.name,
                    contentType: file.type,
                    contentLength: totalSize,
                });

            setUploadMessage('Uploading file...');
            const concurrentPoolNum = 2;
            const startTime = Date.now();

            const createPartUploadTask = (index: number) =>
                Effect.promise(async () => {
                    const partNumber = index + 1;
                    const partBlob = file.slice(
                        index * maxPartSize,
                        (index + 1) * maxPartSize
                    );
                    const partMd5 = await md5HashBlob(partBlob);
                    const { url } = await getPresignedPartUploadUrl({
                        fullFileKey,
                        uploadId,
                        partNumber,
                    });
                    const response = await axios.put(url, partBlob, {
                        headers: {
                            'Content-Type': contentType,
                        },
                        onUploadProgress: (evt) => {
                            if (evt.total) {
                                const pct = Math.round(
                                    (evt.loaded / evt.total) * 100
                                );
                                setUploadMessage(
                                    `Uploading file part #${partNumber}/${partCount}... ${pct}%`
                                );
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
                    return { partNumber, etag };
                });

            const partTasks = Array.from({ length: partCount }, (_, index) =>
                Effect.retry(createPartUploadTask(index), {
                    times: 3,
                    schedule: Schedule.exponential(1000),
                })
            );
            const uploadMultipartResult = Effect.all(partTasks, {
                concurrency: concurrentPoolNum,
            });

            const result = await Effect.runPromise(uploadMultipartResult);
            console.log('result', result);

            setUploadMessage('Finishing up...');

            const completeMultipartResult = await completeMultipartUpload({
                fullFileKey,
                uploadId,
                parts: result.sort((a, b) => a.partNumber - b.partNumber),
            });
            console.log('completeMultipartResult', completeMultipartResult);

            const metadata = await getObjectMetadata({
                fullFileKey,
            });
            console.log(metadata);
            const endTime = Date.now();
            const durationInSeconds = (endTime - startTime) / 1000;
            setUploadMessage(
                `Uploaded file in ${durationInSeconds.toFixed(2)}s`
            );
        } catch (error) {
            console.error(error);
            setUploadMessage('Error: ' + error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <LogoIcon className="w-16 h-16 mb-4" />
            <h1 className="text-4xl font-semibold logo-font">MetricSubs</h1>
            <Button>Click me</Button>
            <input type="file" onChange={handleFileChange} />

            <Button
                intent="primary"
                size="md"
                className="w-full"
                onClick={handleUploadInSinglePart}
            >
                Upload in single part
            </Button>
            <Button
                intent="primary"
                size="md"
                className="w-full"
                onClick={handleUploadInMultiPart}
            >
                Upload in multi part
            </Button>
            {uploadMessage && <p>{uploadMessage}</p>}
        </div>
    );
}
