import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useTheme } from "@/hooks/ThemeContext" // Injects your global theme state engine

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const [sharedExpanded, setSharedExpanded] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [accessibilityOpen, setAccessibilityOpen] = useState(false) // Controls display toggle modal

  const { theme, fontSize, toggleTheme, changeFontSize } = useTheme()

  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    // Dynamic styles swap out background classes seamlessly based on context state
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      theme === "dark" ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
    }`}>

      {/* Header */}
      <header className={`h-16 border-b px-6 flex items-center justify-between sticky top-0 z-50 transition-colors duration-200 ${
        theme === "dark" 
          ? "border-slate-800 bg-slate-950" 
          : "border-blue-100/70 bg-[#e5eaf0]" // PERFECT MIDPOINT: Clean ice-powder gray-blue tint
      }`}>

        {/* Left Section */}
        <div className="flex items-center">
          {/* Mobile Hamburger */}
          <button
            onClick={() => {
              if (window.innerWidth < 768) {
                setMobileSidebarOpen(true)
              } else {
                setSidebarCollapsed((prev) => !prev)
              }
            }}
            className={`mr-3 text-2xl transition-colors ${
              theme === "dark" ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-blue-700"
            }`}
          >
            ☰
          </button>

          {/* Logo */}
          <button
            onClick={() => navigate("/home")}
            className={`text-2xl font-bold tracking-tight transition-colors ${
              theme === "dark" 
                ? "text-blue-400 hover:text-blue-300" 
                : "text-blue-700 hover:text-blue-800"
            }`}
          >
            SyncSpace
          </button>
        </div>

        {/* Right Controls Container */}
        <div className="flex items-center gap-4">

          {/* New Accessibility Toggles Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setAccessibilityOpen((prev) => !prev)
                setProfileOpen(false) // Close profile dropdown when opening this one
              }}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                theme === "dark" 
                  ? "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-blue-400 hover:border-slate-700" 
                  : "bg-white/90 border-blue-200/80 text-slate-600 hover:bg-white hover:text-blue-700"
              }`}
              title="Display Settings"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-5 h-5 transition-transform duration-300 hover:rotate-12"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M9.813 15.904L9 21L8.188 15.904L3.103 15.152L8.188 14.4L9 9.304L9.813 14.4L14.897 15.152L9.813 15.904Z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M19.071 4.929a10 10 0 00-14.142 0M1.929 12a10 10 0 000 14.142M22.071 12a10 10 0 010 14.142M4.929 19.071a10 10 0 0014.142 0" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M17.5 7.5L17 10L16.5 7.5L14 7L16.5 6.5L17 4L17.5 6.5L20 7L17.5 7.5Z" 
                />
              </svg>
            </button>

            {accessibilityOpen && (
              <div className={`absolute right-0 mt-3 w-64 rounded-2xl border shadow-2xl p-4 z-50 transition-all ${
                theme === "dark" ? "border-slate-800 bg-slate-950" : "border-blue-200 bg-white"
              }`}>
                <h3 className={`text-xs font-bold tracking-wider uppercase mb-3 ${
                  theme === "dark" ? "text-slate-400" : "text-blue-700"
                }`}>Workspace Display</h3>

                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/10 dark:border-slate-800">
                  <span className="text-sm font-medium">Interface Color</span>
                  <button
                    onClick={toggleTheme}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 border border-blue-500/20 hover:bg-blue-500/20 transition-all"
                  >
                    {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
                  </button>
                </div>

                <div>
                  <span className="text-sm font-medium block mb-2">Text Scale</span>
                  <div className={`grid grid-cols-4 gap-1 p-1 rounded-xl ${
                    theme === "dark" ? "bg-slate-900" : "bg-blue-50/50 border border-blue-100/40"
                  }`}>
                    {(["sm", "base", "lg", "xl"] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => changeFontSize(size)}
                        className={`text-xs font-bold uppercase py-1.5 rounded-lg transition-all ${
                          fontSize === size
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                            : theme === "dark"
                              ? "text-slate-400 hover:text-slate-200"
                              : "text-slate-600 hover:text-blue-700"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Trigger */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileOpen((prev) => !prev)
                setAccessibilityOpen(false)
              }}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
                theme === "dark" ? "bg-slate-800 border-slate-700 hover:bg-slate-700" : "bg-white border-blue-200 hover:bg-blue-50"
              }`}
            >
              <span className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-blue-700"}`}>
                A
              </span>
            </button>

            {profileOpen && (
              <div className={`absolute right-0 mt-3 w-52 rounded-2xl border shadow-2xl overflow-hidden z-50 ${
                theme === "dark" ? "border-slate-700 bg-slate-950" : "border-blue-100 bg-white"
              }`}>
                <button className={`w-full text-left px-4 py-3 transition-colors text-sm font-medium border-b ${
                  theme === "dark" 
                    ? "hover:bg-slate-800 text-slate-200 border-slate-800" 
                    : "hover:bg-blue-50/40 text-slate-700 border-blue-50/60"
                }`}>
                  View Profile
                </button>

                <button
                  onClick={() => {
                    localStorage.removeItem("token")
                    navigate("/login")
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-red-500/10 hover:text-red-500 transition-colors text-sm font-medium text-slate-400 dark:text-slate-500"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden">

        {/* Mobile Overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileSidebarOpen(false)} />
        )}

        {/* Navigation Sidebar Drawer */}
        <aside
          className={`
            fixed md:relative top-0 left-0 z-50
            h-screen md:h-auto
            border-r p-4
            flex flex-col
            transition-all duration-300
            ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
            ${sidebarCollapsed ? "md:w-20" : "w-full md:w-72"}
            w-72
            ${theme === "dark" 
              ? "bg-slate-950 border-slate-800" 
              : "bg-[#e5eaf0] border-blue-100" // PERFECT MIDPOINT: Clean ice-powder gray-blue tint
            }
          `}
        >
          {/* Mobile Close Button */}
          <div className="flex justify-end mb-2 md:hidden">
            <button onClick={() => setMobileSidebarOpen(false)} className={`text-2xl ${theme === "dark" ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-blue-700"}`}>✕</button>
          </div>

          <div>
            <nav className="space-y-2">
              {/* Home Link */}
              <button
                onClick={() => {
                  navigate("/home")
                  if (window.innerWidth < 768) setMobileSidebarOpen(false)
                }}
                className={`w-full flex items-center rounded-xl px-4 py-3 text-left transition-colors text-sm font-medium
                  ${isActive("/home")
                    ? "bg-white text-blue-700 border border-blue-200/80 shadow-xs"
                    : theme === "dark" ? "text-slate-300 hover:bg-slate-800" : "text-slate-700 hover:bg-white/40 hover:text-blue-700"
                  }`}
              >
                {!sidebarCollapsed && "Home"}
              </button>

              {/* Shared Folder Directory */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setSharedExpanded((prev) => !prev)}
                  className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-left transition-colors text-sm font-medium
                    ${isActive("/shared/spaces") || isActive("/shared/documents")
                      ? "bg-white text-blue-700 border border-blue-200/80 shadow-xs"
                      : theme === "dark" ? "text-slate-200 hover:bg-slate-800" : "text-slate-700 hover:bg-white/40 hover:text-blue-700"
                    }`}
                >
                  <span>{!sidebarCollapsed && "Shared"}</span>
                  {!sidebarCollapsed && (
                    <span className={`text-slate-500 transition-transform ${sharedExpanded ? "rotate-180" : "rotate-0"}`}>⌃</span>
                  )}
                </button>

                {sharedExpanded && !sidebarCollapsed && (
                  <div className={`ml-3 border-l pl-3 space-y-2 ${theme === "dark" ? "border-slate-800" : "border-blue-100"}`}>
                    <button
                      onClick={() => {
                        navigate("/shared/spaces")
                        if (window.innerWidth < 768) setMobileSidebarOpen(false)
                      }}
                      className={`w-full rounded-lg px-3 py-2 text-left transition-colors text-xs font-medium
                        ${isActive("/shared/spaces")
                          ? "text-blue-700 bg-white font-semibold border border-blue-100 shadow-xs"
                          : theme === "dark" ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-white/30 hover:text-blue-700"
                        }`}
                    >
                      Spaces
                    </button>

                    <button
                      onClick={() => {
                        navigate("/shared/documents")
                        if (window.innerWidth < 768) setMobileSidebarOpen(false)
                      }}
                      className={`w-full rounded-lg px-3 py-2 text-left transition-colors text-xs font-medium
                        ${isActive("/shared/documents")
                          ? "text-blue-700 bg-white font-semibold border border-blue-100 shadow-xs"
                          : theme === "dark" ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-white/30 hover:text-blue-700"
                        }`}
                    >
                      Documents
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>

          <div className={`mt-auto border-t pt-4 text-xs font-medium text-center ${theme === "dark" ? "border-slate-800 text-slate-500" : "border-blue-200/50 text-blue-500/60"}`}>
            {sidebarCollapsed ? "©" : "© 2026 SyncSpace™"}
          </div>
        </aside>

        {/* Dynamic Workspace Canvas Window */}
        <main className={`flex-1 overflow-auto transition-colors duration-200 ${
          theme === "dark" ? "bg-slate-900" : "bg-slate-100"
        }`}>
          {children}
        </main>

      </div>
    </div>
  )
}