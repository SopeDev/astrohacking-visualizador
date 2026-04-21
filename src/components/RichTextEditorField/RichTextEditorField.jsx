'use client'

import { useEffect, useRef } from 'react'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

function ToolbarButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onMouseDown={(event) => {
        event.preventDefault()
        onClick()
      }}
      className={`cursor-pointer rounded-md border px-2 py-1 text-xs transition ${
        active
          ? 'border-primary/60 bg-primary/20 text-foreground'
          : 'border-border bg-background text-muted-foreground hover:text-foreground'
      }`}
    >
      {children}
    </button>
  )
}

export function RichTextEditorField({ value, onChange }) {
  const onChangeRef = useRef(onChange)
  const isSyncingFromOutsideRef = useRef(false)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const editor = useEditor({
    extensions: [StarterKit],
    content: value || '<p></p>',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'min-h-[140px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:list-outside [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:list-outside [&_ol]:pl-5 [&_li]:list-item',
      },
    },
  }, [])

  const formatting = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => {
      if (!currentEditor) {
        return {
          bold: false,
          italic: false,
          bulletList: false,
          orderedList: false,
        }
      }
      return {
        bold: currentEditor.isActive('bold'),
        italic: currentEditor.isActive('italic'),
        bulletList: currentEditor.isActive('bulletList'),
        orderedList: currentEditor.isActive('orderedList'),
      }
    },
  })

  useEffect(() => {
    if (!editor) return
    const handleUpdate = ({ editor: currentEditor }) => {
      if (isSyncingFromOutsideRef.current) return
      onChangeRef.current(currentEditor.getHTML())
    }
    editor.on('update', handleUpdate)
    return () => {
      editor.off('update', handleUpdate)
    }
  }, [editor])

  useEffect(() => {
    if (!editor) return
    const currentHtml = editor.getHTML().trim()
    const incomingHtml = (value || '<p></p>').trim()
    if (currentHtml !== incomingHtml) {
      isSyncingFromOutsideRef.current = true
      editor.commands.setContent(incomingHtml, false)
      isSyncingFromOutsideRef.current = false
    }
  }, [editor, value])

  if (!editor) return null

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <ToolbarButton
          active={formatting.bold}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Negrita
        </ToolbarButton>
        <ToolbarButton
          active={formatting.italic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Cursiva
        </ToolbarButton>
        <ToolbarButton
          active={formatting.bulletList}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Lista
        </ToolbarButton>
        <ToolbarButton
          active={formatting.orderedList}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          Numerada
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
