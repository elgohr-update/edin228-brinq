import { useTheme } from '@nextui-org/react'
import React from 'react'
import { getFormattedDateTime } from '../../utils/utils'
import UserAvatar from '../user/Avatar'
import FileTag from './FileTag'

function FileCard({
  data,
  border = false,
  panel = false,
  shadow = false,
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
  const baseClass = `flex flex-none activity-card overflow-x-hidden overflow-y-hidden relative flex-col w-full py-1 px-2 rounded-lg ${isBorder()} ${isPanel()} ${isShadow()}`
  return (
    <div className={baseClass}>
      <div className="flex w-full">
        <div className="relative flex mr-4 z-90">
          <UserAvatar
            squared={false}
            tooltip={false}
            size="sm"
            isUser={false}
            lookUpUser={data.author_id}
          />
          {!indexLast ? (
            <div
              className={`absolute border-l-[2px] border-t-0 border-b-0 border-r-0 ${
                isDark ? 'border-zinc-200' : 'border-zinc-500'
              } userBadge-timeline top-[35px] left-[48%] w-full border-[1px] opacity-10`}
            ></div>
          ) : null}
        </div>
        <div className={`relative flex flex-col w-full`}>
          <div className={`flex w-full items-center justify-between`}>
            <div className="flex flex-wrap items-center space-x-2 text-xs lg:gap-2 lg:space-x-0">
              <h4 className="small-subtext">By {data.author}</h4>
              <div className="data-point-xs purple-to-green-gradient-1"></div>
              <h4 className="flex items-center small-subtext">
                {getFormattedDateTime(data.created)}
              </h4>
            </div>
          </div>
          <div className="flex flex-col w-full p-2">
            <div className="block py-1">
              <h6 className="block whitespace-pre-line">{data.title}</h6>
            </div>
            <div className="block py-1">
              <h6 className="block whitespace-pre-line opacity-50">
                {data.description}
              </h6>
            </div>
          </div>
          <div className="">
            <FileTag file={data} key={data.id} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileCard
