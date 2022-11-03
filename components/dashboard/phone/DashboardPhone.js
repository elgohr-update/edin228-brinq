import React, { useEffect, useRef, useState } from 'react'
import { Button, Image, useTheme } from '@nextui-org/react'
import PanelTitle from '../../ui/title/PanelTitle'
import { rcLoginUrl, rcsdk } from '../../../utils/ringcentral'
import { getIcon } from '../../../utils/utils'
import { useRouter } from 'next/router'
import PhoneMenu from '../../phone/PhoneMenu'
import { usePhoneContext } from '../../../context/state'
import PhoneLog from '../../phone/PhoneLog'
import PhoneVoicemail from '../../phone/PhoneVoicemail'
import PhoneFax from '../../phone/PhoneFax'

function DashboardPhone() {
  const { type } = useTheme()
  const router = useRouter()
  const [isAuth, setIsAuth] = useState(false)
  const [loading, setLoading] = useState(false)
  const { phoneState, setPhoneState } = usePhoneContext()
  const runOnce = useRef(true)

  useEffect(() => {
    const handleChange = async () => {
      const authCheck = await rcsdk.platform().auth().accessTokenValid()
      setIsAuth(authCheck)
      setPhoneState({ ...phoneState, auth: authCheck })
    }
    if (runOnce.current) {
      handleChange()
      runOnce.current = false
    }

    return () => {
      runOnce.current = false
    }
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
      <div className="relative flex flex-col w-full h-full shrink-0">
        <div className="flex w-full h-full">
          {phoneState.tab === 1 ? (
            <PhoneLog />
          ) : phoneState.tab === 2 ? (
            <PhoneVoicemail />
          ) : phoneState.tab === 3 ? (
            <PhoneFax />
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
      <div
        className={`flex h-[75.3vh] w-full flex-col rounded-lg panel-theme-${type} ${type}-shadow overflow-y-auto`}
      >
        {isAuth ? <RingCentralAppContainer /> : <LoginRingCentral />}
      </div>
    </div>
  )
}

export default DashboardPhone
