import {
    AbortMultipartUploadCommand,
    CompleteMultipartUploadCommand,
    CreateMultipartUploadCommand,
    GetObjectCommand,
    HeadObjectCommand,
    PutObjectCommand,
    S3Client,
    UploadPartCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v } from 'convex/values';
import path from 'path-browserify-esm';
import { action } from './_generated/server';
import { requireUserAuth } from './auth';

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

const s3Client = new S3Client({
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
    runtime: 'edge', // works for convex default runtime
});

export const getPresignedPutObjectUrl = action({
    args: {
        filename: v.string(),
        contentType: v.string(),
        contentLength: v.number(),
    },
    handler: async (ctx, args) => {
        const user = await requireUserAuth({ ctx });
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

        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: fullFileKey,
            ContentType: contentType,
            ContentLength: args.contentLength,
        });

        const signedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 60 * 15, // 15 minutes
        });

        return {
            url: signedUrl,
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
        const user = await requireUserAuth({ ctx });
        const command = new HeadObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: args.fullFileKey,
        });
        const response = await s3Client.send(command);
        if (response.ContentLength === undefined) {
            throw new Error('File not found');
        }
        return {
            contentType: response.ContentType,
            contentLength: response.ContentLength,
            lastModified: response.LastModified?.toISOString(),
            etag: response.ETag,
            metadata: response.Metadata,
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
        const command = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: args.fullFileKey,
        });
        const signedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 60 * 30, // 30 minutes
        });
        return signedUrl;
    },
});

export const startMultipartUpload = action({
    args: {
        filename: v.string(),
        contentType: v.string(),
        contentLength: v.number(),
    },
    handler: async (ctx, args) => {
        const user = await requireUserAuth({ ctx });
        let contentType = args.contentType;
        if (isContentTypeForbidden(args.contentType)) {
            contentType = 'application/octet-stream';
        }
        if (args.contentLength > maxAllowedUploadSize) {
            throw new Error('File too large');
        }
        const fullFileKey = getFullFileKeyFromFilename(
            String(user.id) || '_unknown',
            args.filename
        );
        const command = new CreateMultipartUploadCommand({
            Bucket: process.env.S3_BUCKET,
            Key: fullFileKey,
            ContentType: contentType,
        });
        const response = await s3Client.send(command);
        if (response.UploadId === undefined) {
            throw new Error('Failed to start multipart upload');
        }
        return {
            uploadId: response.UploadId,
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
        await requireUserAuth({ ctx });
        const command = new UploadPartCommand({
            Bucket: process.env.S3_BUCKET,
            Key: args.fullFileKey,
            UploadId: args.uploadId,
            PartNumber: args.partNumber,
        });
        const signedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 60 * 15, // 15 minutes
        });
        return {
            url: signedUrl,
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
        await requireUserAuth({ ctx });
        const command = new CompleteMultipartUploadCommand({
            Bucket: process.env.S3_BUCKET,
            Key: args.fullFileKey,
            UploadId: args.uploadId,
            MultipartUpload: {
                Parts: args.parts.map((item) => {
                    return {
                        ETag: item.etag,
                        PartNumber: item.partNumber,
                    };
                }),
            },
        });
        const response = await s3Client.send(command);
        if (response.Location === undefined) {
            throw new Error('Failed to complete multipart upload');
        }
        return {
            fullFileKey: args.fullFileKey,
        };
    },
});

export const abortMultipartUpload = action({
    args: {
        fullFileKey: v.string(),
        uploadId: v.string(),
    },
    handler: async (ctx, args) => {
        await requireUserAuth({ ctx });
        const command = new AbortMultipartUploadCommand({
            Bucket: process.env.S3_BUCKET,
            Key: args.fullFileKey,
            UploadId: args.uploadId,
        });
        await s3Client.send(command);
        return {
            fullFileKey: args.fullFileKey,
        };
    },
});

// sanitize filename, only allow [a-z0-9-_!@#$%()], replace all other characters with underscore including spaces
function sanitizeFilename(filename: string): string {
    return filename.trim().replace(/[^a-zA-Z0-9-_!@#$%()]/g, '_');
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
