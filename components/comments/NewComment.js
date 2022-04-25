import { Button } from '@nextui-org/react'
import React, { useState } from 'react'
import { useAppContext } from '../../context/state'
import { useNextApi } from '../../utils/utils'
import TextEditor from '../ui/editor/TextEditor'
import UserAvatar from '../user/Avatar'

export default function NewComment({ source, commentType = 'task' }) {
  const [comment, setComment] = useState('')
  const { state, setState } = useAppContext()

  const submitNewComment = async () => {
    const bundle = {
      post: comment.text,
      html: comment.html,
    }
    const res = await useNextApi(
      'POST',
      `/api/comments?${commentType}_id=${source.id}`,
      JSON.stringify(bundle)
    )
    if (res){
        if (commentType === 'task' || commentType === 'reply'){
            setState({
                ...state,reloadTrigger:{...state.reloadTrigger,policies:true}
            })
        }
    }
  }

  return (
    <div className="flex w-full py-2">
      <div className="px-2">
        <UserAvatar squared={false} tooltip={false} size="sm" />
      </div>
      <div className="relative flex w-full flex-col space-y-2">
        <TextEditor getValue={(e) => setComment(e)} />
        <div className="absolute bottom-2 right-2 justify-end">
          <Button auto flat size="xs" onClick={() => submitNewComment()}>
            {commentType === 'reply' ? 'Reply' : 'Comment'}
          </Button>
        </div>
      </div>
    </div>
  )
}
