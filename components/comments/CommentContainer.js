import React from 'react'
import { reverseList } from '../../utils/utils'
import CommentCard from './CommentCard'

export default function CommentContainer({
  comments = [],
  isSelected = false,
}) {
  const reversed = isSelected
    ? reverseList(comments)
    : comments.length > 4
    ? reverseList(comments).slice(0, 4)
    : comments
  return (
    <div className="flex flex-col w-full">
      {reversed.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </div>
  )
}
