import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import type { Doc } from './_generated/dataModel';

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

export type ProjectStatus = typeof vProjectStatus.type;

export const vProjectPriority = v.union(
    v.literal('low'),
    v.literal('medium'),
    v.literal('high')
);

export type ProjectPriority = typeof vProjectPriority.type;

export const vModalJobStatus = v.union(
    v.literal('pending'),
    v.literal('cancelled'),
    v.literal('running'),
    v.literal('success'),
    v.literal('failed')
);

export type ModalJobStatus = typeof vModalJobStatus.type;

export const vModalJobStep = v.object({
    callId: v.string(),
    name: v.string(),
    status: vModalJobStatus,
    message: v.optional(v.string()),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
});

export type ModalJobStep = typeof vModalJobStep.type;

export const vModalJobArtifactCategory = v.union(v.literal('encoded-video'));

export type ModalJobArtifactCategory = typeof vModalJobArtifactCategory.type;

export const vModalJobArtifact = v.object({
    category: vModalJobArtifactCategory,
    fileKey: v.string(),
    filename: v.string(),
    contentType: v.string(),
    contentLength: v.number(),
});

export type ModalJobArtifact = typeof vModalJobArtifact.type;

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
    modalJobs: defineTable({
        projectId: v.id('projects'),
        name: v.string(),
        steps: v.array(vModalJobStep),
        callId: v.string(),
        status: vModalJobStatus,
        result: v.optional(v.any()),
        artifacts: v.optional(v.array(vModalJobArtifact)),
    })
        .index('by_call_id', ['callId'])
        .index('by_project_id', ['projectId']),
});

export type Project = Doc<'projects'>;
export type Tag = Doc<'tags'>;

export default schema;
