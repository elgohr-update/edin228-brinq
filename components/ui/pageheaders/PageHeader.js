import React from 'react'

const PageHeader = ({ children, isBetween = true }) => {
  return (
    <div
      className={`flex w-full items-center py-2 ${
        isBetween ? 'justify-between' : ''
      } z-50  px-4 `}
    >
      {children}
    </div>
  )
}

export default PageHeader
