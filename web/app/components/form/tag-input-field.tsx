import { cn } from '~/lib/cn';
import { TagInput } from '../common/tag-input';
import { FieldLabel } from './field-label';
import { useFieldContext } from './form-context';

export interface FileDropzoneFieldFileInfo {
    file: File | null;
    fileKey: string | null;
}

export interface TagInputFieldProps {
    className?: string;
    label?: string;
    isReadOnly?: boolean;
}

export function TagInputField({
    className,
    label,
    isReadOnly,
}: TagInputFieldProps) {
    const field = useFieldContext<string[] | null>();

    const tagNames = field.state.value ?? [];

    const handleChange = (tagNames: string[]) => {
        field.handleChange(tagNames);
    };

    return (
        <div className={cn(className, 'flex flex-col gap-1')}>
            {label && <FieldLabel>{label}</FieldLabel>}
            <TagInput
                isReadOnly={isReadOnly}
                tagNames={tagNames}
                onChange={handleChange}
            />
        </div>
    );
}
