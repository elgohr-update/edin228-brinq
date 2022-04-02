import React from 'react'
import Header from './Header';
import { Row } from '@nextui-org/react';

export const HeaderContainer = () => {
  return (
    <Row fluid className="hidden md:flex header-main w-full">
        <Header />
    </Row>
  )
}
