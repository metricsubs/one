import { createFormHook } from '@tanstack/react-form';
import { CheckboxField } from './checkbox-field';
import { FileDropzoneField } from './file-dropzone-field';
import { fieldContext, formContext } from './form-context';
import { MiniDatePickerField } from './mini-date-picker-field';
import { PriorityPickerField } from './priority-picker-field';
import { SubmitButton } from './submit-button';
import { TagInputField } from './tag-input-field';
import { TextAreaField } from './text-area-field';
import { TextField } from './text-field';
import { ThumbnailPickerField } from './thumbnail-picker-field';

export const { useAppForm } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        TextField,
        TextAreaField,
        CheckboxField,
        ThumbnailPickerField,
        FileDropzoneField,
        TagInputField,
        PriorityPickerField,
        MiniDatePickerField,
    },
    formComponents: {
        SubmitButton,
    },
});
