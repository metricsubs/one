import { api } from 'convex/_generated/api';
import { useAction } from 'convex/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
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

export interface ThumbnailPickerFieldState {
    file: File | null;
    fileKey: string | null;
}

export function ThumbnailPickerField({
    className,
    readonly,
    label,
}: ThumbnailPickerFieldProps) {
    const field = useFieldContext<ThumbnailPickerFieldState | null>();

    const { file = null, fileKey = null } = field.state.value ?? {};

    const getDownloadUrl = useAction(api.large_files.getPresignedGetObjectUrl);

    const [imageUrl, setImageUrl] = useState<string | null>(null);
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
            setImageUrl(null);
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
                        file: file ?? null,
                        fileKey: null,
                    })
                }
                readonly={readonly ?? false}
                isLoading={isLoading}
            />
            <FieldError />
        </div>
    );
}
