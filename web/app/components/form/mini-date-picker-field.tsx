import { fromAbsolute, ZonedDateTime } from '@internationalized/date';
import { cn } from '~/lib/cn';
import { formatDate } from '~/lib/format';
import { Button, DatePicker, FieldGroup, Label } from '../ui';
import { useFieldContext } from './form-context';

export interface MiniDatePickerFieldProps {
    className?: string;
    isReadonly?: boolean;
    placeholder?: string;
}

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function MiniDatePickerField({
    className,
    isReadonly,
    placeholder,
}: MiniDatePickerFieldProps) {
    const field = useFieldContext<number | null>();

    const timestamp = field.state.value;

    const dateValue = timestamp ? fromAbsolute(timestamp, timeZone) : null;

    const handleChange = (value: ZonedDateTime | null) => {
        field.handleChange(value?.toDate().getTime() ?? null);
    };

    return (
        <DatePicker
            value={dateValue}
            onChange={handleChange}
            isDisabled={isReadonly}
            isReadOnly={isReadonly}
            className="max-h-max h-auto overflow-visible rounded-none"
            showClearButton={!isReadonly && !!dateValue}
        >
            <FieldGroup className="shadow-none border-none inset-ring-0 ring-0 focus-within:ring-0 focus-within:inset-ring-0 focus-within:border-none w-auto h-auto max-h-max rounded-none overflow-visible *:[button]:rounded-lg *:[button]:px-2 *:[button]:py-2 *:[button]:sm:px-2 *:[button]:sm:py-1">
                <Button
                    intent="plain"
                    className={cn(
                        dateValue ? 'text-fg' : 'text-muted-fg',
                        className
                    )}
                    isDisabled={isReadonly}
                >
                    <Label className="text-sm">
                        {dateValue
                            ? formatDate(dateValue.toDate())
                            : placeholder}
                    </Label>
                </Button>
            </FieldGroup>
        </DatePicker>
    );
}
