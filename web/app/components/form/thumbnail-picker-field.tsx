import { api } from 'convex/_generated/api';
import { useAction } from 'convex/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { FileUploadInfo } from '~/core/file';
import { cn } from '~/lib/cn';
import { ThumbnailPicker } from '../common/thumbnail-picker';
import { Label } from '../ui';
import { FieldError } from './field-error';
import { useFieldContext } from './form-context';

export interface ThumbnailPickerFieldProps {
    className?: string;
    readonly?: boolean;
    label?: string;
}

export function ThumbnailPickerField({
    className,
    readonly,
    label,
}: ThumbnailPickerFieldProps) {
    const field = useFieldContext<FileUploadInfo | undefined>();

    const { file = undefined, fileKey = undefined } = field.state.value ?? {};

    const getDownloadUrl = useAction(api.large_files.getPresignedGetObjectUrl);

    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (fileKey) {
            setIsLoading(true);
            getDownloadUrl({ fullFileKey: fileKey })
                .then(setImageUrl)
                .catch((error) => {
                    console.error(error);
                    toast.error('Failed to load thumbnail');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setImageUrl(undefined);
        }
    }, [fileKey, getDownloadUrl]);

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            {label && <Label>{label}</Label>}
            <ThumbnailPicker
                file={file}
                imageUrl={imageUrl}
                onFileUpdate={(file) =>
                    field.handleChange({
                        file: file ?? undefined,
                        fileKey: fileKey ?? undefined,
                    })
                }
                readonly={readonly ?? false}
                isLoading={isLoading}
            />
            <FieldError />
        </div>
    );
}
