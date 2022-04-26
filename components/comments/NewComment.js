import { Button } from '@nextui-org/react'
import React, { useState } from 'react'
import { useReloadContext } from '../../context/state'
import { useNextApi } from '../../utils/utils'
import TextEditor from '../ui/editor/TextEditor'
import UserAvatar from '../user/Avatar'
import FileUploaderContainer from '../files/FileUploaderContainer'

export default function NewComment({ source, commentType = 'task' }) {
  const [comment, setComment] = useState('')
  const [files, setFiles] = useState(null)
  const { reload, setReload } = useReloadContext()
  

  const submitNewComment = async () => {
    const bundle = {
      post: comment.text,
      html: comment.html,
    }
    if (comment.text.length > 1) {
      const res = await useNextApi(
        'POST',
        `/api/comments?${commentType}_id=${source.id}`,
        JSON.stringify(bundle)
      )
      if (res) {
        if (commentType === 'task' || commentType === 'reply') {
          setReload({
            ...reload,
            policies: true,
          })
        }
      }
    }
  }

  const onSave = (e) => {
    setFiles(e)
  }

  return (
    <div className="flex w-full py-2">
      <div className="px-2">
        <UserAvatar squared={false} tooltip={false} size="sm" />
      </div>
      <div className="relative flex w-full flex-col space-y-2">
        <TextEditor getValue={(e) => setComment(e)} />
        <div className="absolute bottom-2 right-2 flex items-center justify-end space-x-2">
          <FileUploaderContainer onSave={e => onSave(e)} />
          <Button
            color="success"
            auto
            flat
            size="xs"
            onClick={() => submitNewComment()}
          >
            {commentType === 'reply' ? 'Reply' : 'Comment'}
          </Button>
        </div>
      </div>
    </div>
  )
}
