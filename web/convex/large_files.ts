import { AwsClient } from 'aws4fetch';
import { v } from 'convex/values';
import path from 'path-browserify-esm';
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

const forbiddenFilenameExtensions = [
    '.exe',
    '.msi',
    '.lnk',
    '.app',
    '.bat',
    '.cmd',
    '.sh',
    '.bash',
    '.zsh',
    '.fish',
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
        filename: v.string(),
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

        const fullFileKey = getFullFileKeyFromFilename(
            String(user.id) || '_unknown',
            args.filename
        );

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

export const getObjectMetadata = action({
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
        const response = await s3Client.fetch(url, {
            method: 'HEAD',
        });
        if (!response.ok) {
            throw new Error('Failed to get object metadata');
        }
        return {
            contentType: response.headers.get('Content-Type'),
            contentLength: response.headers.get('Content-Length'),
            lastModified: response.headers.get('Last-Modified'),
            etag: response.headers.get('ETag'),
            metadata: response.headers.get('x-amz-meta-metadata'),
        };
    },
});

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

export const startMultipartUpload = action({
    args: {
        filename: v.string(),
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
        const fullFileKey = getFullFileKeyFromFilename(
            String(user.id) || '_unknown',
            args.filename
        );
        url.pathname = `/${fullFileKey}?uploads`;
        const response = await s3Client.fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': args.contentType,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to start multipart upload');
        }
        const { uploadId } = await response.json();
        return {
            uploadId,
            fullFileKey,
            contentType,
        };
    },
});

export const getPresignedPartUploadUrl = action({
    args: {
        fullFileKey: v.string(),
        uploadId: v.string(),
        partNumber: v.number(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) {
            throw new Error('Unauthorized');
        }
        const url = new URL(process.env.S3_ENDPOINT!);
        url.hostname = `${process.env.S3_BUCKET}.${url.hostname}`;
        url.pathname = `/${args.fullFileKey}?uploadId=${args.uploadId}&partNumber=${args.partNumber}`;
        const signedRequest = await s3Client.sign(url, {
            method: 'PUT',
        });
        return {
            url: signedRequest.url,
            fullFileKey: args.fullFileKey,
            uploadId: args.uploadId,
            partNumber: args.partNumber,
        };
    },
});

export const completeMultipartUpload = action({
    args: {
        fullFileKey: v.string(),
        uploadId: v.string(),
        parts: v.array(
            v.object({
                partNumber: v.number(),
                etag: v.string(),
            })
        ),
    },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) {
            throw new Error('Unauthorized');
        }
        const url = new URL(process.env.S3_ENDPOINT!);
        url.hostname = `${process.env.S3_BUCKET}.${url.hostname}`;
        url.pathname = `/${args.fullFileKey}?uploadId=${args.uploadId}`;
        const response = await s3Client.fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/xml',
            },
            body: getCompleteMultipartUploadBody(args.parts),
        });
        if (!response.ok) {
            throw new Error('Failed to complete multipart upload');
        }
        return {
            fullFileKey: args.fullFileKey,
        };
    },
});

function getCompleteMultipartUploadBody(
    parts: {
        partNumber: number;
        etag: string;
    }[]
) {
    const xml = `
    <CompleteMultipartUpload>
        ${parts.map((part) => `<Part><PartNumber>${part.partNumber}</PartNumber><ETag>${part.etag}</ETag></Part>`).join('')}
    </CompleteMultipartUpload>
    `;
    return xml;
}

// sanitize filename, only allow [a-z0-9-_!@#$%()], replace all other characters with underscore including spaces
function sanitizeFilename(filename: string): string {
    return filename.trim().replace(/[^a-z0-9-_!@#$%()]/g, '_');
}

function sanitizeFilenameExtension(ext: string): string {
    return ext
        .trim()
        .replace(/[^a-zA-Z0-9\.]/g, '')
        .toLocaleLowerCase();
}

function isContentTypeForbidden(contentType: string): boolean {
    return forbiddenContentTypes.some((forbidden) =>
        contentType.startsWith(forbidden)
    );
}

function getFullFileKeyFromFilename(userId: string, filename: string) {
    const { ext, name } = path.parse(filename);
    let sanitizedName = sanitizeFilename(name);
    let sanitizedExt = sanitizeFilenameExtension(ext);
    if (isForbiddenFilenameExtension(sanitizedExt)) {
        sanitizedExt = '';
    }
    if (sanitizedName.length > 50) {
        sanitizedName = sanitizedName.slice(0, 50);
    }
    const randomString = generateRandomString(10);
    const fileKey = `${sanitizedName}_${randomString}${sanitizedExt}`;

    return `large-files/${userId}/${fileKey}`;
}

function isForbiddenFilenameExtension(ext: string) {
    return forbiddenFilenameExtensions.includes(ext);
}

function generateRandomString(length: number) {
    return Math.random()
        .toString(36)
        .substring(2, 2 + length);
}
