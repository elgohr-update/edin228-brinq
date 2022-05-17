import { useTheme } from '@nextui-org/react'
import React from 'react'
import BackgroundFillSparkline from '../../charts/BackgroundFillSparkline'
import { motion } from 'framer-motion'

export default function DashboardSummaryCard({
  gradient,
  shadow=false,
  shadowColor='green',
  label,
  icon,
  chartData,
  content=0,
  colors = null,
  slice=true,
  toCurrentMonth=false,
  animationDelay=0
}) {
  const { type } = useTheme()

  const getShadowColor = () => {
    switch (shadowColor) {
      case 'green':
        return 'green-shadow'
      case 'blue':
        return 'blue-shadow'
      case 'orange':
        return 'orange-shadow'
      case 'purple':
        return 'purple-shadow'
      case 'pink':
        return 'pink-shadow'
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          opacity: 1,
          x:0,
          transition: {
            delay: animationDelay * 0.25,
          },
        },
        hidden: { opacity: 0, x:-10},
      }}
      transition={{ ease: 'easeInOut', duration: 2 }}
      className={`${gradient} content-dark relative flex h-[100px] w-full flex-col overflow-hidden rounded-lg ${shadow? getShadowColor():``}`}
    >
      <div className="relative z-20 flex h-full flex-col">
        <div className="flex h-full flex-col lg:items-end lg:flex-row z-40 items-center space-x-1 lg:space-x-2 text-sm justify-center text-center lg:text-lg font-semibold">
          <div className="flex pb-1">{icon}</div>
          <div className="flex items-center text-center justify-center uppercase">{label}</div>
        </div>
        <BackgroundFillSparkline toCurrentMonth={toCurrentMonth} slice={slice} passColors={colors} baseData={chartData} />
      </div>
      <div
        className={`relative card-overlay-bg flex items-center justify-center rounded-b-lg py-1 lg:text-xl font-bold `}
      >
        <div className="z-20">{content}</div>
      </div>
    </motion.div>
  )
}
