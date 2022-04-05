import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useAppContext } from '../../context/state'

const HiddenBackdrop = ({onClick}) => {
  const router = useRouter()
  const { state, setState } = useAppContext()

  // useEffect( () => {
  //   const closeDrawer = () => {
  //       const setDefault = {isOpen:false,clientId:null}
  //       setState({...state,drawer:{...state.drawer, client:setDefault}})
  //   }
  //   closeDrawer()
  // }, [router])

  return (
    <div onClick={onClick} className="hidden-backdrop"></div>
  )
}

export default HiddenBackdrop