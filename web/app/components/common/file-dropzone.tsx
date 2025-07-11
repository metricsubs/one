import { HiCloudArrowUp } from 'react-icons/hi2';
import { cn } from '~/lib/cn';

export interface FileDropZoneProps {
    id?: string;
    className?: string;
    inputRef?: React.RefObject<HTMLInputElement>;
    icon?: React.ReactNode;
    accept?: string;
    title?: string;
    subtitle?: string;
    disabled?: boolean;
    onFileUpload: (file: File) => void;
}

export default function FileDropZone(props: FileDropZoneProps) {
    const { id, onFileUpload, inputRef, disabled } = props;

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target;
        const file = input.files?.[0];
        if (file) {
            onFileUpload(file);
        }
        input.value = '';
    };

    return (
        <div
            className={cn(
                'relative flex w-full items-center justify-center transition-all ring-0 focus-within:ring-3 ring-primary/0 focus-within:ring-primary/60 rounded-md overflow-clip',
                props.className
            )}
        >
            <label
                htmlFor={id}
                className={cn(
                    'border-border h-full flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-4',
                    disabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
                )}
            >
                <div className="flex flex-col items-center justify-center">
                    {props.icon || (
                        <HiCloudArrowUp className="text-muted-foreground  h-6 w-6 mb-2" />
                    )}
                    <p className=" text-muted-foreground text-sm">
                        {props.title || 'Upload File'}
                    </p>
                    {props.subtitle && (
                        <p className="text-hint-foreground text-xs mt-1">
                            {props.subtitle}
                        </p>
                    )}
                </div>
                <input
                    id={id}
                    ref={inputRef}
                    type="file"
                    accept={props.accept}
                    disabled={disabled}
                    className={cn(
                        'absolute inset-0 opacity-0',
                        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                    )}
                    onChange={onFileChange}
                />
            </label>
        </div>
    );
}
