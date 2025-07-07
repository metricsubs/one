import {
    TextField as UITextField,
    type TextFieldProps as UITextFieldProps,
} from '~/components/ui';
import { useFieldContext } from './form-context';

export type TextFieldProps = UITextFieldProps;

export function TextField({ ...props }: TextFieldProps) {
    const field = useFieldContext<string>();

    return (
        <UITextField
            id={field.name}
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            isInvalid={!field.state.meta.isValid}
            errorMessage={field.state.meta.errors.join(', ')}
            {...props}
        />
    );
}
