import { api } from 'convex/_generated/api';
import { useMutation } from 'convex/react';
import type { ProjectPriority } from 'convex/schema';
import { useAtom } from 'jotai';
import { FaArrowUpWideShort } from 'react-icons/fa6';
import { LuClock } from 'react-icons/lu';
import { toast } from 'sonner';
import { Modal, Separator } from '~/components/ui';
import type { FileUploadInfo } from '~/core/file';
import { createProjectDialogOpenAtom } from '~/core/project';
import { useFileUpload } from '~/hooks/use-file-upload';
import { checkValidYoutubeUrl } from '~/lib/format';
import { useAppForm } from '../form/app-form';

interface ProjectFormData {
    title: string;
    description: string;
    youtubeUrl: string;
    thumbnailFileInfo: FileUploadInfo | undefined;
    video4kFileInfo: FileUploadInfo | undefined;
    shouldKickOffSystemPrepping: boolean;
    priority: ProjectPriority | undefined;
    dueDate: number | undefined;
    tagNames: string[];
}

const defaultProjectFormData: ProjectFormData = {
    title: '',
    description: '',
    youtubeUrl: '',
    thumbnailFileInfo: undefined,
    video4kFileInfo: undefined,
    shouldKickOffSystemPrepping: true,
    priority: undefined,
    dueDate: undefined,
    tagNames: [],
};

export function CreateProjectDialog() {
    const [open, setOpen] = useAtom(createProjectDialogOpenAtom);
    const createProjectMutation = useMutation(
        api.projects.manage.createProject
    );
    const updateProjectMutation = useMutation(
        api.projects.manage.updateProject
    );
    const kickOffSystemPreppingMutation = useMutation(
        api.projects.manage.kickOffSystemPrepping
    );

    const { handleBatchUploadFileTasks } = useFileUpload();

    const createProject = async (value: ProjectFormData) => {
        const {
            video4kFileInfo,
            thumbnailFileInfo,
            shouldKickOffSystemPrepping,
            ...restValues
        } = value;

        const { projectId } = await createProjectMutation(restValues);

        const { shouldUpdateFileKeys, fileKeys } =
            await handleBatchUploadFileTasks({
                video4kFileInfo,
                thumbnailFileInfo,
            });

        if (shouldUpdateFileKeys) {
            await updateProjectMutation({
                projectId,
                video4kFileKey: fileKeys.video4kFileInfo,
                thumbnailFileKey: fileKeys.thumbnailFileInfo,
            });
        }

        if (shouldKickOffSystemPrepping) {
            await kickOffSystemPreppingMutation({
                projectId,
            });
        }

        toast.success(
            'Project created successfully. ' +
                (shouldKickOffSystemPrepping
                    ? 'System prepping is kicked off.'
                    : '')
        );
    };

    const form = useAppForm({
        defaultValues: defaultProjectFormData,
        onSubmit: (data) => {
            setOpen(false);
            form.reset();

            createProject(data.value).catch((error) => {
                console.error(error);
                toast.error('Failed to create project');
            });
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
                            <form.AppField name="thumbnailFileInfo">
                                {(field) => (
                                    <field.ThumbnailPickerField
                                        className="w-full sm:w-48"
                                        label="Thumbnail"
                                    />
                                )}
                            </form.AppField>
                        </div>
                        <form.AppField name="description">
                            {(field) => (
                                <field.TextAreaField
                                    label="Description"
                                    placeholder="Project Description"
                                    className="min-h-30"
                                />
                            )}
                        </form.AppField>
                        <form.AppField name="video4kFileInfo">
                            {(field) => (
                                <field.FileDropzoneField label="Video in 4K or Best Quality" />
                            )}
                        </form.AppField>
                        <form.AppField name="tagNames">
                            {(field) => <field.TagInputField label="Tags" />}
                        </form.AppField>
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
                            <FaArrowUpWideShort className="h-3.7 w-3.7 shrink-0" />
                            <form.AppField name="priority">
                                {(field) => (
                                    <field.PriorityPickerField className="px-1.5" />
                                )}
                            </form.AppField>
                        </div>
                        <div className="h-4 mr-1">
                            <Separator orientation="vertical" />
                        </div>
                        <div className="flex flex-row items-center gap-0.5">
                            <LuClock className="h-4 w-4 shrink-0" />
                            <form.AppField name="dueDate">
                                {(field) => (
                                    <field.MiniDatePickerField placeholder="Due Date" />
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
