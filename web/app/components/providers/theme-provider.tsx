import { createContext, useContext, useEffect, useState } from "react";
import { localStorageWrapper } from "~/lib/storage";

export type Theme = "dark" | "light" | "system";
export type CalculatedTheme = "dark" | "light";

type ThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

type ThemeProviderState = {
    theme: Theme
    calculatedTheme: CalculatedTheme
    setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
    theme: "system",
    calculatedTheme: "light",
    setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "metricsubs-ui-theme",
    ...props
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(
        () => (localStorageWrapper.getItem(storageKey) as Theme) || defaultTheme
    );

    const [calculatedTheme, setCalculatedTheme] = useState<CalculatedTheme>('light');

    useEffect(() => {
        const root = window.document.documentElement

        root.classList.remove("light", "dark")

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? "dark"
                : "light"

            root.classList.add(systemTheme)
            setCalculatedTheme(systemTheme)

            // Add listener for system theme changes
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
            const handleChange = (e: MediaQueryListEvent) => {
                const newTheme = e.matches ? "dark" : "light"
                root.classList.remove("light", "dark")
                root.classList.add(newTheme)
                setCalculatedTheme(newTheme)
            }

            mediaQuery.addEventListener("change", handleChange)
            return () => mediaQuery.removeEventListener("change", handleChange)
        }

        root.classList.add(theme)
        setCalculatedTheme(theme as CalculatedTheme)
    }, [theme])

    const value = {
        theme,
        calculatedTheme,
        setTheme: (theme: Theme) => {
            localStorageWrapper.setItem(storageKey, theme)
            setTheme(theme)
        },
    }

    if (typeof window !== 'undefined') {
        (window as any).setTheme = value.setTheme
    }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider")

    return context
}
