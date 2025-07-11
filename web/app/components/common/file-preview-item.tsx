import {
    LuDownload,
    LuFile,
    LuFileAudio,
    LuFileCode,
    LuFileImage,
    LuFileText,
    LuFileVideo,
    LuLoader,
    LuLoaderCircle,
    LuTrash,
} from 'react-icons/lu';
import { cn } from '~/lib/cn';
import type { FileType } from '~/lib/file';
import { Button, Card } from '../ui';

export interface FilePreviewItemProps {
    icon: React.ReactNode;
    className?: string;
    title: string;
    subtitle: string;
    isLoading: boolean;
    isUploading: boolean;
    uploadingProgressPct: number;
    isError: boolean;
    showDownloadButton: boolean;
    isDownloadButtonLoading: boolean;
    showDeleteButton: boolean;
    onDownloadButtonClick: () => void;
    onDeleteButtonClick: () => void;
}

export function FilePreviewItem({
    icon,
    title,
    subtitle,
    isLoading,
    isUploading,
    uploadingProgressPct,
    isError,
    showDownloadButton,
    isDownloadButtonLoading,
    showDeleteButton,
    onDownloadButtonClick,
    onDeleteButtonClick,
    className,
}: FilePreviewItemProps) {
    return (
        <Card
            className={cn(
                'flex overflow-hidden relative rounded-md p-0',
                className
            )}
        >
            {isLoading && (
                <div className="absolute top-0 right-0 w-full h-full bg-bg/80 flex items-center justify-center z-20">
                    <LuLoader className="w-6 h-6 animate-spin text-muted-foreground/50" />
                </div>
            )}
            {isUploading && (
                <div
                    className="absolute top-0 left-0 h-full bg-fg/3 transition-all"
                    style={{
                        width: `${uploadingProgressPct}%`,
                    }}
                ></div>
            )}
            <div className="relative top-0 left-0 w-full h-full flex flex-row items-center justify-between gap-2 py-2 pl-3 pr-2 z-10">
                <div className="flex flex-row items-center gap-2">
                    <div className="flex flex-row items-center shrink-0">
                        {isUploading ? (
                            <LuLoaderCircle className="w-6 h-6 animate-spin text-muted-fg" />
                        ) : (
                            icon
                        )}
                    </div>
                    <div className="flex flex-col items-start gap-0.5">
                        <span
                            className={cn(
                                'text-sm break-all text-left line-clamp-1',
                                isError ? 'text-destructive' : ''
                            )}
                        >
                            {title}
                        </span>
                        <span
                            className={cn(
                                'text-xs',
                                isError ? 'text-danger' : 'text-muted-fg'
                            )}
                        >
                            {subtitle}
                        </span>
                    </div>
                </div>
                <div className="flex flex-row items-center gap-1">
                    {showDownloadButton && (
                        <Button
                            size="sq-xs"
                            intent="plain"
                            isDisabled={isDownloadButtonLoading}
                            onClick={onDownloadButtonClick}
                        >
                            {isDownloadButtonLoading ? (
                                <LuLoader className="w-4 h-4 animate-spin text-muted-fg" />
                            ) : (
                                <LuDownload className="w-4 h-4" />
                            )}
                        </Button>
                    )}
                    {showDeleteButton && (
                        <Button
                            intent="plain"
                            size="sq-xs"
                            onClick={onDeleteButtonClick}
                        >
                            <LuTrash className="w-4 h-4 text-danger" />
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}

export interface FileIconProps {
    fileType: FileType;
    className?: string;
}

export function FileIcon({ fileType, className }: FileIconProps) {
    switch (fileType) {
        case 'image':
            return <LuFileImage className={className} />;
        case 'video':
            return <LuFileVideo className={className} />;
        case 'audio':
            return <LuFileAudio className={className} />;
        case 'document':
            return <LuFileText className={className} />;
        case 'code':
            return <LuFileCode className={className} />;
        case 'other':
            return <LuFile className={className} />;
    }
}
