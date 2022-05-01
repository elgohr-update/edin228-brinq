import { Loading } from '@nextui-org/react'
import React from 'react'

export default function DrawerLoader() {
  return (
    <div className="flex h-full w-full flex-1 items-center justify-center">
      <Loading type="points" size="xl" color="secondary" textColor="primary" />
    </div>
  )
}
