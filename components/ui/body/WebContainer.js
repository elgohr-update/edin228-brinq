import { Col, Container, Row, useTheme } from '@nextui-org/react'
import React from 'react'
import BaseHeader from '../Header/BaseHeader'

export default function WebContainer({children}) {
  const { type } = useTheme()

  return (
    <div className={`flex flex-col overflow-hidden mx-auto`}>
      <div className={`main-bg fixed h-screen w-full main-bg-${type} z-1`} />
      <div
        className={`blur-screen fixed h-screen w-full blur-screen-${type} z-2`}
      />
      <div className={`flex flex-col w-full lg:w-1/2 z-3 mx-auto overflow-hidden`}>
        <Col className="h-screen">
          <Row className="header-main w-full">
            <BaseHeader />
          </Row>
          <Row className={`z-3 content-main w-full overflow-hidden`}>
            {children}
          </Row>
        </Col>
      </div>
    </div>
  )
}
