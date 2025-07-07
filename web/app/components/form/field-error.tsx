import { FieldError as UIFieldError } from '~/components/ui';
import { useFieldContext } from './form-context';

export interface FieldErrorProps {
    className?: string;
}

export function FieldError({ className }: FieldErrorProps) {
    const field = useFieldContext();

    if (field.state.meta.isValid) return null;

    return (
        <UIFieldError className={className}>
            {field.state.meta.errors.join(', ')}
        </UIFieldError>
    );
}
