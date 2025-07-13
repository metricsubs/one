import { internal } from 'convex/_generated/api';
import type { Id } from 'convex/_generated/dataModel';
import { requireUserAuth } from 'convex/auth';
import {
    vProjectPriority,
    vProjectStatus,
    type Project,
    type Tag,
} from 'convex/schema';
import { v } from 'convex/values';
import { workflow } from 'convex/workflow';
import { mutation, query, type MutationCtx } from '../_generated/server';

export const getProjects = query({
    args: {},
    handler: async (ctx, _args) => {
        await requireUserAuth({ ctx });
        let query = ctx.db.query('projects');
        return await query.collect();
    },
});

const getOrCreateTags = async (
    ctx: MutationCtx,
    selectedTagNames: string[]
) => {
    const allExistingTags = await ctx.db.query('tags').collect();
    const selectedExistingTags: {
        _id: Id<'tags'>;
        name: string;
    }[] = selectedTagNames
        .map((name) => {
            return allExistingTags.find(
                (tag) => tag.name.toLowerCase() === name.toLowerCase()
            );
        })
        .filter((tag): tag is Tag => tag !== undefined);
    const newTagNamesToCreate = selectedTagNames.filter((name) => {
        return !allExistingTags.some((tag) => tag.name === name);
    });
    const newTagsToCreatePromises =
        newTagNamesToCreate?.map(async (name) => {
            const id = await ctx.db.insert('tags', {
                name,
                isPinned: false,
            });
            return {
                _id: id,
                name,
            };
        }) ?? [];
    const createdTagIds = await Promise.all(newTagsToCreatePromises);
    const allSelectedTags = [...selectedExistingTags, ...createdTagIds];

    // Sort by their order in selectedTagNames
    const tagNameToIndex = new Map(
        selectedTagNames.map((name, index) => [name.toLowerCase(), index])
    );
    allSelectedTags.sort((a, b) => {
        const indexA =
            tagNameToIndex.get(a.name.toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
        const indexB =
            tagNameToIndex.get(b.name.toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
        return indexA - indexB;
    });

    return allSelectedTags;
};

export const createProject = mutation({
    args: {
        title: v.string(),
        description: v.optional(v.string()),
        thumbnailFileKey: v.optional(v.string()),
        youtubeUrl: v.optional(v.string()),
        video4kFileKey: v.optional(v.string()),
        video1080pFileKey: v.optional(v.string()),
        durationInSeconds: v.optional(v.number()),
        tagNames: v.optional(v.array(v.string())),
        status: v.optional(vProjectStatus),
        dueDate: v.optional(v.number()),
        priority: v.optional(vProjectPriority),
    },
    handler: async (ctx, args) => {
        await requireUserAuth({ ctx });

        const selectedTagNames = args.tagNames ?? [];
        const allSelectedTags = await getOrCreateTags(ctx, selectedTagNames);

        const projectId = await ctx.db.insert('projects', {
            title: args.title,
            description: args.description,
            thumbnailFileKey: args.thumbnailFileKey,
            youtubeUrl: args.youtubeUrl,
            video4kFileKey: args.video4kFileKey,
            video1080pFileKey: args.video1080pFileKey,
            durationInSeconds: args.durationInSeconds ?? 0,
            tagIds: allSelectedTags.map((tag) => tag._id),
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

export const updateProject = mutation({
    args: {
        projectId: v.id('projects'),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        thumbnailFileKey: v.optional(v.string()),
        youtubeUrl: v.optional(v.string()),
        video4kFileKey: v.optional(v.string()),
        video1080pFileKey: v.optional(v.string()),
        durationInSeconds: v.optional(v.number()),
        tagNames: v.optional(v.array(v.string())),
        status: v.optional(vProjectStatus),
    },
    handler: async (ctx, args) => {
        await requireUserAuth({ ctx });

        const { projectId, tagNames, ...restArgs } = args;

        const patchInfo: Partial<Project> = {
            ...restArgs,
            updatedAt: Date.now(),
        };

        if ('tagNames' in args) {
            const allSelectedTags = await getOrCreateTags(ctx, tagNames ?? []);
            patchInfo.tagIds = allSelectedTags.map((tag) => tag._id);
        }

        await ctx.db.patch(args.projectId, patchInfo);
    },
});

export const kickOffSystemPrepping = mutation({
    args: {
        projectId: v.id('projects'),
    },
    handler: async (ctx, args) => {
        await requireUserAuth({ ctx });

        await ctx.db.patch(args.projectId, {
            status: 'system-pending',
        });

        const workflowId = await workflow.start(
            ctx,
            internal.projects.manage.systemPrepWorkflow,
            {
                projectId: args.projectId,
            }
        );

        const status = await workflow.status(ctx, workflowId);
        console.log(status);
    },
});

export const systemPrepWorkflow = workflow.define({
    args: {
        projectId: v.id('projects'),
    },
    handler: async (step, args) => {
        const { projectId } = args;
    },
});
