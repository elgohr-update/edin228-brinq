import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button, Image, useTheme } from '@nextui-org/react'
import PanelTitle from '../../ui/title/PanelTitle'
import { rcLoginUrl, rcsdk } from '../../../pages/api/rc/ringcentral'
import { getIcon } from '../../../utils/utils'
import { useRouter } from 'next/router'
import PhoneMenu from '../../phone/PhoneMenu'
import { usePhoneContext } from '../../../context/state'

function DashboardPhone() {
  const { type } = useTheme()
  const router = useRouter()
  const [isAuth, setIsAuth] = useState(false)
  const [loading, setLoading] = useState(false)
  const { phoneState, setPhoneState } = usePhoneContext()

  useEffect(() => {
    const handleChange = async () => {
      const authCheck = await rcsdk.platform().auth().accessTokenValid()
      setIsAuth(authCheck)
    }
    handleChange()
  }, [rcsdk])

  const goToLoginURL = async () => {
    const url = await rcLoginUrl()
    router.replace(`${url}`)
  }

  const LoginRingCentral = () => {
    return (
      <div className="mt-[-100px] flex h-full w-full flex-col items-center justify-center">
        <div className="flex items-center justify-center mb-8">
          <Image
            showSkeleton
            maxDelay={10000}
            width={150}
            height={150}
            src={`https://cdn.brinq.io/assets/RingCentral/Icon.png`}
            alt="Default Image"
          />
        </div>
        <Button
          color="primary"
          auto
          size="sm"
          flat
          onClick={() => goToLoginURL()}
        >
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center text-lg text-center">
              {getIcon('link')}
            </div>
            <div>Login to RingCentral</div>
          </div>
        </Button>
      </div>
    )
  }

  const RingCentralAppContainer = () => {
    return (
      <div className="flex flex-col w-full h-full shrink-0">
        <div className="flex w-full h-full p-4">
          {phoneState.tab === 1 ? (
            <div>1</div>
          ) : phoneState.tab === 2 ? (
            <div>2</div>
          ) : phoneState.tab === 3 ? (
            <div>3</div>
          ) : null}
        </div>
        <PhoneMenu />
      </div>
    )
  }

  return (
    <div
      className={`relative flex h-full flex-auto shrink-0 flex-col rounded-lg`}
    >
      <div className="pl-4">
        <PanelTitle title={`Phone`} color="green" />
      </div>
      <div
        className={`flex h-[72.3vh] flex-col rounded-lg panel-theme-${type} ${type}-shadow overflow-y-auto`}
      >
        {isAuth ? <RingCentralAppContainer /> : <LoginRingCentral />}
      </div>
    </div>
  )
}

export default DashboardPhone
