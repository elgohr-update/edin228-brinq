import React from 'react'
import { reverseList } from '../../utils/utils'
import CommentCard from './CommentCard'

export default function CommentContainer({ comments = [], isSelected=false }) {
  const filteredComments = isSelected ? comments : comments.length > 4 ? comments.slice(0,5) : comments
  const reversed = reverseList(filteredComments)
  return (
    <div className="flex flex-col w-full">
      {reversed.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </div>
  )
}
