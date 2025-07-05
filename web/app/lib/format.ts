
import dayjs from 'dayjs';
import prettyBytes from 'pretty-bytes';


export function formatDate(date: string | Date) {
    // format as "Jan 5, 2025"
    return dayjs(date).format("MMM D, YYYY")
}

export function formatBytes(bytes: number) {
    return prettyBytes(bytes)
}

export function checkValidYoutubeUrl(url: string): boolean {
    if (url.length === 0) {
        return false
    }
    try {
        const parsedUrl = new URL(url)
        const youtubeHostnames = [
            "youtube.com",
            "youtu.be",
            "www.youtube.com",
        ]
        if (!youtubeHostnames.includes(parsedUrl.hostname)) {
            return false
        }
        return true
    } catch (e) {
        return false
    }
}

export function formatErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message
    }
    return "Unknown error"
}
