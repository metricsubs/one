'use node';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v } from 'convex/values';
import { action } from './_generated/server';

const s3Client = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
});

export const getPresignedUploadUrl = action({
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
        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: `${user.id}/${args.key}`,
            ContentType: args.contentType,
            ContentLength: args.contentLength,
        });
        const presignedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 60 * 15, // 15 minutes
        });
        return presignedUrl;
    },
});
