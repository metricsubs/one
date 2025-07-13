import { useAtom } from 'jotai';
import { useEffect } from 'react';
import {
    fileUploadingListAtom,
    type FileUploadingItem as FileUploadingItemType,
} from '~/core/file';

export interface ProjectCreatingSonnerProps {
    uploadingFileIds: string[];
    onAllUploadingFilesFinished: (
        trackedFiles: FileUploadingItemType[]
    ) => void;
}

function FileUploadingItem({ item }: { item: FileUploadingItemType }) {
    return (
        <div>
            {item.name} ({item.progress}%)
        </div>
    );
}

export function ProjectCreatingSonner({
    uploadingFileIds,
    onAllUploadingFilesFinished,
}: ProjectCreatingSonnerProps) {
    const [fileUploadingList] = useAtom(fileUploadingListAtom);

    const trackedFiles = fileUploadingList.filter((file) =>
        uploadingFileIds.includes(file.id)
    );

    useEffect(() => {
        if (
            trackedFiles.every(
                (file) =>
                    file.status === 'completed' || file.status === 'failed'
            )
        ) {
            onAllUploadingFilesFinished(trackedFiles);
        }
    }, [trackedFiles, onAllUploadingFilesFinished]);

    return (
        <div>
            {trackedFiles.map((file) => (
                <FileUploadingItem key={file.id} item={file} />
            ))}
        </div>
    );
}
