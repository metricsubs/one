import { ParallelHasher } from 'ts-md5';

let md5ParallelHasher: ParallelHasher | null = null;

export const initMd5ParallelHasherIfNeeded = () => {
    if (md5ParallelHasher) {
        return;
    }
    md5ParallelHasher = new ParallelHasher('/scripts/dist/md5_worker.js');
};

export const md5HashBlob = async (blob: any): Promise<string> => {
    initMd5ParallelHasherIfNeeded();
    if (!md5ParallelHasher) {
        throw new Error('Md5 parallel hasher not initialized');
    }
    const md5 = await md5ParallelHasher.hash(blob);
    return md5 as string;
};
