import React from 'react'
import Header from './Header';
import { Row } from '@nextui-org/react';
import { useAppHeaderContext } from '../../../context/state';

export const HeaderContainer = () => {
  const {appHeader, setAppHeader} = useAppHeaderContext();
  return (
    <Row fluid className={`flex lg:h-[68px] w-full ${appHeader.lowZIndex ? 'z-0' : ''}`}>
      <Header />
    </Row>
  )
}
