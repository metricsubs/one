import type { ProjectPriority } from 'convex/schema';
import { cn } from '~/lib/cn';
import { Button, Select } from '../ui';

const PRIORITY_TAGS: ProjectPriority[] = ['low', 'medium', 'high'];

export interface PriorityPickerProps {
    className?: string;
    priority?: ProjectPriority | null;
    isReadonly?: boolean;
    onChange?: (priority: ProjectPriority | null) => void;
}

export function PriorityPicker({
    className,
    priority,
    isReadonly,
    onChange,
}: PriorityPickerProps) {
    const onPriorityChange = (item: ProjectPriority | null) => {
        if (item === priority) {
            onChange?.(null);
        } else {
            onChange?.(item);
        }
    };

    return (
        <Select
            selectedKey={priority}
            onSelectionChange={(key) => {
                if (!key) {
                    return;
                }
                onPriorityChange(key as ProjectPriority);
            }}
        >
            <Button
                intent="plain"
                size="sm"
                className={cn(
                    priority ? 'text-secondary-fg' : 'text-muted-fg',
                    className
                )}
                isDisabled={isReadonly}
            >
                <PriorityTag priority={priority} />
            </Button>
            <Select.List>
                <Select.Option
                    className="flex flex-row justify-start text-xs font-medium text-muted-fg px-2 pt-2 pb-0 sm:pb-0 sm:text-xs"
                    isDisabled={true}
                >
                    Priority
                </Select.Option>
                {PRIORITY_TAGS.map((priority) => (
                    <Select.Option
                        id={priority}
                        textValue={priority}
                        key={priority}
                    >
                        <PriorityTag priority={priority} />
                    </Select.Option>
                ))}
            </Select.List>
        </Select>
    );
}

export interface PriorityTagProps {
    className?: string;
    priority?: ProjectPriority | null;
}

export function PriorityTag({ className, priority }: PriorityTagProps) {
    const { indicatorClassname } = getPriorityClasses(priority ?? null);
    return (
        <div className={cn('flex flex-row items-center gap-1.5', className)}>
            <span className={cn('w-2 h-2 rounded-full', indicatorClassname)} />
            <span className={cn('text-sm')}>{priority ?? 'Priority'}</span>
        </div>
    );
}

interface PriorityClasses {
    indicatorClassname: string;
}

function getPriorityClasses(priority: ProjectPriority | null): PriorityClasses {
    let indicator = 'bg-gray-500/50';

    switch (priority) {
        case 'low':
            indicator = 'bg-blue-500';
            break;
        case 'medium':
            indicator = 'bg-yellow-500';
            break;
        case 'high':
            indicator = 'bg-red-500';
            break;
        default:
            indicator = 'bg-gray-500/50';
            break;
    }

    return {
        indicatorClassname: indicator,
    };
}
