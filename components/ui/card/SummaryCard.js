import React from 'react'
import { useTheme } from '@nextui-org/react'
import { abbreviateMoney } from '../../../utils/utils'
import { AiFillCaretLeft } from 'react-icons/ai'

const SummaryCard = ({
  icon = <AiFillCaretLeft />,
  noPadding = false,
  autoWidth = false,
  isIcon = true,
  val = 0,
  title = '',
  border = false,
  percent = false,
  money = false,
  vertical = true,
  color = 'sky',
  gradientColor = 'orange',
  panel = false,
  shadow = false,
}) => {
  const { isDark, type } = useTheme()

  const textValue = () => {
    return money
      ? `$${abbreviateMoney(parseFloat(val))}`
      : percent
      ? `${Number(val) ? val : 0}%`
      : val
  }
  const isVertical = () => {
    return vertical ? `flex-col space-y-2` : `flex-row items-center`
  }
  const isPanel = () => {
    return panel ? `panel-theme-${type}` : ``
  }
  const isShadow = () => {
    return shadow ? `${type}-shadow` : ``
  }
  const isBorder = () => {
    return border
      ? `${isDark ? `border-slate-900` : `border-slate-200`} border`
      : ``
  }
  const returnGradient = () => {
    switch (gradientColor) {
      case 'orange':
        return 'orange-gradient-1'
      case 'orange-reverse':
        return 'orange-reverse-gradient-1'
      case 'pink':
        return 'pink-gradient-1'
      case 'green':
        return 'green-gradient-1'
      case 'blue':
        return 'blue-gradient-1'
      case 'peach':
        return 'peach-gradient-1'
      case 'blood-orange':
        return 'blood-orange-gradient-1'
      case 'grand-blue':
        return 'grand-blue-gradient-1'
      case 'celestial':
        return 'celestial-gradient-1'
      case 'purple-to-green':
        return 'purple-to-green-gradient-1'
      case 'pink-to-orange':
        return 'pink-to-orange-gradient-1'
      case 'pink-to-blue':
        return 'pink-to-blue-gradient-1'
      case 'green-to-orange':
        return 'green-to-orange-gradient-1'
      case 'grand-blue-to-orange':
        return 'grand-blue-to-orange-gradient-1'
      case 'green-to-blue-2':
        return 'green-to-blue-gradient-2'
      case 'blue-to-orange-2':
        return 'blue-to-orange-gradient-2'
      case 'orange-to-red-2':
        return 'orange-to-red-gradient-2'
      case 'orange-to-green-gradient-2':
        return 'orange-to-green-gradient-2'
      case 'blue-to-orange-gradient-3':
        return 'blue-to-orange-gradient-3'
      case 'purple-to-blue-gradient-2':
        return 'purple-to-blue-gradient-2'
    }
  }
  const baseClass = `relative flex ${noPadding ? `p-0` : `px-4 py-2`} ${
    autoWidth ? `w-auto` : `flex-auto  min-w-[330px]`
  } rounded-lg ${isBorder()} ${isVertical()} ${isPanel()} ${isShadow()}`
  const barClass = `${val}%`
  return (
    <div className={baseClass}>
      <div
        className={`relative z-20 flex w-full ${
          vertical ? 'flex-col' : `flex-col`
        }`}
      >
        <div
          className={`${vertical ? 'flex ' : `flex `} flex text-2xl font-bold`}
        >
          {textValue()}
        </div>
        <h5 className={`${vertical ? 'flex' : `flex `} font-semibold`}>
          {title}
        </h5>
        {percent ? (
          <div className="rounded-lg top-border-flair">
            <div className="relative h-[3px] w-full rounded-lg bg-zinc-600">
              <div
                className={`absolute h-full ${returnGradient()}`}
                style={{ width: barClass }}
              ></div>
            </div>
          </div>
        ) : (
          <div className={`top-border-flair ${returnGradient()}`} />
        )}
      </div>
      {isIcon ? (
        <div
          className={`${
            vertical ? 'flex justify-end' : `flex justify-end`
          } relative z-20`}
        >
          <div
            className={`z-20 flex items-center ${type}-shadow justify-center rounded-lg text-white ${
              isDark ? 'bg-slate-500/20' : 'bg-white/40'
            } h-[40px] w-[40px] p-2 text-2xl`}
          >
            <div>{icon}</div>
          </div>
          <div
            className={`absolute z-10 rounded-lg ${returnGradient()} h-[40px] w-[40px]`}
          ></div>
        </div>
      ) : null}
    </div>
  )
}

export default SummaryCard
