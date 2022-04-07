import React from 'react'
import { Row } from '@nextui-org/react';

export const BodyContainer = ({children}) => {
  return (
    <Row fluid className={`z-3 w-full content-main overflow-y-auto pb-4 md:max-h-[94vh]`}>
        {children}
    </Row>
  )
}
