import mime from 'mime';

export const getFilenameFromKey = (key: string): string => {
    return key.split('/').pop() || '';
};

export const getFileExtensionFromKey = (key: string): string => {
    return key.split('.').pop() || '';
};

export type FileType =
    | 'image'
    | 'video'
    | 'audio'
    | 'document'
    | 'code'
    | 'other';

export const getFileTypeFromMetadata = (
    key?: string | null | undefined,
    contentType?: string | null
): FileType => {
    if (!key) {
        return 'other';
    }

    let newContentType: string | null = contentType?.trim() || null;

    if (!contentType) {
        let extension = getFileExtensionFromKey(key);
        newContentType = mime.getType(extension);
    }
    if (!newContentType) {
        return 'other';
    }

    if (newContentType.startsWith('image/')) {
        return 'image';
    } else if (newContentType.startsWith('video/')) {
        return 'video';
    } else if (newContentType.startsWith('audio/')) {
        return 'audio';
    } else if (newContentType.startsWith('application/')) {
        return 'document';
    } else if (newContentType.startsWith('text/')) {
        return 'code';
    } else {
        return 'other';
    }
};
