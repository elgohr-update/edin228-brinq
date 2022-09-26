import { Button, useTheme } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import HiddenBackdrop from '../../util/HiddenBackdrop'
import SidebarItemContainer from './SidebarItemContainer'
import { RiMenu4Line } from 'react-icons/ri'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'

const MobileSidebar = () => {
  const [open, setOpen] = useState(false)
  const { type } = useTheme()
  const router = useRouter()
  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      setOpen(false)
    })
  }, [router.events])

  return (
    <div className="relative z-50 flex h-full w-full flex-col">
      <div className="z-20">
        <Button
          flat
          color="primary"
          auto
          size="sm"
          onClick={() => setOpen(true)}
        >
          <RiMenu4Line />
        </Button>
      </div>
      {open ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              opacity: 1,
              x: 0,
            },
            hidden: { opacity: 0, x: -200 },
          }}
          transition={{ ease: 'easeInOut', duration: 0.15 }}
          className={`fixed left-0 top-0 z-50 flex h-full w-full flex-col justify-between panel-theme-sidebar-${type} ${type}-shadow sidebar-open`}
        >
          <SidebarItemContainer isMobile expand={true} />
        </motion.div>
      ) : null}
      {open ? <HiddenBackdrop onClick={() => setOpen(false)} /> : null}
    </div>
  )
}

export default MobileSidebar
