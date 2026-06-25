import { createContext, useContext, useEffect, useState } from "react"
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
    const [theme, setTheme] = useState<Theme>(() => {
        return (localStorage.getItem("syncspace-theme") as Theme) || "dark"
    })
    const [fontSize, setFontSize] = useState<FontSize>(() => {
        return (localStorage.getItem("syncspace-font-size") as FontSize) || "base"
    })

    // Apply theme to html element
    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove("light", "dark")
        root.classList.add(theme)
        localStorage.setItem("syncspace-theme", theme)
    }, [theme])

    // Apply font size via CSS variable
    useEffect(() => {
        const sizeMap = {
            sm: "14px",
            base: "16px",
            lg: "18px",
            xl: "20px"
        }
        document.documentElement.style.setProperty("--font-size-base", sizeMap[fontSize])
        localStorage.setItem("syncspace-font-size", fontSize)
    }, [fontSize])

    // Apply saved font size on initial load
    useEffect(() => {
        const sizeMap = {
            sm: "14px",
            base: "16px",
            lg: "18px",
            xl: "20px"
        }
        document.documentElement.style.setProperty("--font-size-base", sizeMap[fontSize])
    }, [])

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