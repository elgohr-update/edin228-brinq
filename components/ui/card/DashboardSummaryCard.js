import { useTheme } from '@nextui-org/react'
import React from 'react'
import BackgroundFillSparkline from '../../charts/BackgroundFillSparkline'
import { motion } from 'framer-motion'

export default function DashboardSummaryCard({
  gradient,
  label,
  icon,
  chartData,
  content=0,
  colors = null,
  slice=true,
  toCurrentMonth=false,
  animtationDelay=0
}) {
  const { type } = useTheme()
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          opacity: 1,
          transition: {
            delay: animtationDelay * 0.05,
          },
        },
        hidden: { opacity: 0 },
      }}
      transition={{ ease: 'easeInOut', duration: 2 }}
      className={`${gradient} content-dark relative flex h-full w-[150px] flex-col overflow-hidden rounded-lg ${type}-shadow`}
    >
      <div className="relative z-20 flex h-full flex-col items-center justify-between pb-12 pt-4 lg:pt-8">
        <div className="flex flex-col z-40 items-center space-x-1 lg:space-x-2 text-sm justify-center text-center lg:text-lg font-semibold">
          <div>{icon}</div>
          <div className="uppercase">{label}</div>
        </div>
        <BackgroundFillSparkline toCurrentMonth={toCurrentMonth} slice={slice} passColors={colors} baseData={chartData} />
      </div>
      <div
        className={`relative card-overlay-bg flex items-center justify-center rounded-b-lg py-2 lg:text-2xl font-bold `}
      >
        <div className="z-20">{content}</div>
      </div>
    </motion.div>
  )
}
