import { Label } from '~/components/ui';

export interface FieldLabelProps {
    className?: string;
    children?: React.ReactNode;
    isRequired?: boolean;
}

export function FieldLabel({ children, className }: FieldLabelProps) {
    if (!children) return null;

    if (typeof children !== 'string') {
        return children;
    }

    return <Label className={className}>{children}</Label>;
}
