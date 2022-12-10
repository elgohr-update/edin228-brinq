import React from 'react'
import Header from './Header';
import { Row } from '@nextui-org/react';

export const HeaderContainer = () => {
  return (
    <Row fluid className="flex lg:h-[68px] w-full z-[1]">
      <Header />
    </Row>
  )
}
