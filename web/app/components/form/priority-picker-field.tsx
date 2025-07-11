import type { ProjectPriority } from 'convex/schema';
import { PriorityPicker } from '../common/priority-picker';
import { useFieldContext } from './form-context';

export interface PriorityPickerFieldProps {
    className?: string;
    readonly?: boolean;
}

export function PriorityPickerField({
    className,
    readonly,
}: PriorityPickerFieldProps) {
    const field = useFieldContext<ProjectPriority | null>();

    return (
        <PriorityPicker
            className={className}
            priority={field.state.value}
            readonly={readonly}
            onChange={field.handleChange}
        />
    );
}
