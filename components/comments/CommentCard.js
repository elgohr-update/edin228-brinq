import React, { useState } from 'react'
import { Tooltip, useTheme } from '@nextui-org/react'
import { getFormattedDateTime } from '../../utils/utils'
import UserAvatar from '../user/Avatar'
import { BsFillReplyFill } from 'react-icons/bs'
import NewComment from './NewComment'
import CommentContainer from './CommentContainer'
import FileTagContainer from '../files/FileTagContainer'

const CommentCard = ({
  comment,
  border = false,
  panel = false,
  shadow = false,
}) => {
  const { isDark, type } = useTheme()
  const [showReply, setShowReply] = useState(false)

  const isPanel = () => {
    return panel ? `panel-flat-${type}` : ``
  }
  const isShadow = () => {
    return shadow ? `${type}-shadow` : ``
  }
  const isBorder = () => {
    return border
      ? `${isDark ? `border-slate-900` : `border-slate-200`} border`
      : ``
  }
  const baseClass = `relative flex-col w-full pl-2 py-1 rounded-lg ${isBorder()} ${isPanel()} ${isShadow()}`
  return (
    <div className={baseClass}>
      <div className={`flex w-full`}>
        <div className="z-90 mr-4 flex">
          <UserAvatar
            squared={false}
            tooltip={false}
            size="sm"
            isUser={true}
            passUser={comment.user}
          />
        </div>
        <div className={`relative flex w-full flex-col`}>
          <div className={`flex w-full items-center justify-between`}>
            <div className="flex items-end space-x-2">
              <h4>By {comment.user.name}</h4>
              <div className="small-subtext">
                {getFormattedDateTime(comment.created)}
              </div>
            </div>

            <Tooltip content={'Reply'}>
              <div
                className="flex space-x-1 items-center cursor-pointer"
                onClick={() => setShowReply(!showReply)}
              >
                <BsFillReplyFill />
              </div>
            </Tooltip>
          </div>
          <div className="flex py-1">
            <h6>{comment.post}</h6>
          </div>
          <FileTagContainer files={comment.attachments} />
          <CommentContainer comments={comment.replies} />
          {showReply ? (
            <NewComment source={comment} commentType={'reply'} />
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default CommentCard
