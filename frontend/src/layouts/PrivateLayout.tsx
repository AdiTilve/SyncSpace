import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const [sharedExpanded, setSharedExpanded] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">

      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-950 px-6 flex items-center justify-between sticky top-0 z-50">

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
            className="mr-3 text-slate-300 hover:text-white text-2xl"
          >
            ☰
          </button>

          {/* Logo */}
          <button
            onClick={() => navigate("/home")}
            className="text-2xl font-bold tracking-tight text-blue-400 hover:text-blue-300 transition-colors"
          >
            SyncSpace
          </button>

        </div>

        {/* Profile */}
        <div className="relative">

          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition-colors"
          >
            <span className="text-sm font-semibold">
              {/* will replace with actual user initial from API */}
              A
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-52 rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl overflow-hidden z-50">

              <button className="w-full text-left px-4 py-3 hover:bg-slate-800 transition-colors text-slate-200 border-b border-slate-800">
                View Profile
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem("token")
                  navigate("/login")
                }}
                className="w-full text-left px-4 py-3 hover:bg-red-500/10 hover:text-red-400 transition-colors text-slate-200"
              >
                Logout
              </button>

            </div>
          )}

        </div>

      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* Mobile Overlay */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed md:relative top-0 left-0 z-50
            h-screen md:h-auto
            bg-slate-950 border-r border-slate-800 p-4
            flex flex-col
            transition-all duration-300
            ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
            ${sidebarCollapsed ? "md:w-20" : "w-full md:w-72"}
            w-72
          `}
        >

          {/* Mobile Close Button */}
          <div className="flex justify-end mb-2 md:hidden">
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="text-2xl text-slate-300 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div>
            <nav className="space-y-2">

              {/* Home */}
              <button
                onClick={() => {
                  navigate("/home")
                  if (window.innerWidth < 768) setMobileSidebarOpen(false)
                }}
                className={`w-full flex items-center rounded-xl px-4 py-3 text-left transition-colors
                  ${isActive("/home")
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    : "text-slate-300 hover:bg-slate-800"
                  }`}
              >
                {!sidebarCollapsed && "Home"}
              </button>

              {/* Shared */}
              <div className="space-y-2 pt-2">

                <button
                  onClick={() => setSharedExpanded((prev) => !prev)}
                  className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-left transition-colors
                    ${isActive("/shared/spaces") || isActive("/shared/documents")
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      : "text-slate-200 hover:bg-slate-800"
                    }`}
                >
                  <span>{!sidebarCollapsed && "Shared"}</span>

                  {!sidebarCollapsed && (
                    <span
                      className={`text-slate-500 transition-transform ${
                        sharedExpanded ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      ⌃
                    </span>
                  )}
                </button>

                {sharedExpanded && !sidebarCollapsed && (
                  <div className="ml-3 border-l border-slate-800 pl-3 space-y-2">

                    <button
                      onClick={() => {
                        navigate("/shared/spaces")
                        if (window.innerWidth < 768) setMobileSidebarOpen(false)
                      }}
                      className={`w-full rounded-lg px-3 py-2 text-left transition-colors
                        ${isActive("/shared/spaces")
                          ? "text-blue-400 bg-blue-500/10"
                          : "text-slate-300 hover:bg-slate-800"
                        }`}
                    >
                      Spaces
                    </button>

                    <button
                      onClick={() => {
                        navigate("/shared/documents")
                        if (window.innerWidth < 768) setMobileSidebarOpen(false)
                      }}
                      className={`w-full rounded-lg px-3 py-2 text-left transition-colors
                        ${isActive("/shared/documents")
                          ? "text-blue-400 bg-blue-500/10"
                          : "text-slate-300 hover:bg-slate-800"
                        }`}
                    >
                      Documents
                    </button>

                  </div>
                )}

              </div>

            </nav>
          </div>

          {/* Footer */}
          <div className="mt-auto border-t border-slate-800 pt-4 text-sm text-slate-500 text-center">
            {sidebarCollapsed ? "©" : "© 2026 SyncSpace™"}
          </div>

        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-slate-900 overflow-auto transition-all duration-300">
          {children}
        </main>

      </div>

    </div>
  )
}