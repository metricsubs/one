import { requireUserAuth } from 'convex/auth';
import { v } from 'convex/values';
import { mutation, query } from '../_generated/server';

export const getTags = query({
    args: {},
    handler: async (ctx, _args) => {
        await requireUserAuth(ctx);
        return await ctx.db.query('tags').collect();
    },
});

export const createTag = mutation({
    args: {
        name: v.string(),
        color: v.optional(v.string()),
        isPinned: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        await requireUserAuth(ctx);
        return await ctx.db.insert('tags', {
            name: args.name,
            color: args.color,
            isPinned: args.isPinned ?? false,
        });
    },
});
