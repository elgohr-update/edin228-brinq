import React from 'react'
import CommentCard from './CommentCard'

export default function CommentContainer({ comments }) {
  return (
    <div className="flex w-full flex-col">
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </div>
  )
}
