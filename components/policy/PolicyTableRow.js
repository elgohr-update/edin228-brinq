import { Avatar, Progress, useTheme } from '@nextui-org/react'
import React from 'react'
import {
  formatMoney,
  getFormattedDate,
  getIcon,
  sortByProperty,
} from '../../utils/utils'
import TaskCompletion from '../task/TaskCompletion'
import TagBasic from '../ui/tag/TagBasic'
import UserAvatar from '../user/Avatar'
import { motion } from 'framer-motion'

function PolicyTableRow({ pol, currentUser, i = 1 }) {
  const tasks_completed = pol.tasks.filter((x) => x.active && x.done).length
  const tasks_total = pol.tasks.filter((x) => x.active).length
  const percentage = Math.round((tasks_completed / tasks_total) * 100)
  const { isDark, type } = useTheme()

  const ordered = sortByProperty(
    pol.users.filter((x) => x.id != currentUser?.id),
    'producer'
  )

  return (
    <motion.div
      custom={i}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          opacity: 1,
          transition: {
            delay: i * 0.05,
          },
          y: 0,
        },
        hidden: { opacity: 0, y: -10 },
      }}
      transition={{ ease: 'easeInOut', duration: 0.1 }}
      className="flex flex-col w-full pl-12"
    >
      <div className="flex items-center justify-between w-full text-xs">
        <div className="flex flex-col">
          <div className="relative flex w-[300px] flex-col">
            <div className="flex items-center gap-2">
              <div>
                <TagBasic
                  tooltip
                  tooltipContent={pol.policy_type_full}
                  text={pol.policy_type}
                  shadow
                />
              </div>
              {pol.renewed ? (
                <div className={`flex items-center h-[14px] rounded-[3px] tag-green-bg px-2 text-[0.5rem] font-bold uppercase tracking-widest text-white tag-text-shadow ${type}-shadow`}>
                  <div className="flex items-center">Renewed</div>
                </div>
              ) : (
                ''
              )}
              <div className="font-bold tracking-widest">
                {pol.policy_number}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
            <div className="flex items-center gap-2">
              <h4 className="flex items-center">{getIcon('hashtag')}</h4>
              <h4 className="flex items-center">{pol.policy_type_full}</h4>
            </div>
            {pol.description.length > 1 ? (
              <div className="flex items-center gap-2">
                <h4 className="flex items-center">{getIcon('description')}</h4>
                <h4 className="flex items-center">{pol.description}</h4>
              </div>
            ) : null}
          </div>
          <div className="z-[-1] w-full py-2">
            <Progress
              shadow={true}
              size="sm"
              color="success"
              value={percentage}
            />
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2">
          <div className="flex min-w-[125px] items-center justify-end space-x-2 pr-5">
            <div className={`font-bold text-teal-500 `}>{`$ ${formatMoney(
              pol.premium
            )}`}</div>
            {pol.renewed ? (
              <div>
                <div className="text-xs font-bold text-right text-emerald-500">
                  Renewed
                </div>
                <div
                  className={`text-right ${
                    pol.renewed ? 'line-through opacity-60' : 'opacity-80 '
                  }`}
                >
                  {getFormattedDate(pol.expiration_date)}
                </div>
              </div>
            ) : (
              <div
                className={`text-right ${
                  pol.renewed ? 'line-through opacity-60' : 'opacity-80 '
                }`}
              >
                {getFormattedDate(pol.expiration_date)}
              </div>
            )}
          </div>
          <div className="flex items-center justify-center px-4">
            <Avatar.Group
              count={pol.users.length > 3 ? pol.users.length : null}
            >
              {ordered.map((u) => (
                <UserAvatar
                  tooltip={true}
                  tooltipPlacement="topEnd"
                  isUser={true}
                  passUser={u}
                  key={u.id}
                  isGrouped={true}
                  squared={false}
                  size={`sm`}
                />
              ))}
            </Avatar.Group>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="relative ml-[-14px] flex items-center py-2">
          {pol?.tasks?.map((task) => (
            <TaskCompletion task={task} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default PolicyTableRow
