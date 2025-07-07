import { LuLoaderCircle } from 'react-icons/lu';
import { Button, type ButtonProps } from '~/components/ui';
import { useFormContext } from './form-context';

export type SubmitButtonProps = ButtonProps & {
    label: string | React.ReactNode;
};

export function SubmitButton(props: SubmitButtonProps) {
    const form = useFormContext();
    return (
        <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
                <Button
                    {...props}
                    type="submit"
                    isDisabled={isSubmitting || props.isDisabled}
                    isPending
                >
                    {isSubmitting && (
                        <LuLoaderCircle className="w-4 h-4 animate-spin" />
                    )}
                    {props.label}
                </Button>
            )}
        </form.Subscribe>
    );
}
