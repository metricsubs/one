import { useMemo, useState } from "react";
import { HiCheckCircle as CheckCircleIconSolid } from "react-icons/hi";
import {
    HiArrowTopRightOnSquare as ArrowTopRightOnSquareIcon,
    HiBookmark as BookmarkIcon,
    HiCalendar as CalendarIcon,
    HiCheckCircle as CheckCircleIcon,
    HiClock as ClockIcon,
    HiCog6Tooth as CogIcon,
    HiDocumentText as DocumentTextIcon,
    HiEllipsisVertical as EllipsisVerticalIcon,
    HiExclamationTriangle as ExclamationTriangleIcon,
    HiFire as FireIcon,
    HiLanguage as LanguageIcon,
    HiMagnifyingGlass as MagnifyingGlassIcon,
    HiPencil as PencilIcon,
    HiPlay as PlayIcon,
    HiPlus as PlusIcon,
    HiShare as ShareIcon,
    HiTrash as TrashIcon,
    HiUser as UserIcon,
    HiVideoCamera as VideoCameraIcon
} from "react-icons/hi2";
import { Button } from "~/components/ui/button";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Menu } from "~/components/ui/menu";
import { TextField } from "~/components/ui/text-field";
import { checkValidYoutubeUrl, formatDate } from "~/lib/format";

// Mock data for projects
const mockProjects = [
    {
        id: "1",
        title: "TechLinked - Why Apple's New AI Will Change Everything",
        description: "Latest TechLinked episode about Apple's AI announcements and their impact on the tech industry",
        originalVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        originalLanguage: "en",
        targetLanguage: "zh-CN",
        status: "in_progress" as const,
        priority: "high" as const,
        channelName: "TechLinked",
        videoDuration: 720, // 12 minutes
        thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=225&fit=crop",
        createdAt: new Date("2024-01-15").getTime(),
        updatedAt: new Date("2024-01-20").getTime(),
        dueDate: new Date("2024-02-01").getTime(),
        progress: {
            subtitlesTotal: 145,
            subtitlesCompleted: 89,
            subtitlesReviewed: 45,
        },
        assignedTo: {
            id: "user1",
            name: "张小明",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        },
        createdBy: {
            id: "user2",
            name: "李华",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        },
    },
    {
        id: "2",
        title: "Linus Tech Tips - Building the Ultimate Gaming Setup",
        description: "Complete guide to building a high-end gaming setup with the latest components",
        originalVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        originalLanguage: "en",
        targetLanguage: "zh-CN",
        status: "review" as const,
        priority: "medium" as const,
        channelName: "Linus Tech Tips",
        videoDuration: 1200, // 20 minutes
        thumbnailUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=225&fit=crop",
        createdAt: new Date("2024-01-10").getTime(),
        updatedAt: new Date("2024-01-25").getTime(),
        dueDate: new Date("2024-01-28").getTime(),
        progress: {
            subtitlesTotal: 200,
            subtitlesCompleted: 200,
            subtitlesReviewed: 150,
        },
        assignedTo: {
            id: "user3",
            name: "王小红",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b2a2f2e9?w=40&h=40&fit=crop&crop=face",
        },
        createdBy: {
            id: "user1",
            name: "张小明",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        },
    },
    {
        id: "3",
        title: "MKBHD - iPhone 15 Pro Max Review",
        description: "Comprehensive review of the latest iPhone with detailed analysis of new features",
        originalVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        originalLanguage: "en",
        targetLanguage: "zh-CN",
        status: "completed" as const,
        priority: "high" as const,
        channelName: "MKBHD",
        videoDuration: 900, // 15 minutes
        thumbnailUrl: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400&h=225&fit=crop",
        createdAt: new Date("2024-01-05").getTime(),
        updatedAt: new Date("2024-01-22").getTime(),
        completedAt: new Date("2024-01-22").getTime(),
        progress: {
            subtitlesTotal: 175,
            subtitlesCompleted: 175,
            subtitlesReviewed: 175,
        },
        assignedTo: {
            id: "user2",
            name: "李华",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        },
        createdBy: {
            id: "user1",
            name: "张小明",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        },
    },
    {
        id: "4",
        title: "The Verge - What's Next for AI in 2024",
        description: "Analysis of upcoming AI trends and their potential impact on technology",
        originalVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        originalLanguage: "en",
        targetLanguage: "zh-CN",
        status: "planning" as const,
        priority: "low" as const,
        channelName: "The Verge",
        videoDuration: 600, // 10 minutes
        thumbnailUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=225&fit=crop",
        createdAt: new Date("2024-01-25").getTime(),
        updatedAt: new Date("2024-01-25").getTime(),
        dueDate: new Date("2024-02-15").getTime(),
        progress: {
            subtitlesTotal: 0,
            subtitlesCompleted: 0,
            subtitlesReviewed: 0,
        },
        assignedTo: null,
        createdBy: {
            id: "user3",
            name: "王小红",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b2a2f2e9?w=40&h=40&fit=crop&crop=face",
        },
    },
    {
        id: "5",
        title: "Austin Evans - Budget Gaming PC Build 2024",
        description: "Step-by-step guide to building a budget gaming PC with the best value components",
        originalVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        originalLanguage: "en",
        targetLanguage: "zh-CN",
        status: "cancelled" as const,
        priority: "medium" as const,
        channelName: "Austin Evans",
        videoDuration: 840, // 14 minutes
        thumbnailUrl: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=225&fit=crop",
        createdAt: new Date("2024-01-08").getTime(),
        updatedAt: new Date("2024-01-18").getTime(),
        progress: {
            subtitlesTotal: 120,
            subtitlesCompleted: 30,
            subtitlesReviewed: 0,
        },
        assignedTo: {
            id: "user1",
            name: "张小明",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        },
        createdBy: {
            id: "user2",
            name: "李华",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        },
    },
];

