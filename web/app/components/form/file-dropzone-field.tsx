import { useQuery } from '@tanstack/react-query';
import { api } from 'convex/_generated/api';
import { useAction } from 'convex/react';
import { useCallback } from 'react';
import { toast } from 'sonner';
import type { FileUploadInfo } from '~/core/file';
import { cn } from '~/lib/cn';
import { getFilenameFromKey, getFileTypeFromMetadata } from '~/lib/file';
import { formatBytes } from '~/lib/format';
import FileDropZone from '../common/file-dropzone';
import { FileIcon, FilePreviewItem } from '../common/file-preview-item';
import { FieldLabel } from './field-label';
import { useFieldContext } from './form-context';

export interface FileDropzoneFieldProps {
    className?: string;
    label?: string;
}

export function FileDropzoneField({
    className,
    label,
}: FileDropzoneFieldProps) {
    const field = useFieldContext<FileUploadInfo | undefined>();
    const id = `file-dropzone-${field.name}`;

    const fileInfo = field.state.value;

    const handleFileUpload = (file: File | undefined) => {
        field.handleChange({
            file,
            fileKey: undefined,
        });
    };

    return (
        <div className={cn(className, 'flex flex-col gap-1')}>
            {label && <FieldLabel>{label}</FieldLabel>}
            <FileDropzoneFieldInner
                id={id}
                fileInfo={fileInfo}
                onFileUpload={handleFileUpload}
            />
        </div>
    );
}

interface FileDropzoneFieldInnerProps {
    id: string;
    className?: string;
    fileInfo: FileUploadInfo | undefined;
    onFileUpload: (file: File | undefined) => void;
}

function FileDropzoneFieldInner({
    id,
    className,
    fileInfo,
    onFileUpload,
}: FileDropzoneFieldInnerProps) {
    const { file = undefined, fileKey = undefined } = fileInfo || {};

    if (!file && !fileKey) {
        return (
            <FileDropZone
                id={id}
                className={className}
                onFileUpload={onFileUpload}
            />
        );
    }

    if (file) {
        const fileSizeFormatted = formatBytes(file.size);

        return (
            <FilePreviewItem
                icon={
                    <FileIcon fileType={getFileTypeFromMetadata(file.name)} />
                }
                title={file.name}
                subtitle={fileSizeFormatted}
                isLoading={false}
                isUploading={false}
                uploadingProgressPct={0}
                isError={false}
                showDownloadButton={false}
                isDownloadButtonLoading={false}
                showDeleteButton={true}
                onDownloadButtonClick={() => {}}
                onDeleteButtonClick={() => {
                    onFileUpload(undefined);
                }}
            />
        );
    }

    return (
        <FileDropzoneUploadedItem
            fileKey={fileKey || ''}
            onDeleteButtonClick={() => {
                onFileUpload(undefined);
            }}
        />
    );
}

interface FileDropzoneUploadedItemProps {
    fileKey: string;
    onDeleteButtonClick: () => void;
}

function FileDropzoneUploadedItem({
    fileKey,
    onDeleteButtonClick,
}: FileDropzoneUploadedItemProps) {
    const getFileMetadata = useAction(api.large_files.getObjectMetadata);

    const getDownloadUrl = useAction(api.large_files.getPresignedGetObjectUrl);

    const { data: fileMetadata, isLoading } = useQuery({
        queryKey: ['file-metadata', fileKey],
        queryFn: () => getFileMetadata({ fullFileKey: fileKey }),
        enabled: !!fileKey,
    });

    const filename = getFilenameFromKey(fileKey);

    const handleDownloadButtonClick = useCallback(() => {
        getDownloadUrl({
            fullFileKey: fileKey,
        })
            .then((url) => {
                window.open(url, '_blank');
            })
            .catch((error) => {
                console.error(error);
                toast.error('Failed to download file', {
                    description: 'Please try again later.',
                });
            });
    }, [fileKey, getDownloadUrl]);

    return (
        <FilePreviewItem
            icon={
                <FileIcon
                    fileType={getFileTypeFromMetadata(
                        fileKey,
                        fileMetadata?.contentType
                    )}
                />
            }
            title={filename}
            subtitle={
                fileMetadata?.contentLength
                    ? formatBytes(fileMetadata?.contentLength)
                    : 'Unknown size'
            }
            isLoading={isLoading}
            isUploading={false}
            uploadingProgressPct={0}
            isError={false}
            showDownloadButton={true}
            isDownloadButtonLoading={false}
            showDeleteButton={true}
            onDownloadButtonClick={handleDownloadButtonClick}
            onDeleteButtonClick={onDeleteButtonClick}
        />
    );
}
