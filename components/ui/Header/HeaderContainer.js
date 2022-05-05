import React from 'react'
import Header from './Header';
import { Row } from '@nextui-org/react';

export const HeaderContainer = () => {
  return (
    <Row fluid className="flex h-[68px] w-full">
      <Header />
    </Row>
  )
}
