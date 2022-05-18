import { useTheme } from '@nextui-org/react'
import React from 'react'
import { motion } from 'framer-motion'

function Panel({
  children,
  flat = false,
  noBg = false,
  shadow = true,
  px = 2,
  py = 2,
  overflow = true,
  horizontal = false,
  animationDelay=1
}) {
  const { type } = useTheme()
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          opacity: 1,
        },
        transition: {
          delay: animationDelay * 1,
        },
        hidden: { opacity: 0 },
      }}
      transition={{ ease: 'easeInOut', duration: 0.5 }}
      className={`flex shrink-0 ${
        horizontal ? 'flex-col md:flex-row' : 'flex-col'
      } ${
        overflow ? `overflow-y-auto` : null
      } rounded-lg px-${px} py-${py} w-full ${
        noBg ? null : `panel-${flat ? 'flat' : 'theme'}-${type}`
      } ${shadow ? `${type}-shadow` : null}`}
    >
      {children}
    </motion.div>
  )
}

export default Panel
