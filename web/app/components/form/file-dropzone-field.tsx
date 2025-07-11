import { cn } from '~/lib/cn';
import { getFileTypeFromMetadata } from '~/lib/file';
import { formatBytes } from '~/lib/format';
import FileDropZone from '../common/file-dropzone';
import { FileIcon, FilePreviewItem } from '../common/file-preview-item';
import { FieldLabel } from './field-label';
import { useFieldContext } from './form-context';

export interface FileDropzoneFieldFileInfo {
    file: File | null;
    fileKey: string | null;
}

export interface FileDropzoneFieldProps {
    className?: string;
    label?: string;
}

export function FileDropzoneField({
    className,
    label,
}: FileDropzoneFieldProps) {
    const field = useFieldContext<FileDropzoneFieldFileInfo | null>();
    const id = `file-dropzone-${field.name}`;

    const fileInfo = field.state.value;

    const handleFileUpload = (file: File | null) => {
        field.handleChange({
            file,
            fileKey: null,
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
    fileInfo: FileDropzoneFieldFileInfo | null;
    onFileUpload: (file: File | null) => void;
}

function FileDropzoneFieldInner({
    id,
    className,
    fileInfo,
    onFileUpload,
}: FileDropzoneFieldInnerProps) {
    const { file = null, fileKey = null } = fileInfo || {};

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
                    onFileUpload(null);
                }}
            />
        );
    }

    return <div className={className}>{fileKey}</div>;
}
