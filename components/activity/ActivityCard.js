import React from 'react'
import { Image, Textarea, Tooltip, useTheme } from '@nextui-org/react'
import { BsBox } from 'react-icons/bs'
import { getFormattedDateTime, truncateString } from '../../utils/utils'
import TagBasic from '../ui/tag/TagBasic'
import UserAvatar from '../user/Avatar'
import Link from 'next/link'
import FileTagContainer from '../files/FileTagContainer'

const ActivityCard = ({
  activity,
  border = false,
  panel = false,
  shadow = false,
  hideClient = false,
  hidePolicy = false,
  indexLast = null,
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
  const baseClass = `flex flex-none activity-card overflow-x-hidden overflow-y-hidden relative flex-col w-full py-1 px-2 rounded-lg ${isBorder()} ${isPanel()} ${isShadow()}`
  return (
    <div className={baseClass}>
      <div className={`flex`}>
        <div className="relative flex mr-4 z-90">
          {activity?.system_action && activity?.users.length < 1 ? (
            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-slate-900">
              <Image
                showSkeleton
                maxDelay={10000}
                width={20}
                height={20}
                src="/brinq-logo-q-color.png"
                alt="Default Image"
              />
            </div>
          ) : (
            <UserAvatar
              squared={false}
              tooltip={false}
              size="sm"
              isUser={true}
              passUser={activity?.users.find((x) => x.id === activity?.author_id)}
            />
          )}
          {!indexLast ? (
            <div
              className={`absolute border-l-[2px] border-t-0 border-b-0 border-r-0 ${
                isDark ? 'border-zinc-200' : 'border-zinc-500'
              } userBadge-timeline top-[35px] left-[48%] w-full border-[1px] opacity-10`}
            ></div>
          ) : null}
        </div>
        <div className={`relative flex flex-col`}>
          <div className={`flex w-full items-center justify-between`}>
            <div className="flex flex-wrap items-center space-x-2 text-xs xl:gap-2 xl:space-x-0">
              <h4 className="small-subtext">
                By{' '}
                {activity?.system_action && activity?.users.length < 1
                  ? 'Brinq'
                  : activity?.author}
              </h4>
              <div className="data-point-xs purple-to-green-gradient-1"></div>
              <h4 className="flex items-center small-subtext">
                {getFormattedDateTime(activity?.date)}
              </h4>
              <div className="data-point-xs pink-to-blue-gradient-1"></div>
              <h4 className="small-subtext ">{activity?.activity_type}</h4>
              {activity?.pushed_to_ams360 ? (
                <div className="flex items-center space-x-2 xl:gap-2 xl:space-x-0">
                  <div className="data-point-xs orange-gradient-1"></div>
                  <h4 className="small-subtext ">
                    AMS360
                  </h4>{' '}
                </div>
              ) : null}
            </div>
          </div>
          <div className="block py-1">
            {activity?.system_action ? (
              <h6>{`${activity?.author} ` + activity?.description}</h6>
            ) : (
              <h6 className="block whitespace-pre-line">
                {activity?.description}
              </h6>
            )}
          </div>
          <div className={`flex w-full flex-col`}>
            {hideClient ? null : (
              <div className="flex page-link">
                <Link href={`/clients/${activity?.client_id}`}>
                  <a>
                    <h6 className="opacity-60">
                      {truncateString(activity?.client_name, 50)}
                    </h6>
                  </a>
                </Link>
              </div>
            )}
            {hidePolicy ||
            activity?.system_action ||
            activity?.policies.length == 0 ? null : activity?.policies.length ==
              1 ? (
              <div className="flex items-center flex-auto space-x-2">
                <TagBasic
                  tooltip
                  tooltipContent={activity?.policies[0].policy_type_full}
                  text={activity?.policies[0].policy_type}
                />
                <Link href="/">
                  <a className="transition duration-100 hover:text-sky-500">
                    <h4 className="flex items-center space-x-2">
                      <BsBox />
                      <div>{activity?.policies[0].policy_number}</div>
                    </h4>
                  </a>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {activity?.policies.map((pol) => (
                  <div key={pol.id} className="flex items-center space-x-2">
                    <TagBasic
                      tooltip
                      tooltipContent={pol.policy_number}
                      text={`${pol.policy_type}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          {activity?.attachments.length > 0 ? (
            <div className="py-2">
              <FileTagContainer files={activity?.attachments} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default ActivityCard
