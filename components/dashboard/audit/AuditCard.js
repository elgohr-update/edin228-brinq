import { Input, Modal, useTheme } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { getIcon, getSearch, timeout } from '../../../utils/utils'
import { motion } from 'framer-motion'
import DashboardPolicyCard from '../policy/DashboardPolicyCard'
import ContactCard from '../../contact/ContactCard'

function AuditCard({
  init = null,
  title = null,
  color = null,
  usePolicyCard = false,
  useContactCard = false,
  useClientCard = false,
}) {
  const { type, isDark } = useTheme()
  const [openModal, setOpenModal] = useState(false)
  const [data, setData] = useState(null)
  const [raw, setRaw] = useState(null)

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(100)
      if (!isCancelled) {
        setData(init)
        setRaw(init)
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [init])

  const getColor = () => {
    const def = { bg: ``, text: ``, shadow: '' }
    switch (color) {
      case 'emerald':
        return {
          bg: `bg-emerald-500`,
          text: `text-emerald-400`,
          shadow: 'blue-shadow',
        }
      case 'sky':
        return { bg: `bg-sky-500`, text: `text-sky-400`, shadow: 'blue-shadow' }
      case 'purple':
        return {
          bg: `bg-purple-500`,
          text: `text-purple-400`,
          shadow: 'pink-shadow',
        }
      case 'pink':
        return {
          bg: `bg-pink-500`,
          text: `text-pink-400`,
          shadow: 'pink-shadow',
        }
      case 'teal':
        return {
          bg: `bg-teal-500`,
          text: `text-teal-400`,
          shadow: 'blue-shadow',
        }
      case 'amber':
        return {
          bg: `bg-amber-500`,
          text: `text-amber-400`,
          shadow: 'orange-shadow',
        }
      case 'fuchsia':
        return {
          bg: `bg-fuchsia-500`,
          text: `text-fuchsia-400`,
          shadow: 'pink-shadow',
        }
      case 'rose':
        return {
          bg: `bg-rose-500`,
          text: `text-rose-400`,
          shadow: 'pink-shadow',
        }
      case 'violet':
        return {
          bg: `bg-violet-500`,
          text: `text-violet-400`,
          shadow: 'purple-shadow',
        }
      case 'indigo':
        return {
          bg: `bg-indigo-500`,
          text: `text-indigo-400`,
          shadow: 'purple-shadow',
        }
      case 'cyan':
        return {
          bg: `bg-cyan-500`,
          text: `text-cyan-400`,
          shadow: 'blue-shadow',
        }
      case 'red':
        return { bg: `bg-red-500`, text: `text-red-400`, shadow: 'pink-shadow' }
      case 'rose':
        return {
          bg: `bg-rose-500`,
          text: `text-rose-500`,
          shadow: 'pink-shadow',
        }
      case 'yellow':
        return {
          bg: `bg-yellow-500`,
          text: `text-yellow-400`,
          shadow: 'orange-shadow',
        }
      case 'orange':
        return {
          bg: `bg-orange-500`,
          text: `text-orange-400`,
          shadow: 'orange-shadow',
        }
      case 'lime':
        return {
          bg: `bg-lime-500`,
          text: `text-lime-400`,
          shadow: 'green-shadow',
        }
      default:
        return def
    }
  }

  const search = (val) => {
    if (val.length > 1) {
      const filtered = getSearch(raw, val)
      setData(filtered)
    } else {
      setData(raw)
    }
  }

  return (
    <>
      <div
        className={`flex h-full w-full flex-auto cursor-pointer flex-col items-center justify-between rounded-lg py-6 transition duration-200 ease-out  ${
          isDark ? 'hover:bg-zinc-600/20' : 'hover:bg-zinc-400/20'
        }`}
        onClick={() => setOpenModal(true)}
      >
        <div className={`text-3xl font-bold ${getColor().text}`}>
          {data ? data?.length : 0}
        </div>
        <div
          className="px-2 tracking-widest text-center uppercase opacity-70"
          style={{ fontSize: '0.65rem' }}
        >
          {title}
        </div>
      </div>
      <Modal
        closeButton
        noPadding
        scroll
        width={'800px'}
        className={'flex w-full items-center justify-center'}
        aria-labelledby="modal-title"
        open={openModal}
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header className="flex flex-col w-full px-4">
          <div className="text-xs tracking-widest opacity-60">{title}</div>
        </Modal.Header>
        <Modal.Body className="flex flex-col w-full px-4">
          <div className="relative w-full">
            <Input
              className={`z-10`}
              type="search"
              aria-label="Activity Search Bar"
              size="sm"
              fullWidth
              underlined
              placeholder="Search"
              labelLeft={getIcon('search')}
              onChange={(e) => search(e.target.value)}
            />
            <div className="z-30 flex w-full search-border-flair pink-to-blue-gradient-1" />
          </div>
          <div className="flex flex-col w-full h-full overflow-x-hidden">
            {data?.map((u, i) => (
              <motion.div
                key={u.id}
                className="relative"
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
                transition={{ ease: 'easeInOut', duration: 0.25 }}
              >
                {usePolicyCard ? <DashboardPolicyCard policy={u} /> : null}
                {useContactCard ? <ContactCard contact={u} /> : null}
                {/* {useClientCard ? <DashboardPolicyCard policy={u} /> : null} */}
              </motion.div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer autoMargin={false} className="w-full p-4"></Modal.Footer>
      </Modal>
    </>
  )
}

export default AuditCard
