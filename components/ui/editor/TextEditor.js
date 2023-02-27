import React, { useEffect } from 'react'
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
import { useReloadContext } from '../../../context/state'
import { timeout } from '../../../utils/utils'

export default function TextEditor({ getValue, isComment=true }) {
  const { isDark, type } = useTheme()
  const { reload, setReload } = useReloadContext()
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

  useEffect(() => {
    if (reload.comment && isComment) {
      let isCancelled = false
      const handleChange = async () => {
        await timeout(100)
        if (!isCancelled) {
          editor.commands.clearContent()
          setReload({
            ...reload,
            comment: false,
          })
        }
      }
      handleChange()
      return () => {
        isCancelled = true
      }
    }
  }, [reload])

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
        className={`menubar-${type} flex border-t border-gray-600/40 w-full items-center space-x-2 pt-4`}
      >
        <button
          className={` flex item-center justify-center custom__button text-xs ${
            checkActive('bold') ? `text-editor-is-active-button` : ''
          }`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <AiOutlineBold />
        </button>
        <button
          className={` flex item-center justify-center custom__button text-xs ${
            checkActive('italic') ? `text-editor-is-active-button` : ''
          }`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <AiOutlineItalic />
        </button>
        <button
          className={` flex item-center justify-center custom__button text-xs ${
            checkActive('strike') ? `text-editor-is-active-button` : ''
          }`}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <AiOutlineStrikethrough />
        </button>
        <button
          className={` flex item-center justify-center custom__button text-xs ${
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
          className={` flex item-center justify-center custom__button text-xs ${
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
          className={` flex item-center justify-center custom__button text-xs ${
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
          className={` flex item-center justify-center custom__button text-xs ${
            checkActive('bulletList') ? `text-editor-is-active-button` : ''
          }`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <AiOutlineUnorderedList />
        </button>
        <button
          className={` flex item-center justify-center custom__button text-xs ${
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
