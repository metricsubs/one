import { createFormHook } from '@tanstack/react-form';
import { CheckboxField } from './checkbox-field';
import { fieldContext, formContext } from './form-context';
import { MiniDatePickerField } from './mini-date-picker-field';
import { PriorityPickerField } from './priority-picker-field';
import { SubmitButton } from './submit-button';
import { TextAreaField } from './text-area-field';
import { TextField } from './text-field';

export const { useAppForm } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        TextField,
        TextAreaField,
        CheckboxField,
        PriorityPickerField,
        MiniDatePickerField,
    },
    formComponents: {
        SubmitButton,
    },
});
