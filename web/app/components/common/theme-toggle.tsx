import type { Selection } from '@react-types/shared';
import { LuMonitor, LuMoon, LuSun } from 'react-icons/lu';
import { useTheme, type Theme } from "~/components/providers/theme-provider";
import { Button } from "~/components/ui/button";
import { Menu } from "~/components/ui/menu";

export function ThemeToggle() {
    const { setTheme, theme } = useTheme()

    const handleSelectionChange = (selection: Selection) => {
        if (selection === "all") {
            return
        }

        setTheme(selection.values().next().value as Theme)
    }

    return (
        <Menu>
            <Button intent="outline" size="sq-md">
                <LuSun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <LuMoon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
            </Button>
            <Menu.Content selectionMode='single' selectedKeys={[theme]} onSelectionChange={handleSelectionChange}>
                <Menu.Item id="light">
                    {theme !== "light" && <LuSun className="text-muted-fg" />}
                    <Menu.Label>Light</Menu.Label>
                </Menu.Item>
                <Menu.Item id="dark">
                    {theme !== "dark" && <LuMoon className="text-muted-fg" />}
                    <Menu.Label>Dark</Menu.Label>
                </Menu.Item>
                <Menu.Item id="system">
                    {theme !== "system" && <LuMonitor className="text-muted-fg" />}
                    <Menu.Label>System</Menu.Label>
                </Menu.Item>
            </Menu.Content>
        </Menu>
    )
}
