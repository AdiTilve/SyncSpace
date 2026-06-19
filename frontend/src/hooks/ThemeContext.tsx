import { createContext, useContext, useEffect, useState} from "react"
import type { ReactNode } from "react"

type Theme = "dark" | "light"
type FontSize = "sm" | "base" | "lg" | "xl"

interface ThemeContextType {
    theme: Theme
    fontSize: FontSize
    toggleTheme: () => void
    changeFontSize: (size: FontSize) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
    // Read previous settings from localStorage, fallback to signature dark mode
    const [theme, setTheme] = useState<Theme>(() => {
        return (localStorage.getItem("syncspace-theme") as Theme) || "dark"
    })
    const [fontSize, setFontSize] = useState<FontSize>(() => {
        return (localStorage.getItem("syncspace-font-size") as FontSize) || "base"
    })

    // Sync theme adjustments directly onto the main HTML element class list
    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove("light", "dark")
        root.classList.add(theme)
        localStorage.setItem("syncspace-theme", theme)
    }, [theme])

    // Sync font size tracking to localStorage
    useEffect(() => {
        localStorage.setItem("syncspace-font-size", fontSize)
    }, [fontSize])

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"))
    }

    const changeFontSize = (size: FontSize) => {
        setFontSize(size)
    }

    return (
        <ThemeContext.Provider value={{ theme, fontSize, toggleTheme, changeFontSize }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context
}