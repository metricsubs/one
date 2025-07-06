import { AwsClient } from 'aws4fetch';
import { v } from 'convex/values';
import { action } from './_generated/server';

const forbiddenContentTypes = [
    'application/x-msdownload',
    'application/x-ms-installer',
    'application/x-ms-shortcut',
    'application/x-ms-application',
    'text/html',
    'application/xhtml+xml',
    'application/x-shockwave-flash',
];

const maxAllowedUploadSize = 1024 * 1024 * 1024 * 10; // 10GB

const s3Client = new AwsClient({
    region: process.env.S3_REGION,
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    service: 's3',
});

export const getPresignedPutObjectUrl = action({
    args: {
        key: v.string(),
        contentType: v.string(),
        contentLength: v.number(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) {
            throw new Error('Unauthorized');
        }
        let contentType = args.contentType;
        if (isContentTypeForbidden(args.contentType)) {
            contentType = 'application/octet-stream';
        }
        if (args.contentLength > maxAllowedUploadSize) {
            throw new Error('File too large');
        }
        const url = new URL(process.env.S3_ENDPOINT!);
        url.hostname = `${process.env.S3_BUCKET}.${url.hostname}`;
        const fileKey = sanitizeFilename(args.key);
        const fullFileKey = `large-files/${user.id}/${fileKey}`;
        url.pathname = `/${fullFileKey}`;
        const signedRequest = await s3Client.sign(url, {
            method: 'PUT',
            headers: {
                'Content-Type': contentType,
                'Content-Length': args.contentLength.toString(),
            },
        });
        return {
            url: signedRequest.url,
            fullFileKey,
            contentType,
            contentLength: args.contentLength,
        };
    },
});

// sanitize filename, only allow [a-z0-9-_!@#$%()], replace all other characters with underscore including spaces
function sanitizeFilename(filename: string) {
    return filename.replace(/[^a-z0-9-_!@#$%()]/g, '_');
}

function isContentTypeForbidden(contentType: string): boolean {
    return forbiddenContentTypes.some((forbidden) =>
        contentType.startsWith(forbidden)
    );
}

export const getPresignedGetObjectUrl = action({
    args: {
        fullFileKey: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) {
            throw new Error('Unauthorized');
        }
        const url = new URL(process.env.S3_ENDPOINT!);
        url.hostname = `${process.env.S3_BUCKET}.${url.hostname}`;
        url.pathname = `/${args.fullFileKey}`;
        const signedRequest = await s3Client.sign(url, {
            method: 'GET',
        });
        return signedRequest.url;
    },
});
