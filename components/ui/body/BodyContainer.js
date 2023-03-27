import React, { useEffect } from 'react'
import { Row } from '@nextui-org/react'
import { useAppContext } from '../../../context/state'
import { useRouter } from 'next/router'

export const BodyContainer = ({ children }) => {
  const { state, setState } = useAppContext()
  const router = useRouter()
  
  useEffect(() => {
    setState({ ...state, scrollY: 0 })
  }, [router.events])

  const handleScroll = (e) => {
    if (e.target.scrollTop === 0) {
      if (state.scrollY > 0) {
        setState({ ...state, scrollY: 0 })
      }
    } else if (state.scrollY < 1) {
      setState({ ...state, scrollY: e.target.scrollTop })
    }
  }

  return (
    <Row
      fluid
      className={`z-3 content-main max-h-[92vh] overflow-y-auto w-full pb-2 xl:max-h-[94vh]`}
      onScroll={(e) => handleScroll(e)}
    >
      {children}
    </Row>
  )
}
