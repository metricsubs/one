import { requireUserAuth } from 'convex/auth';
import { vProjectPriority, vProjectStatus } from 'convex/schema';
import { v } from 'convex/values';
import { mutation, query } from '../_generated/server';

export const getProjects = query({
    args: {},
    handler: async (ctx, _args) => {
        await requireUserAuth(ctx);
        let query = ctx.db.query('projects');
        return await query.collect();
    },
});

export const createProject = mutation({
    args: {
        title: v.string(),
        description: v.optional(v.string()),
        thumbnailFileKey: v.optional(v.string()),
        youtubeUrl: v.optional(v.string()),
        video4kFileKey: v.optional(v.string()),
        video1080pFileKey: v.optional(v.string()),
        durationInSeconds: v.optional(v.number()),
        tagIds: v.optional(v.array(v.id('tags'))),
        status: v.optional(vProjectStatus),
        dueDate: v.optional(v.number()),
        priority: v.optional(vProjectPriority),
    },
    handler: async (ctx, args) => {
        await requireUserAuth(ctx);
        const projectId = await ctx.db.insert('projects', {
            title: args.title,
            description: args.description,
            thumbnailFileKey: args.thumbnailFileKey,
            youtubeUrl: args.youtubeUrl,
            video4kFileKey: args.video4kFileKey,
            video1080pFileKey: args.video1080pFileKey,
            durationInSeconds: args.durationInSeconds ?? 0,
            tagIds: args.tagIds ?? [],
            status: args.status ?? 'planning',
            dueDate: args.dueDate,
            priority: args.priority,
            isArchived: false,
            transcriberUserIds: [],
            translatorUserIds: [],
            proofreaderUserIds: [],
            updatedAt: Date.now(),
        });

        return {
            projectId,
        };
    },
});
