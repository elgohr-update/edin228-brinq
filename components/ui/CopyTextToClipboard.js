import React, { useState } from 'react'
import { useNotificationContext } from '../../context/state'
import { AiOutlineCopy } from 'react-icons/ai';

export default function CopyTextToClipboard({ val, children }) {
  const { notification, setNotification } = useNotificationContext()
  const copyText = () => {
    navigator.clipboard.writeText(val)
    setNotification({
      icon: <AiOutlineCopy />,
      text: 'Copied Text!',
      position: 'bottom-right',
      color: 'white',
      background: 'blue',
    })
    console.log(notification)
  }
  return (
    <div className="relative" onClick={() => copyText()}>
      {children}
    </div>
  )
}
