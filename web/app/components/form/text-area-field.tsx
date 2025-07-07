import { Textarea, type TextareaProps } from '~/components/ui';
import { useFieldContext } from './form-context';

export type TextAreaFieldProps = TextareaProps;

export function TextAreaField(props: TextAreaFieldProps) {
    const field = useFieldContext<string>();

    return (
        <Textarea
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            isInvalid={!field.state.meta.isValid}
            errorMessage={field.state.meta.errors.join(', ')}
            {...props}
        />
    );
}
