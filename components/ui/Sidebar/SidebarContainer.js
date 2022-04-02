import React from 'react'
import Sidebar from './Sidebar';
import { Row } from '@nextui-org/react';

export const SidebarContainer = () => {
  return (
    <div className="hidden md:flex sidebar-main">
        <Sidebar /> 
    </div>
  )
}
