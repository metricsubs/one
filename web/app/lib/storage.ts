// This is a wrapper around localStorage that allows for server-side rendering
export const localStorageWrapper = {
    getItem: (key: string) => {
        if (typeof window === 'undefined') {
            return undefined;
        }
        return localStorage.getItem(key);
    },
    setItem: (key: string, value: string) => {
        if (typeof window === 'undefined') {
            return;
        }
        localStorage.setItem(key, value);
    },
    removeItem: (key: string) => {
        if (typeof window === 'undefined') {
            return;
        }
        localStorage.removeItem(key);
    },
}
