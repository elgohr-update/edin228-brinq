import React, { useState } from 'react'
import { useTheme } from '@nextui-org/react'
import { getConstantIcons, getFormattedDate } from '../../utils/utils'
import UserAvatar from '../user/Avatar'
import NewComment from '../comments/NewComment'
import CommentContainer from '../comments/CommentContainer'
import TaskCompletion from './TaskCompletion'
import TagBasic from '../ui/tag/TagBasic'

const TaskCard = ({
  task,
  border = false,
  vertical = false,
  showPolicy = false,
  panel = false,
  shadow = false,
}) => {
  const { isDark, type } = useTheme()
  const [selected, setSelected] = useState(false)

  const isVertical = () => {
    return vertical ? `flex-col space-y-2` : `flex-row items-center`
  }
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
  const isSelected = () => {
    return selected ? `bg-gray-500/10 ${type}-shadow` : `hover:bg-gray-500/10 `
  }
  const isLate = (due) => {
    const today = new Date()
    const date = new Date(due)
    return today > date ? `text-color-error` : ``
  }

  const baseClass = `${isSelected()} cursor-pointer text-xs flex flex-col w-full h-full relative transition-all duration-100 ease-out w-full p-2 rounded-lg ${isBorder()} ${isVertical()} ${isPanel()} ${isShadow()}`
  return (
    <div className={baseClass}>
      <div className={`flex w-full items-center space-x-4`}>
        <TaskCompletion task={task} />
        <div
          className="flex w-full space-x-4"
          onClick={() => setSelected(!selected)}
        >
          <div className="flex flex-col space-y-1 md:space-y-0 md:flex-row md:items-center flex-auto shrink-0">
            <div className={`relative flex flex-auto flex-col space-y-1`}>
              {showPolicy ? (
                <div className="flex items-center space-x-1 text-xs">
                  <TagBasic text={task?.policy_type} />
                  <h4>{task?.policy_number}</h4>
                </div>
              ) : null}
              <div className="text-xs">{task?.title}</div>
            </div>
            <div className="flex items-center space-x-2">
              {task.done ? (
                <div
                  className={`text-color-success w-[90px] relative flex flex-row space-x-1`}
                >
                  <h6>{getConstantIcons('circleCheck')}</h6>
                  <h6 className={`letter-spacing-1 flex flex-auto justify-end`}>
                    {getFormattedDate(task?.completed_date)}
                  </h6>
                </div>
              ) : null}
              <div
                className={`w-[90px] relative flex flex-row space-x-1`}
              >
                <h4>{getConstantIcons('clock')}</h4>
                <h4
                  className={`letter-spacing-1 flex flex-auto justify-end ${
                    task.done
                      ? `line-through`
                      : `${isLate(task.date)} opacity-100`
                  }`}
                >
                  {getFormattedDate(task?.date)}
                </h4>
              </div>
            </div>
          </div>
          <div className={`w-50 relative flex flex-col  space-y-1`}>
            <UserAvatar
              isUser
              size="sm"
              squared={false}
              passUser={task.users.find((x) => x.id == task.assigned_id)}
            />
          </div>
          <div className="flex items-center">
            <div className="flex items-center space-x-1 text-xs">
              <h4>{getConstantIcons('comment')}</h4>
              <h4>{task.comments.length}</h4>
            </div>
          </div>
        </div>
      </div>
      {selected ? (
        <div className="flex w-full flex-col py-2">
          <CommentContainer comments={task.comments} />
          <NewComment source={task} />
        </div>
      ) : null}
    </div>
  )
}

export default TaskCard
