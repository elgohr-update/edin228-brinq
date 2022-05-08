import React from 'react'

const PageTitle = ({icon={},text="Header"}) => {
  return (
    <div className="flex items-center mr-8">
        <div className="flex items-center justify-center text-color-warning text-xs md:text-lg">{icon}</div>
        <h1 className="flex items-center text-xs md:text-lg">
            <span className="mx-2 text-color-primary font-bold">/</span>
            <span className="text-md tracking-widest font-bold">{text}</span>
        </h1>
    </div>
  )
}

export default PageTitle