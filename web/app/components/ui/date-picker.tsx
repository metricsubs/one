import { IconCalendarDays, IconTrash } from '@intentui/icons';
import type { DateDuration } from '@internationalized/date';
import {
    DatePicker as DatePickerPrimitive,
    type DatePickerProps as DatePickerPrimitiveProps,
    type DateValue,
    type PopoverProps,
    type ValidationResult,
} from 'react-aria-components';
import { twJoin } from 'tailwind-merge';
import { useMediaQuery } from '~/hooks/use-media-query';
import { composeTailwindRenderProps } from '~/lib/primitive';
import { Button } from './button';
import { Calendar } from './calendar';
import { DateInput } from './date-field';
import { Dialog, DialogClose } from './dialog';
import {
    Description,
    FieldError,
    FieldGroup,
    type FieldProps,
    Label,
} from './field';
import { Modal } from './modal';
import { Popover, PopoverContent } from './popover';
import { RangeCalendar } from './range-calendar';

interface DatePickerOverlayProps extends Omit<PopoverProps, 'children'> {
    range?: boolean;
    visibleDuration?: DateDuration;
    pageBehavior?: 'visible' | 'single';
    showClearButton?: boolean;
    onClear?: () => void;
}

const DatePickerOverlay = ({
    visibleDuration = { months: 1 },
    pageBehavior = 'visible',
    range,
    showClearButton,
    onClear,
    ...props
}: DatePickerOverlayProps) => {
    const isMobile = useMediaQuery('(max-width: 767px)');

    return isMobile ? (
        <Modal.Content aria-label="Date picker" closeButton={false}>
            <div className="flex flex-col gap-y-2 justify-center items-center p-6">
                <div className="flex flex-col gap-y-2 items-center">
                    <div className="flex justify-center">
                        {range ? (
                            <RangeCalendar
                                pageBehavior={pageBehavior}
                                visibleDuration={visibleDuration}
                            />
                        ) : (
                            <Calendar />
                        )}
                    </div>
                    {showClearButton ? (
                        <DialogClose
                            className="w-full flex items-center justify-center gap-x-2"
                            intent="outline"
                            size="sm"
                            onClick={onClear}
                        >
                            <IconTrash className="size-2" />
                            Clear Selection
                        </DialogClose>
                    ) : null}
                </div>
            </div>
        </Modal.Content>
    ) : (
        <PopoverContent
            showArrow={false}
            className={twJoin(
                'flex min-w-auto max-w-none snap-x justify-center p-4 sm:min-w-[16.5rem] sm:p-2 sm:pt-3',
                visibleDuration?.months === 1 ? 'sm:max-w-2xs' : 'sm:max-w-none'
            )}
            {...props}
        >
            <Dialog className="flex flex-col gap-y-2 items-center">
                <div>
                    {range ? (
                        <RangeCalendar
                            pageBehavior={pageBehavior}
                            visibleDuration={visibleDuration}
                        />
                    ) : (
                        <Calendar />
                    )}
                </div>
                {showClearButton ? (
                    <Popover.Close
                        slot="close"
                        className="w-full flex items-center justify-center gap-x-2"
                        intent="outline"
                        size="sm"
                        onClick={onClear}
                    >
                        <IconTrash className="size-2" />
                        Clear Selection
                    </Popover.Close>
                ) : null}
            </Dialog>
        </PopoverContent>
    );
};

const DatePickerIcon = () => (
    <Button
        size="sq-sm"
        intent="plain"
        className="size-7 shrink-0 rounded pressed:bg-transparent outline-hidden outline-offset-0 hover:bg-transparent focus-visible:text-fg focus-visible:ring-0 group-open:text-fg **:data-[slot=icon]:text-muted-fg group-open:*:data-[slot=icon]:text-fg"
    >
        <IconCalendarDays />
    </Button>
);

interface DatePickerProps<T extends DateValue>
    extends DatePickerPrimitiveProps<T>,
        Pick<DatePickerOverlayProps, 'placement'>,
        Omit<FieldProps, 'placeholder'> {
    children?: React.ReactNode;
    showClearButton?: boolean;
}

const DatePicker = <T extends DateValue>({
    label,
    className,
    description,
    errorMessage,
    placement,
    children,
    showClearButton,
    ...props
}: DatePickerProps<T>) => {
    const handleClear = () => {
        props.onChange?.(null);
    };

    return (
        <DatePickerPrimitive
            {...props}
            className={composeTailwindRenderProps(
                className,
                'group flex flex-col gap-y-1 *:data-[slot=label]:font-medium'
            )}
        >
            {label && <Label>{label}</Label>}
            {children ? (
                children
            ) : (
                <FieldGroup className="min-w-40 *:[button]:last:mr-1.5 sm:*:[button]:last:mr-0.5">
                    <DateInput className="w-full" />
                    <DatePickerIcon />
                </FieldGroup>
            )}
            {description && <Description>{description}</Description>}
            <FieldError>{errorMessage}</FieldError>
            <DatePickerOverlay
                placement={placement}
                showClearButton={showClearButton}
                onClear={handleClear}
            />
        </DatePickerPrimitive>
    );
};
export { DatePicker, DatePickerIcon, DatePickerOverlay };
export type { DatePickerProps, DateValue, ValidationResult };
