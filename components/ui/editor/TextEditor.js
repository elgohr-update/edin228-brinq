import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useTheme } from '@nextui-org/react'
import {
  AiOutlineBold,
  AiOutlineItalic,
  AiOutlineStrikethrough,
  AiOutlineUnorderedList,
  AiOutlineOrderedList,
} from 'react-icons/ai'

export default function TextEditor({ getValue }) {
  const { isDark, type } = useTheme()
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p></p>',
    onUpdate({ editor }) {
      const textBundle = {
        text: editor.getText(),
        html: editor.getHTML(),
        json: editor.getJSON(),
      }
      getValue(textBundle)
    },
  })

  const checkActive = (a, b) => {
      if (editor){
        if (b) {
            return editor.isActive(a, b)
        }
        return editor.isActive(a)
      }
      return null
  }

  return (
    <div
      className={`flex flex-col border p-2 ${
        isDark ? `border-gray-600/20` : `border-gray-300/20`
      } rounded-lg ${type}-shadow`}
    >
      <EditorContent editor={editor} />
      <div
        className={`menubar-${type} flex border-t border-gray-600/40 w-full items-center space-x-2 py-2`}
      >
        <button
          className={`custom__button ${
            checkActive('bold') ? `text-editor-is-active-button` : ''
          }`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <AiOutlineBold />
        </button>
        <button
          className={`custom__button ${
            checkActive('italic') ? `text-editor-is-active-button` : ''
          }`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <AiOutlineItalic />
        </button>
        <button
          className={`custom__button ${
            checkActive('strike') ? `text-editor-is-active-button` : ''
          }`}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <AiOutlineStrikethrough />
        </button>
        <button
          className={`custom__button ${
            checkActive('heading', { level: 1 })
              ? `text-editor-is-active-button`
              : ''
          }`}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <span>H1</span>
        </button>
        <button
          className={`custom__button ${
            checkActive('heading', { level: 2 })
              ? `text-editor-is-active-button`
              : ''
          }`}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <span>H2</span>
        </button>
        <button
          className={`custom__button ${
            checkActive('heading', { level: 3 })
              ? `text-editor-is-active-button`
              : ''
          }`}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <span>H3</span>
        </button>
        <button
          className={`custom__button ${
            checkActive('bulletList') ? `text-editor-is-active-button` : ''
          }`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <AiOutlineUnorderedList />
        </button>
        <button
          className={`custom__button ${
            checkActive('orderedList') ? `text-editor-is-active-button` : ''
          }`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <AiOutlineOrderedList />
        </button>
      </div>
    </div>
  )
}
