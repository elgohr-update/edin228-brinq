import { Avatar, Progress } from '@nextui-org/react'
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
      className="flex flex-col w-full pl-2"
    >
      <div className="flex items-center justify-between w-full text-xs">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div>
              <TagBasic
                tooltip
                tooltipContent={pol.policy_type_full}
                text={pol.policy_type}
              />
            </div>
            <div>
              <div className="tracking-widest">{pol.policy_number}</div>
            </div>
          </div>
          <div className="flex flex-col py-1">
            <div className="flex items-center gap-2">
              <h4>{getIcon('hashtag')}</h4>
              <h4>{pol.policy_type_full}</h4>
            </div>
            {pol.description.length > 1 ? (
              <div className="flex items-center gap-2">
                <h4>{getIcon('description')}</h4>
                <h4>{pol.description}</h4>
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2">
          <div className="flex">
            <div className="flex w-[200px] flex-col px-4">
              <div className="flex justify-between w-full">
                <div className="text-xs opacity-50">Tasks</div>
                <div className="flex justify-end w-full text-xs tracking-widest">
                  {Number(percentage) ? percentage : 0}%
                </div>
              </div>
              <Progress
                shadow={true}
                size="sm"
                color="gradient"
                value={percentage}
              />
            </div>
          </div>
          <div className="flex min-w-[125px] items-center justify-end space-x-2 pr-5">
            <div className={`font-bold text-teal-500 `}>{`$ ${formatMoney(
              pol.premium
            )}`}</div>
            {pol.renewed ? (
              <div>
                <div
                  className={`text-right ${
                    pol.renewed ? 'line-through opacity-50' : 'opacity-80 '
                  }`}
                >
                  {getFormattedDate(pol.expiration_date)}
                </div>
                <div className="text-xs font-bold text-right text-emerald-500">
                  Renewed
                </div>
              </div>
            ) : (
              <div
                className={`text-right ${
                  pol.renewed ? 'line-through opacity-50' : 'opacity-80 '
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
      <div className="ml-[-12px] flex w-full items-center py-2">
        {pol?.tasks?.map((task) => (
          <TaskCompletion task={task} />
        ))}
      </div>
    </motion.div>
  )
}

export default PolicyTableRow
