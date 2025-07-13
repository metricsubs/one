import { LuImage, LuTrash2 } from 'react-icons/lu';
import { cn } from '~/lib/cn';
import { Button } from '../ui/button';
import FileDropZone from './file-dropzone';

export interface ThumbnailPickerProps {
    className?: string;
    imageUrl: string | undefined;
    file: File | undefined;
    onFileUpdate: (
        file: File | undefined,
        imageUrl: string | undefined
    ) => void;
    readonly?: boolean;
    isLoading?: boolean;
}

export function ThumbnailPicker({
    file,
    onFileUpdate,
    imageUrl,
    className,
    readonly,
    isLoading,
}: ThumbnailPickerProps) {
    if (file || imageUrl) {
        const url = file ? URL.createObjectURL(file) : (imageUrl ?? '');
        return (
            <div className={cn('relative', className)}>
                {!readonly && (
                    <div className="absolute top-0 right-0 w-full h-full flex items-center justify-center bg-bg/80 rounded-sm opacity-0 hover:opacity-100 transition-opacity duration-300 focus-within:opacity-100">
                        <Button
                            intent="plain"
                            size="sq-sm"
                            onClick={() => {
                                onFileUpdate(undefined, undefined);
                            }}
                        >
                            <LuTrash2 className="h-4 w-4 text-danger" />
                        </Button>
                    </div>
                )}
                {isLoading ? (
                    <div className="w-full h-full object-cover aspect-video rounded-sm bg-muted animate-pulse" />
                ) : (
                    <img
                        className="w-full h-full object-cover aspect-video rounded-sm"
                        src={url}
                        alt="Thumbnail"
                        width={100}
                        height={100}
                    />
                )}
            </div>
        );
    }

    return (
        <FileDropZone
            className={cn('relative sm:aspect-video', className)}
            onFileUpload={(file) => {
                onFileUpdate(file, undefined);
            }}
            icon={<LuImage className="text-subtitle h-6 w-6 mb-2" />}
            title="Upload Thumbnail"
            accept="image/jpeg,image/png,image/webp,image/jpg,image/heic,image/heif"
            subtitle="JPG, PNG, WEBP"
        />
    );
}
