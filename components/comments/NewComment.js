import { Button, Loading } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { useReloadContext, useUpdateDataContext } from '../../context/state'
import { timeout, useNextApi } from '../../utils/utils'
import TextEditor from '../ui/editor/TextEditor'
import UserAvatar from '../user/Avatar'
import FileUploaderContainer from '../files/FileUploaderContainer'
import { useSession } from 'next-auth/react'

export default function NewComment({ source, commentType = 'task' }) {
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState(null)
  const { reload, setReload } = useReloadContext()
  const { updateData, setUpdateData } = useUpdateDataContext()
  const { data: session } = useSession()

  const submitNewComment = async () => {
    const bundle = {
      post: comment.text,
      html: comment.html,
    }
    if (comment?.text?.length > 1) {
      setReload({
        ...reload,
        comment: true,
      })
      setLoading(true)
      const res = await useNextApi(
        'POST',
        `/api/comments?${commentType}_id=${source.id}`,
        JSON.stringify(bundle)
      )
      if (res) {
        console.log(res)
        if (files) {
          const formData = new FormData()
          for (let fil of files) {
            formData.append('files', fil.data) // note, no square-brackets
            formData.append(
              'params',
              JSON.stringify({
                description: fil.description,
                private: fil.private,
              })
            )
          }
          const upload = await fetch(
            `${process.env.NEXT_PUBLIC_FETCHBASE_URL}/files/?comment_id=${res.id}`,
            {
              method: `POST`,
              headers: {
                Authorization: `Bearer ${session.accessToken}`,
              },
              body: formData,
            }
          )
          if (upload) {
            setReload({
              ...reload,
              activities: true,
            })
          }
        }
        if (commentType === 'task' || commentType === 'reply') {
          updateTaskData(res.source_id)
          setReload({
            ...reload,
            policies: true,
          })
          setFiles(null)
          setComment('')
          setLoading(false)
        }
      }
    }
  }

  const updateTaskData = async (task_id=null) => {
    const task = await useNextApi('GET', `/api/task/${task_id}`)
    if (task) {
      setUpdateData({
        ...updateData,
        task: task,
      })
    }
  }

  const onSave = (e) => {
    setFiles(e)
  }

  return (
    <div className="flex w-full py-2">
      {/* <div className="px-2">
        <UserAvatar squared={false} tooltip={false} size="sm" />
      </div> */}
      <div className="relative flex flex-col w-full space-y-2">
        {loading ? (
          <div className="absolute z-50 flex items-center justify-center w-full h-full rounded-lg">
            <Loading
              type="points"
              size="md"
              color="primary"
              textColor="primary"
            />
          </div>
        ) : null}
        <TextEditor getValue={(e) => setComment(e)} />
        <div className="absolute z-40 flex items-center justify-end space-x-2 bottom-2 right-2">
          <FileUploaderContainer onSave={(e) => onSave(e)} />
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
