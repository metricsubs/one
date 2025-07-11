import type { ProjectPriority } from 'convex/schema';
import { PriorityPicker } from '../common/priority-picker';
import { useFieldContext } from './form-context';

export interface PriorityPickerFieldProps {
    className?: string;
    isReadonly?: boolean;
}

export function PriorityPickerField({
    className,
    isReadonly,
}: PriorityPickerFieldProps) {
    const field = useFieldContext<ProjectPriority | null>();

    return (
        <PriorityPicker
            className={className}
            priority={field.state.value}
            isReadonly={isReadonly}
            onChange={field.handleChange}
        />
    );
}
