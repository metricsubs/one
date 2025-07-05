import { useState } from "react";
import {
    HiBars3,
    HiBell,
    HiChartBarSquare,
    HiChatBubbleLeftRight,
    HiChevronLeft,
    HiChevronRight,
    HiCog6Tooth,
    HiDocumentText,
    HiFolderOpen,
    HiHome,
    HiMagnifyingGlass,
    HiUser,
    HiUsers,
    HiVideoCamera,
} from "react-icons/hi2";
import { Outlet } from "react-router";
import LogoIcon from "~/components/common/logo-icon";
import { Button } from "~/components/ui/button";
import { Menu } from "~/components/ui/menu";

const navigation = [
    { name: "Overview", href: "/dashboard", icon: HiHome, current: false },
    { name: "Projects", href: "/dashboard/projects", icon: HiFolderOpen, current: true },
    { name: "Team", href: "/dashboard/team", icon: HiUsers, current: false },
    { name: "Analytics", href: "/dashboard/analytics", icon: HiChartBarSquare, current: false },
    { name: "Subtitles", href: "/dashboard/subtitles", icon: HiDocumentText, current: false },
    { name: "Encoding", href: "/dashboard/encoding", icon: HiVideoCamera, current: false },
    { name: "Chat", href: "/dashboard/chat", icon: HiChatBubbleLeftRight, current: false },
    { name: "Settings", href: "/dashboard/settings", icon: HiCog6Tooth, current: false },
];

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-gray-900/80 dark:bg-black/80" onClick={() => setSidebarOpen(false)} />
                    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800">
                        <SidebarContent collapsed={false} />
                    </div>
                </div>
            )}

            {/* Desktop sidebar */}
            <div className={`hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:flex-col transition-all duration-300 ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'
                }`}>
                <SidebarContent collapsed={sidebarCollapsed} />
            </div>

            {/* Main content */}
            <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
                }`}>
                {/* Top navigation */}
                <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Mobile menu button */}
                            <Button
                                intent="outline"
                                size="sq-sm"
                                className="lg:hidden"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <HiBars3 className="h-5 w-5" />
                            </Button>

                            {/* Desktop sidebar toggle */}
                            <Button
                                intent="outline"
                                size="sq-sm"
                                className="hidden lg:flex"
                                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            >
                                {sidebarCollapsed ? (
                                    <HiChevronRight className="h-4 w-4" />
                                ) : (
                                    <HiChevronLeft className="h-4 w-4" />
                                )}
                            </Button>

                            {/* Search bar */}
                            <div className="relative hidden sm:block">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <HiMagnifyingGlass className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search projects, team members..."
                                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 pl-10 pr-3 py-2 text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Notifications */}
                            <Button intent="outline" size="sq-sm" className="relative">
                                <HiBell className="h-5 w-5" />
                                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                            </Button>

                            {/* User menu */}
                            <Menu>
                                <Menu.Trigger>
                                    <Button intent="outline" size="sm" className="flex items-center gap-2">
                                        <img
                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                                            alt="User avatar"
                                            className="h-8 w-8 rounded-full"
                                        />
                                        <span className="hidden sm:block text-gray-900 dark:text-gray-100">张小明</span>
                                    </Button>
                                </Menu.Trigger>
                                <Menu.Content>
                                    <Menu.Item>
                                        <HiUser className="h-4 w-4" />
                                        Profile
                                    </Menu.Item>
                                    <Menu.Item>
                                        <HiCog6Tooth className="h-4 w-4" />
                                        Settings
                                    </Menu.Item>
                                    <Menu.Separator />
                                    <Menu.Item>
                                        Sign out
                                    </Menu.Item>
                                </Menu.Content>
                            </Menu>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1">
                    <div className="px-4 py-6 sm:px-6 lg:px-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

function SidebarContent({ collapsed }: { collapsed: boolean }) {
    return (
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 px-4 py-6">
            {/* Logo */}
            <div className="flex h-12 items-center">
                <div className="flex items-center gap-3">
                    <LogoIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    {!collapsed && (
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white logo-font">MetricSubs</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Tech Without Boundaries</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-2">
                    {navigation.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <li key={item.name}>
                                <a
                                    href={item.href}
                                    className={`group flex gap-x-3 rounded-lg p-3 text-sm font-medium transition-colors ${item.current
                                        ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
                                        }`}
                                    title={collapsed ? item.name : undefined}
                                >
                                    <IconComponent
                                        className={`h-5 w-5 shrink-0 ${item.current ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                            }`}
                                    />
                                    {!collapsed && <span>{item.name}</span>}
                                </a>
                            </li>
                        );
                    })}
                </ul>

                {/* Team status */}
                {!collapsed && (
                    <div className="mt-8">
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                            Team Status
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-gray-600 dark:text-gray-300">5 members online</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                                <span className="text-sm text-gray-600 dark:text-gray-300">3 projects active</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                                <span className="text-sm text-gray-600 dark:text-gray-300">12 videos this month</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Current project quick info */}
                {!collapsed && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Active Project</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">TechLinked - Apple AI</p>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <div className="bg-blue-600 dark:bg-blue-400 h-1.5 rounded-full" style={{ width: '61%' }}></div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">61% complete</p>
                    </div>
                )}
            </nav>
        </div>
    );
}