type ProjectStatus = "planning" | "in_progress" | "review" | "completed" | "published" | "cancelled";
type ProjectPriority = "low" | "medium" | "high" | "urgent";

const statusConfig = {
    planning: { label: "Planning", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300", icon: BookmarkIcon },
    in_progress: { label: "In Progress", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300", icon: PlayIcon },
    review: { label: "Review", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300", icon: ClockIcon },
    completed: { label: "Completed", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300", icon: CheckCircleIcon },
    published: { label: "Published", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300", icon: CheckCircleIconSolid },
    cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300", icon: ExclamationTriangleIcon },
};

const priorityConfig = {
    low: { label: "Low", color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300", icon: null },
    medium: { label: "Medium", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300", icon: null },
    high: { label: "High", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300", icon: null },
    urgent: { label: "Urgent", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300", icon: FireIcon },
};

function StatusBadge({ status }: { status: ProjectStatus }) {
    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
            <IconComponent className="h-3 w-3" />
            {config.label}
        </span>
    );
}

function PriorityBadge({ priority }: { priority: ProjectPriority }) {
    const config = priorityConfig[priority];
    const IconComponent = config.icon;

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
            {IconComponent && <IconComponent className="h-3 w-3" />}
            {config.label}
        </span>
    );
}

function ProgressBar({ current, total, className = "" }: { current: number; total: number; className?: string }) {
    const percentage = total > 0 ? (current / total) * 100 : 0;

    return (
        <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 ${className}`}>
            <div
                className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(percentage, 100)}%` }}
            />
        </div>
    );
}

function formatDuration(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function ProjectCard({ project }: { project: typeof mockProjects[0] }) {
    const progressPercentage = project.progress.subtitlesTotal > 0
        ? Math.round((project.progress.subtitlesCompleted / project.progress.subtitlesTotal) * 100)
        : 0;

    const reviewPercentage = project.progress.subtitlesTotal > 0
        ? Math.round((project.progress.subtitlesReviewed / project.progress.subtitlesTotal) * 100)
        : 0;

    return (
        <Card className="hover:shadow-lg dark:hover:shadow-gray-900/25 transition-all duration-200 border-l-4 border-l-blue-500 dark:border-l-blue-400 bg-white dark:bg-gray-800">
            <CardHeader>
                <div className="flex items-start gap-3">
                    <div className="relative">
                        <img
                            src={project.thumbnailUrl}
                            alt={project.title}
                            className="w-20 h-12 object-cover rounded-lg"
                        />
                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                            {formatDuration(project.videoDuration)}
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-semibold truncate mb-1 text-gray-900 dark:text-white">
                            {project.title}
                        </CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                            {project.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <VideoCameraIcon className="h-4 w-4" />
                            <span className="font-medium">{project.channelName}</span>
                            <span>•</span>
                            <LanguageIcon className="h-4 w-4" />
                            <span>{project.originalLanguage} → {project.targetLanguage}</span>
                        </div>
                    </div>
                </div>
                <CardAction>
                    <Menu>
                        <Menu.Trigger>
                            <Button intent="plain" size="sq-sm">
                                <EllipsisVerticalIcon className="h-4 w-4" />
                            </Button>
                        </Menu.Trigger>
                        <Menu.Content>
                            <Menu.Item>
                                <PencilIcon className="h-4 w-4" />
                                Edit Project
                            </Menu.Item>
                            <Menu.Item>
                                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                                Open Video
                            </Menu.Item>
                            <Menu.Item>
                                <DocumentTextIcon className="h-4 w-4" />
                                View Subtitles
                            </Menu.Item>
                            <Menu.Item>
                                <CogIcon className="h-4 w-4" />
                                Encoding Settings
                            </Menu.Item>
                            <Menu.Separator />
                            <Menu.Item>
                                <ShareIcon className="h-4 w-4" />
                                Share Project
                            </Menu.Item>
                            <Menu.Separator />
                            <Menu.Item isDanger>
                                <TrashIcon className="h-4 w-4" />
                                Delete Project
                            </Menu.Item>
                        </Menu.Content>
                    </Menu>
                </CardAction>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <StatusBadge status={project.status} />
                    <PriorityBadge priority={project.priority} />
                </div>

                {project.progress.subtitlesTotal > 0 && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-300">Translation Progress</span>
                            <span className="font-medium text-gray-900 dark:text-white">{progressPercentage}%</span>
                        </div>
                        <ProgressBar
                            current={project.progress.subtitlesCompleted}
                            total={project.progress.subtitlesTotal}
                        />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>{project.progress.subtitlesCompleted}/{project.progress.subtitlesTotal} subtitles</span>
                            <span>{project.progress.subtitlesReviewed} reviewed</span>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        {project.assignedTo ? (
                            <div className="flex items-center gap-2">
                                <img
                                    src={project.assignedTo.avatar}
                                    alt={project.assignedTo.name}
                                    className="w-6 h-6 rounded-full"
                                />
                                <span className="text-gray-600 dark:text-gray-300">{project.assignedTo.name}</span>
                            </div>
                        ) : (
                            <span className="text-gray-400 dark:text-gray-500">Unassigned</span>
                        )}
                    </div>

                    {project.dueDate && (
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{formatDate(new Date(project.dueDate))}</span>
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="flex justify-between items-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    Created {formatDate(new Date(project.createdAt))} by {project.createdBy.name}
                </div>
                <div className="flex gap-2">
                    <Button size="sm" intent="outline">
                        <PlayIcon className="h-4 w-4" />
                        Open Editor
                    </Button>
                    {project.status === "completed" && (
                        <Button size="sm" intent="primary">
                            <CogIcon className="h-4 w-4" />
                            Encode Video
                        </Button>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}

export default function ProjectsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
    const [priorityFilter, setPriorityFilter] = useState<ProjectPriority | "all">("all");
    const [sortBy, setSortBy] = useState<"created" | "updated" | "due_date" | "priority">("updated");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const filteredProjects = useMemo(() => {
        let filtered = mockProjects;

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(project =>
                project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.channelName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter(project => project.status === statusFilter);
        }

        // Priority filter
        if (priorityFilter !== "all") {
            filtered = filtered.filter(project => project.priority === priorityFilter);
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "created":
                    return b.createdAt - a.createdAt;
                case "updated":
                    return b.updatedAt - a.updatedAt;
                case "due_date":
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return a.dueDate - b.dueDate;
                case "priority":
                    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                default:
                    return 0;
            }
        });

        return filtered;
    }, [searchQuery, statusFilter, priorityFilter, sortBy]);

    const stats = useMemo(() => {
        const total = mockProjects.length;
        const byStatus = mockProjects.reduce((acc, project) => {
            acc[project.status] = (acc[project.status] || 0) + 1;
            return acc;
        }, {} as Record<ProjectStatus, number>);

        const totalSubtitles = mockProjects.reduce((sum, project) => sum + project.progress.subtitlesTotal, 0);
        const completedSubtitles = mockProjects.reduce((sum, project) => sum + project.progress.subtitlesCompleted, 0);

        return { total, byStatus, totalSubtitles, completedSubtitles };
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
                    <p className="text-gray-600 dark:text-gray-300">Manage your subtitle translation projects</p>
                </div>
                <Button intent="primary" onClick={() => setIsCreateModalOpen(true)}>
                    <PlusIcon className="h-4 w-4" />
                    New Project
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-white dark:bg-gray-800">
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Total Projects</div>
                    </CardContent>
                </Card>
                <Card className="bg-white dark:bg-gray-800">
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.byStatus.completed || 0}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Completed</div>
                    </CardContent>
                </Card>
                <Card className="bg-white dark:bg-gray-800">
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.byStatus.in_progress || 0}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">In Progress</div>
                    </CardContent>
                </Card>
                <Card className="bg-white dark:bg-gray-800">
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {stats.totalSubtitles > 0 ? Math.round((stats.completedSubtitles / stats.totalSubtitles) * 100) : 0}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Overall Progress</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <TextField
                            placeholder="Search projects..."
                            value={searchQuery}
                            className="pl-10 w-64"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value as ProjectStatus | "all")}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    >
                        <option value="all">All Status</option>
                        <option value="planning">Planning</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="completed">Completed</option>
                        <option value="published">Published</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    <select
                        value={priorityFilter}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPriorityFilter(e.target.value as ProjectPriority | "all")}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    >
                        <option value="all">All Priority</option>
                        <option value="urgent">Urgent</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as typeof sortBy)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    >
                        <option value="updated">Sort by Updated</option>
                        <option value="created">Sort by Created</option>
                        <option value="due_date">Sort by Due Date</option>
                        <option value="priority">Sort by Priority</option>
                    </select>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-300">
                    Showing {filteredProjects.length} of {mockProjects.length} projects
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">No projects found</div>
                    <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
                </div>
            )}

            {/* Simple Modal Implementation */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Project</h2>
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Add a new video translation project to your workspace
                            </p>
                            <CreateProjectForm onClose={() => setIsCreateModalOpen(false)} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function CreateProjectForm({ onClose }: { onClose: () => void }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        videoUrl: "",
        channelName: "",
        priority: "medium" as ProjectPriority,
        dueDate: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        }

        if (!formData.videoUrl.trim()) {
            newErrors.videoUrl = "Video URL is required";
        } else if (!checkValidYoutubeUrl(formData.videoUrl)) {
            newErrors.videoUrl = "Please enter a valid YouTube URL";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Here you would typically call your API to create the project
        console.log("Creating project:", formData);

        // Reset form and close modal
        setFormData({
            title: "",
            description: "",
            videoUrl: "",
            channelName: "",
            priority: "medium",
            dueDate: "",
        });
        setErrors({});
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Project Title *
                </label>
                <TextField
                    id="title"
                    placeholder="Enter project title..."
                    value={formData.title}
                    className={errors.title ? "border-red-500 dark:border-red-400" : ""}
                />
                {errors.title && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                </label>
                <textarea
                    id="description"
                    placeholder="Enter project description..."
                    value={formData.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
            </div>

            <div>
                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Video URL *
                </label>
                <TextField
                    id="videoUrl"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={formData.videoUrl}
                    className={errors.videoUrl ? "border-red-500 dark:border-red-400" : ""}
                />
                {errors.videoUrl && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.videoUrl}</p>}
            </div>

            <div>
                <label htmlFor="channelName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Channel Name
                </label>
                <TextField
                    id="channelName"
                    placeholder="e.g., TechLinked, MKBHD"
                    value={formData.channelName}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Priority
                    </label>
                    <select
                        id="priority"
                        value={formData.priority}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, priority: e.target.value as ProjectPriority })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Due Date
                    </label>
                    <input
                        type="date"
                        id="dueDate"
                        value={formData.dueDate}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, dueDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button intent="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" intent="primary">
                    Create Project
                </Button>
            </div>
        </form>
    );
}
