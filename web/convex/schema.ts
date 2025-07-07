import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const vProjectStatus = v.union(
    v.literal('system-pending'),
    v.literal('planning'),
    v.literal('transcribing'),
    v.literal('transcribed'),
    v.literal('translating'),
    v.literal('translated'),
    v.literal('proofreading'),
    v.literal('proofread'),
    v.literal('completed'),
    v.literal('cancelled')
);

export const vProjectPriority = v.union(
    v.literal('low'),
    v.literal('medium'),
    v.literal('high')
);

const schema = defineSchema({
    // Your other tables...
    projects: defineTable({
        title: v.string(),
        description: v.optional(v.string()),
        thumbnailFileKey: v.optional(v.string()),
        youtubeUrl: v.optional(v.string()),
        video4kFileKey: v.optional(v.string()),
        video1080pFileKey: v.optional(v.string()),
        durationInSeconds: v.number(),
        tagIds: v.array(v.id('tags')),
        status: vProjectStatus,
        dueDate: v.optional(v.number()),
        isArchived: v.boolean(),
        subtitleDocumentSnapshot: v.optional(v.bytes()),
        transcriberUserIds: v.array(v.string()),
        translatorUserIds: v.array(v.string()),
        proofreaderUserIds: v.array(v.string()),
        priority: v.optional(vProjectPriority),
        updatedAt: v.number(),
    }),
    tags: defineTable({
        name: v.string(),
        color: v.optional(v.string()),
        isPinned: v.boolean(),
    })
        .index('by_name', ['name'])
        .index('by_is_pinned', ['isPinned']),
    subtitleDocuments: defineTable({
        projectId: v.id('projects'),
        document: v.bytes(),
    }).index('by_project_id', ['projectId']),
});

export default schema;
