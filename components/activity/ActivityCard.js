import React from 'react'
import { useTheme } from '@nextui-org/react'
import { BsBox } from 'react-icons/bs'
import { getFormattedDateTime } from '../../utils/utils'
import TagBasic from '../ui/tag/TagBasic'
import UserAvatar from '../user/Avatar'
import Link from 'next/link'

const ActivityCard = ({
  activity,
  border = false,
  panel = false,
  shadow = false,
  hideClient = false,
  hidePolicy = false,
}) => {
  const { isDark, type } = useTheme()

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
  const baseClass = `activity-card relative flex-col w-full p-2 rounded-lg ${isBorder()} ${isPanel()} ${isShadow()}`
  return (
    <div className={baseClass}>
      <div className={`flex w-full`}>
        <div className="z-90 mr-4 flex">
          <UserAvatar
            squared={false}
            tooltip={false}
            size="sm"
            isUser={true}
            passUser={activity.users.find((x) => x.id === activity.author_id)}
          />
        </div>
        <div className={`relative flex w-full flex-col`}>
          <div className={`flex w-full items-center justify-between`}>
            <div className="flex items-center text-xs space-x-2">
              <h4>By {activity.author}</h4>
              <div className="flex items-center small-subtext">
                {getFormattedDateTime(activity.date)}
              </div>
            </div>
            <h4 className="text-xs">{activity.activity_type}</h4>
          </div>
          <div className="flex py-1">
            {activity.system_action ? (
              <h6>{`${activity.author} ` + activity.description}</h6>
            ) : (
              <h6>{activity.description}</h6>
            )}
          </div>
          <div className={`flex flex-col md:flex-row w-full md:items-center md:space-x-2`}>
            {hideClient ? null : (
              <div className="flex">
                <Link href="/">
                  <a>
                    <h6 className="text-sky-500">{activity.client_name}</h6>
                  </a>
                </Link>
              </div>
            )}
            {hidePolicy || activity.system_action ? null : (
              <div className="flex flex-1 items-center space-x-2">
                <TagBasic text={activity.policy_type} />
                <Link href="/">
                  <a className="transition duration-100 hover:text-sky-500">
                    <h4 className="flex items-center space-x-2">
                      <BsBox />
                      <div>{activity.policy_number}</div>
                    </h4>
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivityCard
