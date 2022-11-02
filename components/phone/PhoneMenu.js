import { Button, useTheme } from '@nextui-org/react'
import React from 'react'
import { usePhoneContext } from '../../context/state'
import { getIcon } from '../../utils/utils'

function PhoneMenu() {
  const { type } = useTheme()
  const { phoneState, setPhoneState } = usePhoneContext()

    const changeTab = (tab) => {
        setPhoneState({
            ...phoneState, tab:tab
        })
    }

  return (
    <div
      className={`flex w-full panel-flatter-${type} items-center justify-center`}
    >
      <Button.Group color="warning" auto size="md" light rounded={false}>
        <Button onClick={() => changeTab(1)}>
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center text-center">
              {getIcon('phone')}
            </div>
          </div>
        </Button>
        <Button onClick={() => changeTab(2)}>
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center text-center">
              {getIcon('voicemail')}
            </div>
          </div>
        </Button>
        <Button onClick={() => changeTab(3)}>
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center text-center">
              {getIcon('fax')}
            </div>
          </div>
        </Button>
      </Button.Group>
    </div>
  )
}

export default PhoneMenu
