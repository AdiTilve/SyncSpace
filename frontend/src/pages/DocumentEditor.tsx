import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import PrivateLayout from "@/layouts/PrivateLayout"
import api from "@/api/axios"

export default function DocumentEditor() {
    const { space_id, document_id } = useParams()
    const navigate = useNavigate()
    const [title, setTitle] = useState("")
    const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved")
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const editor = useEditor({
        extensions: [StarterKit],
        content: "",
        onUpdate: ({ editor }) => {
            setSaveStatus("unsaved")
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
            saveTimerRef.current = setTimeout(() => {
                saveContent(editor.getJSON())
            }, 3000)
        }
    })

    // Fetch document when editor is ready
    useEffect(() => {
        async function fetchDocument() {
            try {
                const response = await api.get(`/spaces/${space_id}/documents/${document_id}`)
                const doc = response.data.data
                setTitle(doc.title)
                if (editor && doc.content) {
                    editor.commands.setContent(doc.content)
                }
            } catch {
                navigate(`/spaces/${space_id}/documents`)
            }
        }
        if (editor) {
            fetchDocument()
        }
    }, [editor])

    // Save content function
    async function saveContent(content: any) {
        setSaveStatus("saving")
        try {
            await api.patch(`/spaces/${space_id}/documents/${document_id}`, {
                title,
                content
            })
            setSaveStatus("saved")
        } catch {
            setSaveStatus("unsaved")
        }
    }

    // Save on tab close
    useEffect(() => {
        function handleBeforeUnload() {
            if (editor) saveContent(editor.getJSON())
        }
        window.addEventListener("beforeunload", handleBeforeUnload)
        return () => window.removeEventListener("beforeunload", handleBeforeUnload)
    }, [editor, title])

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
        }
    }, [])

    return (
        <PrivateLayout>
            <div className="flex flex-col h-full">

                {/* Top Bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">

                    {/* Left - Back + Title */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(`/spaces/${space_id}/documents`)}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            ← Back
                        </button>

                        <input
                            type="text"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value)
                                setSaveStatus("unsaved")
                                if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
                                saveTimerRef.current = setTimeout(() => {
                                    if (editor) saveContent(editor.getJSON())
                                }, 3000)
                            }}
                            className="text-xl font-semibold bg-transparent border-none outline-none text-white placeholder-slate-500"
                            placeholder="Untitled"
                        />
                    </div>

                    {/* Right - Save Status */}
                    <div className="text-sm">
                        {saveStatus === "saving" && <span className="text-slate-400">Saving...</span>}
                        {saveStatus === "saved" && <span className="text-green-400">✓ Saved</span>}
                        {saveStatus === "unsaved" && <span className="text-yellow-400">Unsaved changes</span>}
                    </div>

                </div>

                {/* Toolbar */}
                {editor && (
                    <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-800">
                        <button
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={`px-3 py-1 rounded-lg text-sm font-bold transition-colors ${
                                editor.isActive("bold")
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                            }`}
                        >
                            B
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={`px-3 py-1 rounded-lg text-sm italic transition-colors ${
                                editor.isActive("italic")
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                            }`}
                        >
                            I
                        </button>
                        <div className="w-px h-5 bg-slate-700 mx-1" />
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                editor.isActive("heading", { level: 1 })
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                            }`}
                        >
                            H1
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                editor.isActive("heading", { level: 2 })
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                            }`}
                        >
                            H2
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                editor.isActive("heading", { level: 3 })
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                            }`}
                        >
                            H3
                        </button>
                        <div className="w-px h-5 bg-slate-700 mx-1" />
                        <button
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                editor.isActive("bulletList")
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                            }`}
                        >
                            • List
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                editor.isActive("orderedList")
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                            }`}
                        >
                            1. List
                        </button>
                    </div>
                )}

                {/* Editor Area */}
                <div className="flex-1 overflow-auto px-6 py-6">
                    <div className="tiptap-wrapper">
                        <EditorContent editor={editor} />
                    </div>
                </div>

            </div>
        </PrivateLayout>
    )
}