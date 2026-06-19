import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import PrivateLayout from "@/layouts/PrivateLayout"
import api from "@/api/axios"
import { useTheme } from "@/hooks/ThemeContext" // Import your global theme hook

export default function DocumentEditor() {
    const { space_id, document_id } = useParams()
    const navigate = useNavigate()
    const { theme } = useTheme() // Consume the current active theme mode
    
    const [title, setTitle] = useState("")
    const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved")
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    
    const [initialContent, setInitialContent] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Fetch the document content from your backend
    useEffect(() => {
        let isMounted = true

        async function loadDocumentData() {
            try {
                const response = await api.get(`/spaces/${space_id}/documents/${document_id}`)
                const doc = response.data.data
                
                if (!isMounted) return

                setTitle(doc.title)
                
                if (doc.content && (typeof doc.content === "object" || doc.content.length > 0)) {
                    setInitialContent(doc.content)
                } else {
                    setInitialContent("<p></p>")
                }
                
                setIsLoading(false)
            } catch (error) {
                console.error("Error pulling initial document state:", error)
                navigate(`/spaces/${space_id}/documents`)
            }
        }

        loadDocumentData()

        return () => {
            isMounted = false
        }
    }, [space_id, document_id, navigate])

    // Instantiate TipTap with crisp typography formatting
    const editor = useEditor({
        extensions: [StarterKit],
        content: initialContent,
        editable: !isLoading,
        editorProps: {
            attributes: {
                // Enforces crisp high-contrast dark text directly on the gray paper sheet
                class: "prose max-w-full font-sans leading-relaxed focus:outline-none transition-all duration-200 " +
                       "text-slate-950 " +
                       "[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-slate-950 [&_h1]:mt-6 [&_h1]:mb-2 " +
                       "[&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h2]:mt-5 [&_h2]:mb-2 " +
                       "[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-900 [&_h3]:mt-4 [&_h3]:mb-1 " +
                       "[&_p]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_li]:my-1",
            },
        },
        onUpdate: ({ editor }) => {
            setSaveStatus("unsaved")
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
            saveTimerRef.current = setTimeout(() => {
                saveContent(editor.getJSON(), title)
            }, 3000)
        }
    }, [isLoading]) 

    // Save logic mechanics
    async function saveContent(content: any, currentTitle: string) {
        if (isLoading) return

        setSaveStatus("saving")
        try {
            await api.patch(`/spaces/${space_id}/documents/${document_id}`, {
                title: currentTitle,
                content
            })
            setSaveStatus("saved")
        } catch {
            setSaveStatus("unsaved")
        }
    }

    useEffect(() => {
        function handleBeforeUnload() {
            if (editor && !isLoading) {
                saveContent(editor.getJSON(), title)
            }
        }
        window.addEventListener("beforeunload", handleBeforeUnload)
        return () => window.removeEventListener("beforeunload", handleBeforeUnload)
    }, [editor, title, isLoading])

    useEffect(() => {
        return () => {
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
        }
    }, [])

    return (
        <PrivateLayout>
            {/* Main view container perfectly retains your signature dark blue or clean slate light mode */}
            <div className={`flex flex-col h-full selection:bg-blue-500/30 transition-colors duration-200 ${
                theme === "dark" ? "bg-slate-900" : "bg-slate-100"
            }`}>

                {/* Top Bar Header Area */}
                <div className={`flex items-center justify-between px-8 py-4 border-b z-10 transition-colors duration-200 ${
                    theme === "dark" ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-white"
                }`}>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate(`/spaces/${space_id}/documents`)}
                            className={`transition-all text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-md border ${
                                theme === "dark" 
                                    ? "text-slate-400 hover:text-white bg-slate-900 border-slate-800 hover:bg-slate-850" 
                                    : "text-slate-600 hover:text-slate-900 bg-slate-50 border-slate-200 hover:bg-slate-100"
                            }`}
                        >
                            ← Back
                        </button>

                        <input
                            type="text"
                            value={title}
                            onChange={(e) => {
                                const newTitle = e.target.value
                                setTitle(newTitle)
                                
                                if (!isLoading) {
                                    setSaveStatus("unsaved")
                                    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
                                    saveTimerRef.current = setTimeout(() => {
                                        if (editor) saveContent(editor.getJSON(), newTitle)
                                    }, 3000)
                                }
                            }}
                            className={`text-xl font-bold bg-transparent border-none outline-none tracking-tight min-w-[250px] ${
                                theme === "dark" ? "text-slate-100 placeholder-slate-600" : "text-slate-900 placeholder-slate-400"
                            }`}
                            placeholder={isLoading ? "Loading..." : "Untitled Document"}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Auto Sync Status Badges */}
                    <div className="text-xs tracking-wide uppercase font-mono">
                        {isLoading && <span className="text-slate-500">Loading Canvas...</span>}
                        {!isLoading && saveStatus === "saving" && (
                            <span className="text-blue-500 flex items-center gap-1.5 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" /> Saving Changes
                            </span>
                        )}
                        {!isLoading && saveStatus === "saved" && (
                            <span className="text-emerald-500 font-medium bg-emerald-500/5 px-2.5 py-1 rounded-full border border-emerald-500/10 dark:border-emerald-500/20">
                                Sync Verified
                            </span>
                        )}
                        {!isLoading && saveStatus === "unsaved" && (
                            <span className="text-amber-500 font-medium bg-amber-500/5 px-2.5 py-1 rounded-full border border-amber-500/10 dark:border-amber-500/20">
                                Local Changes
                            </span>
                        )}
                    </div>
                </div>

                {/* Document Formatting Toolbar */}
                {editor && !isLoading && (
                    <div className={`flex items-center gap-1.5 px-8 py-2.5 border-b overflow-x-auto shadow-sm transition-colors duration-200 ${
                        theme === "dark" ? "border-slate-800 bg-slate-950/80 backdrop-blur-sm" : "border-slate-200 bg-white"
                    }`}>
                        <button
                          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
                          className={`px-3 py-1.5 rounded-md text-xs font-bold tracking-wide transition-all duration-200 ${
                            editor.isActive("bold") 
                              ? "bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.15)]" 
                              : theme === "dark" ? "text-slate-400 hover:text-slate-200 hover:bg-slate-900" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          }`}
                        >B</button>
                        <button
                          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
                          className={`px-3 py-1.5 rounded-md text-xs italic transition-all duration-200 ${
                            editor.isActive("italic") 
                              ? "bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.15)]" 
                              : theme === "dark" ? "text-slate-400 hover:text-slate-200 hover:bg-slate-900" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          }`}
                        >I</button>
                        
                        <div className={`w-px h-4 mx-2 ${theme === "dark" ? "bg-slate-800" : "bg-slate-200"}`} />
                        
                        <button
                          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 1 }).run(); }}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                            editor.isActive("heading", { level: 1 }) 
                              ? "bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.15)]" 
                              : theme === "dark" ? "text-slate-400 hover:text-slate-200 hover:bg-slate-900" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          }`}
                        >H1</button>
                        <button
                          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                            editor.isActive("heading", { level: 2 }) 
                              ? "bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.15)]" 
                              : theme === "dark" ? "text-slate-400 hover:text-slate-200 hover:bg-slate-900" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          }`}
                        >H2</button>
                        <button
                          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run(); }}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                            editor.isActive("heading", { level: 3 }) 
                              ? "bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.15)]" 
                              : theme === "dark" ? "text-slate-400 hover:text-slate-200 hover:bg-slate-900" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          }`}
                        >H3</button>
                        
                        <div className={`w-px h-4 mx-2 ${theme === "dark" ? "bg-slate-800" : "bg-slate-200"}`} />
                        
                        <button
                          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
                          className={`px-3 py-1.5 rounded-md text-xs transition-all duration-200 ${
                            editor.isActive("bulletList") 
                              ? "bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.15)]" 
                              : theme === "dark" ? "text-slate-400 hover:text-slate-200 hover:bg-slate-900" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          }`}
                        >• List</button>
                        <button
                          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
                          className={`px-3 py-1.5 rounded-md text-xs transition-all duration-200 ${
                            editor.isActive("orderedList") 
                              ? "bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.15)]" 
                              : theme === "dark" ? "text-slate-400 hover:text-slate-200 hover:bg-slate-900" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          }`}
                        >1. List</button>
                    </div>
                )}

                {/* Inner Viewport Wrapper (Your signature dark blue space) */}
                <div className={`flex-1 overflow-auto px-4 py-16 transition-colors duration-200 ${
                    theme === "dark" ? "bg-slate-900" : "bg-slate-100"
                }`}>
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64 text-slate-500 animate-pulse text-sm font-mono tracking-widest uppercase">
                            Allocating Space Secure Nodes...
                        </div>
                    ) : (
                        /* FIXED: Exact middle ground custom gray tone hex for smooth layout blending */
                        <div className={`max-w-[800px] mx-auto w-full p-16 rounded-2xl border min-h-[850px] transition-all duration-300 ${
                            theme === "dark"
                                ? "bg-[#cbd5e1] border-slate-400 shadow-[0_25px_55px_rgba(0,0,0,0.45)]"
                                : "bg-white border-slate-200 shadow-xl"
                        }`}>
                            <EditorContent editor={editor} />
                        </div>
                    )}
                </div>

            </div>
        </PrivateLayout>
    )
}