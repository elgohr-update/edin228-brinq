import { Button, useTheme } from '@nextui-org/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import HiddenBackdrop from '../../util/HiddenBackdrop'
import { useWritingCompanyDrawerContext } from '../../../context/state'
import {
  sumFromArrayOfObjects,
  timeout,
  useNextApi,
} from '../../../utils/utils'
import { useRouter } from 'next/router'
import DrawerLoader from '../loaders/DrawerLoader'
import { motion } from 'framer-motion'

const WritingCompanyDrawer = () => {
  const { writingCompanyDrawer, setWritingCompanyDrawer } =
    useWritingCompanyDrawerContext()
  const router = useRouter()
  const { type } = useTheme()
  const [company, setCompany] = useState(null)

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(100)
      if (!isCancelled) {
        fetchData()
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      closeDrawer()
    })
  }, [router.events])

  const fetchData = async () => {
    const companyId = writingCompanyDrawer.companyId
    setCompany(companyId)
    // const res = await useNextApi(
    //   'GET',
    //   `/api/clients/${companyId}?onlyInfo=true`
    // )
    // setCompany(res)
  }

  const closeDrawer = () => {
    const setDefault = {
      isOpen: false,
      companyId: null,
    }
    setWritingCompanyDrawer(setDefault)
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          opacity: 1,
          x: 0,
        },
        hidden: { opacity: 0, x: 200 },
      }}
      transition={{ ease: 'easeInOut', duration: 0.25 }}
      className={`fixed top-0 left-0 z-[999999] flex h-full w-full`}
    >
      <div
        className={`fixed right-0 flex h-full w-full flex-col overflow-hidden md:w-[1200px] ${type}-shadow panel-theme-${type}`}
      >
        {!company ? (
          <DrawerLoader />
        ) : (
          <div className="flex flex-auto shrink-0 overflow-hidden py-4">
              {company}
          </div>
        )}
        {!company ? null : (
          <div className="flex shrink-0 justify-end px-2 pt-1 pb-4">
            <Link href={`/company/${writingCompanyDrawer.companyId}`}>
              <a className="w-full">
                <Button color="gradient" className="w-full">
                  View More
                </Button>
              </a>
            </Link>
          </div>
        )}
      </div>
      {writingCompanyDrawer.isOpen ? (
        <HiddenBackdrop onClick={() => closeDrawer()} />
      ) : null}
    </motion.div>
  )
}

export default WritingCompanyDrawer
