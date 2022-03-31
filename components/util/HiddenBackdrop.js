import React from 'react'

const HiddenBackdrop = ({onClick}) => {
  return (
    <div onClick={onClick} className="hidden-backdrop"></div>
  )
}

export default HiddenBackdrop