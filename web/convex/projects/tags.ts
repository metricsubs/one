import type { Id } from 'convex/_generated/dataModel';
import { requireUserAuth } from 'convex/auth';
import { v } from 'convex/values';
import { mutation, query } from '../_generated/server';

export const getTags = query({
    args: {},
    handler: async (ctx, _args) => {
        await requireUserAuth({ ctx });
        return (await ctx.db.query('tags').collect())
            .concat(
                new Array(15).fill(0).map((_, index) => {
                    return {
                        _id: `${index}` as Id<'tags'>,
                        _creationTime: 0,
                        name: `Tag ${index}`,
                        color: 'red',
                        isPinned: false,
                    };
                })
            )
            .concat([
                {
                    _id: 'techlinked' as Id<'tags'>,
                    _creationTime: 0,
                    name: 'TechLinked',
                    color: 'red',
                    isPinned: false,
                },
            ]);
    },
});

export const createTag = mutation({
    args: {
        name: v.string(),
        color: v.optional(v.string()),
        isPinned: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        await requireUserAuth({ ctx });
        return await ctx.db.insert('tags', {
            name: args.name,
            color: args.color,
            isPinned: args.isPinned ?? false,
        });
    },
});
