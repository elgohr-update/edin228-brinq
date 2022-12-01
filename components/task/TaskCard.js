import React, { useState } from 'react'
import { useTheme } from '@nextui-org/react'
import { getIcon, getFormattedDate } from '../../utils/utils'
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

  const baseClass = `${isSelected()} cursor-pointer text-xs flex flex-col flex-auto relative transition-all duration-100 ease-out py-1 pr-2 rounded-lg ${isBorder()} ${isPanel()} ${isShadow()}`
  return (
    <div className={baseClass}>
      <div className={`flex flex-auto items-center`}>
        <TaskCompletion task={task} />
        <div className="flex flex-auto" onClick={() => setSelected(!selected)}>
          <div className="flex flex-col flex-auto shrink-0">
            <div className="flex flex-col flex-auto space-y-1 md:flex-row md:items-center md:space-y-0">
              <div className={`relative flex flex-auto flex-col space-y-1`}>
                {showPolicy ? (
                  <div className="flex items-center space-x-1 text-xs">
                    <TagBasic tooltip tooltipContent={task?.policy_type_full} text={task?.policy_type} />
                    <h4>{task?.policy_number}</h4>
                  </div>
                ) : null}
                <div className="flex text-xs max-w-fit">{task?.title}</div>
              </div>
            </div>
            <div className="flex flex-col justify-center py-2">
              <div className="flex items-center space-x-2">
                {task.done ? (
                  <div
                    className={`${task.completed ? 'text-color-success' : 'text-color-warning'} relative flex w-[90px] flex-row items-center space-x-1`}
                  >
                    <h6>{getIcon('circleCheck')}</h6>
                    <h6 className={`letter-spacing-1 flex flex-auto`}>
                      {getFormattedDate(task?.completed_date)}
                    </h6>
                  </div>
                ) : null}
                <div
                  className={`relative flex w-[90px] flex-row items-center space-x-1`}
                >
                  <h4>{getIcon('clock')}</h4>
                  <h4
                    className={`letter-spacing-1 flex flex-auto ${
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
          </div>
          <div className="flex items-center justify-end">
            <div className="flex justify-end space-x-1 lg:gap-2 lg:space-x-0">
              <div className="flex items-center">
                <div className="flex items-center space-x-1 text-xs">
                  <h4>{task.comments.length}</h4>
                  <h4 className="flex items-center">
                    {getIcon('comment')}
                  </h4>
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
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full pb-2 pl-4">
        <CommentContainer isSelected={selected} comments={task.comments} />
        {selected ? <NewComment source={task} /> : null}
      </div>
    </div>
  )
}

export default TaskCard
