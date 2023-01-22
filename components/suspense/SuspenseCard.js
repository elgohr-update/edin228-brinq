import React from 'react'
import { useTheme } from '@nextui-org/react'
import { BsBox } from 'react-icons/bs'
import UserAvatar from '../user/Avatar'
import {
  getFormattedDate,
  getFormattedDateTime,
  truncateString,
} from '../../utils/utils'
import Link from 'next/link'
import TagBasic from '../ui/tag/TagBasic'

function SuspenseCard({
  data = null,
  border = false,
  panel = false,
  shadow = false,
  hideClient = false,
  hidePolicy = false,
  indexLast = null,
}) {
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
  const isLate = (due) => {
    const today = new Date()
    const date = new Date(due)
    return today > date ? `text-color-error` : ``
  }
  const baseClass = `flex activity-card overflow-x-hidden overflow-y-hidden relative flex-col w-full py-1 px-2 rounded-lg ${isBorder()} ${isPanel()} ${isShadow()}`
  return (
    <div className={baseClass}>
      <div className="flex items-center justify-between w-full">
        <div className={`flex w-full flex-col`}>
          {hideClient ? null : (
            <div className="flex items-center space-x-2 page-link">
              <div className="data-point-xs purple-to-green-gradient-1"></div>
              <Link href={`/clients/${data?.client_id}`}>
                <a>
                  <h6>{truncateString(data?.client_name, 50)}</h6>
                </a>
              </Link>
            </div>
          )}
          {hidePolicy ||
          data?.system_action ||
          data?.policies.length == 0 ? null : data?.policies.length == 1 ? (
            <div className="flex items-center flex-auto px-4 space-x-2">
              <TagBasic
                tooltip
                tooltipContent={data?.policies[0].policy_type_full}
                text={data?.policies[0].policy_type}
              />
              <Link href="/">
                <a className="transition duration-100 hover:text-sky-500">
                  <h4 className="flex items-center space-x-2">
                    <BsBox />
                    <div>{data?.policies[0].policy_number}</div>
                  </h4>
                </a>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              {data?.policies.map((pol) => (
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
        <div className="flex items-center justify-end w-full space-x-2">
          <h4 className="text-right">{data.activity_type}</h4>
          <div className="data-point-xs pink-to-blue-gradient-1"></div>
          <div className="flex items-center space-x-2">
            <h4>Due</h4>
            <h6 className={`small-subtext font-bold ${isLate(data?.date)} flex items-center`}>
              {getFormattedDate(data?.date)}
            </h6>
          </div>
        </div>
      </div>
      <div className="block px-4 py-1">
        <h6 className="block whitespace-pre-line">{data?.description}</h6>
      </div>
      <div className="flex items-center justify-between w-full px-4">
        <div className="flex items-center space-x-2">
          <h4>Created By:</h4>
          <div>
            <UserAvatar
              squared={false}
              tooltip={false}
              size="sm"
              isUser={true}
              passUser={data?.users.find((x) => x.id === data?.author_id)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuspenseCard
