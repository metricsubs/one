import type { ProjectPriority } from 'convex/schema';
import { useAtom } from 'jotai';
import { FaArrowUpWideShort } from 'react-icons/fa6';
import { LuClock } from 'react-icons/lu';
import { Modal, Separator } from '~/components/ui';
import { createProjectDialogOpenAtom } from '~/core/store/project';
import { checkValidYoutubeUrl } from '~/lib/format';
import { useAppForm } from '../form/app-form';

interface ProjectFormData {
    title: string;
    description: string;
    youtubeUrl: string;
    thumbnailFile: File | null;
    video4kFile: File | null;
    video1080pFile: File | null;
    shouldKickOffSystemPrepping: boolean;
    priority: ProjectPriority | null;
    dueDate: number | null;
}

const defaultProjectFormData: ProjectFormData = {
    title: '',
    description: '',
    youtubeUrl: '',
    thumbnailFile: null,
    video4kFile: null,
    video1080pFile: null,
    shouldKickOffSystemPrepping: true,
    priority: null,
    dueDate: null,
};

export function CreateProjectDialog() {
    const [open, setOpen] = useAtom(createProjectDialogOpenAtom);

    const form = useAppForm({
        defaultValues: defaultProjectFormData,
        onSubmit: (data) => {
            console.log(data);
        },
    });

    return (
        <Modal.Content
            isOpen={open}
            onOpenChange={setOpen}
            size="2xl"
            shouldCloseOnInteractOutside={() => false}
        >
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                <Modal.Header>
                    <Modal.Title>Create Project</Modal.Title>
                    <Modal.Description>
                        Create a new project to get started.
                    </Modal.Description>
                </Modal.Header>
                <Modal.Body>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                            <div className="flex flex-1 flex-col gap-4">
                                <form.AppField
                                    name="title"
                                    validators={{
                                        onBlur: (data) => {
                                            if (data.value.length < 3) {
                                                return 'Title must be at least 3 characters long';
                                            } else if (
                                                data.value.length > 100
                                            ) {
                                                return 'Title must be less than 100 characters long';
                                            }
                                            return null;
                                        },
                                    }}
                                >
                                    {(field) => (
                                        <field.TextField
                                            label="Project Title"
                                            isRequired
                                            placeholder="Project Title"
                                        />
                                    )}
                                </form.AppField>
                                <form.AppField
                                    name="youtubeUrl"
                                    validators={{
                                        onBlur: (data) => {
                                            if (data.value.length === 0) {
                                                return null;
                                            }
                                            if (
                                                !checkValidYoutubeUrl(
                                                    data.value
                                                )
                                            ) {
                                                return 'Invalid YouTube URL';
                                            }
                                            return null;
                                        },
                                    }}
                                >
                                    {(field) => (
                                        <field.TextField
                                            label="YouTube URL"
                                            placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                        />
                                    )}
                                </form.AppField>
                            </div>
                            {/* <form.AppField name="thumbnailState">
                                {(field) => (
                                    <field.ThumbnailUploaderField className="w-full sm:w-48" />
                                )}
                            </form.AppField> */}
                        </div>
                        <form.AppField name="description">
                            {(field) => (
                                <field.TextAreaField
                                    label="Description"
                                    placeholder="Project Description"
                                />
                            )}
                        </form.AppField>
                        {/* <form.AppField name="video4kFileKey">
                            {(field) => (
                                <field.LargeFileUploaderField label="Video 4K or Best Quality" />
                            )}
                        </form.AppField>
                        <form.AppField name="video1080pFileKey">
                            {(field) => (
                                <field.LargeFileUploaderField label="Video 1080p" />
                            )}
                        </form.AppField> */}
                        {/* <TagSelector tagIds={[]} onChange={() => {}} /> */}
                        <form.AppField name="shouldKickOffSystemPrepping">
                            {(field) => (
                                <field.CheckboxField
                                    label="Kick off system prepping"
                                    description="If checked, after the project has been created, the system will start processing YouTube URL or video file, transcribe the video and generate AI subtitles."
                                />
                            )}
                        </form.AppField>
                    </div>
                </Modal.Body>
                <Modal.Footer className="w-full flex flex-col justify-between sm:flex-row">
                    <div className="flex flex-row gap-2 items-center w-full sm:w-auto">
                        <div className="flex flex-row items-center gap-1">
                            <FaArrowUpWideShort className="h-3.5 w-3.5 shrink-0" />
                            <form.AppField name="priority">
                                {(field) => (
                                    <field.PriorityPickerField className="px-1.5" />
                                )}
                            </form.AppField>
                        </div>
                        <div className="h-4 mr-1">
                            <Separator orientation="vertical" />
                        </div>
                        <div className="flex flex-row items-center gap-1">
                            <LuClock className="h-4 w-4" />
                            <form.AppField name="dueDate">
                                {(field) => (
                                    <field.MiniDatePickerField
                                        className="px-1"
                                        placeholder="Due Date"
                                    />
                                )}
                            </form.AppField>
                        </div>
                    </div>
                    <form.AppForm>
                        <form.SubmitButton label="Create" type="submit" />
                    </form.AppForm>
                </Modal.Footer>
            </form>
        </Modal.Content>
    );
}
