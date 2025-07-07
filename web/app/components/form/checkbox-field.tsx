import { Checkbox, type CheckboxProps } from '~/components/ui';
import { useFieldContext } from './form-context';

export type CheckboxFieldProps = CheckboxProps;

export function CheckboxField(props: CheckboxFieldProps) {
    const field = useFieldContext<boolean>();
    const id = `checkbox-${field.name}`;

    return (
        <Checkbox
            id={id}
            isSelected={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            isInvalid={!field.state.meta.isValid}
            aria-errormessage={field.state.meta.errors.join(', ')}
            {...props}
        />
    );
}
