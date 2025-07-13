import { atom, useAtom } from 'jotai';
import { splitAtom } from 'jotai/utils';

export interface FileUploadInfo {
    file: File | undefined;
    fileKey: string | undefined;
}

export type FileUploadingStatus =
    | 'preparing'
    | 'uploading'
    | 'completed'
    | 'failed';

export interface FileUploadingItem {
    id: string;
    file: File;
    name: string;
    progress: number; // 0-100
    status: FileUploadingStatus;
    error?: string;
}

export const fileUploadingListAtom = atom<FileUploadingItem[]>([]);
export const fileUploadingItemAtomsAtom = splitAtom(fileUploadingListAtom);

export const useFileUploadingStatus = () => {
    const [_fileUploadingList, setFileUploadingList] = useAtom(
        fileUploadingListAtom
    );

    const createFileUploadingItem = (file: File) => {
        const id = crypto.randomUUID();
        const name = file.name;
        setFileUploadingList((prev) => [
            ...prev,
            { id, file, name, progress: 0, status: 'preparing' },
        ]);
        return id;
    };

    const updateFileUploadingStatus = (
        id: string,
        statusInfo: Omit<Partial<FileUploadingItem>, 'id'>
    ) => {
        setFileUploadingList((prev) => {
            const index = prev.findIndex((item) => item.id === id);
            if (index === -1) {
                return prev;
            }

            return [
                ...prev.slice(0, index),
                { ...prev[index], ...statusInfo },
                ...prev.slice(index + 1),
            ];
        });
    };

    const removeFileUploadingItem = (id: string) => {
        setFileUploadingList((prev) => prev.filter((item) => item.id !== id));
    };

    return {
        createFileUploadingItem,
        updateFileUploadingStatus,
        removeFileUploadingItem,
    };
};
