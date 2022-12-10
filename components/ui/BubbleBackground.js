import { Image, useTheme } from '@nextui-org/react'
import React from 'react'

function BubbleBackground() {
  const { type } = useTheme()
  return (
    <div>
      <div className={`main-bg fixed h-screen w-full main-bg-${type} z-1`} />
      {/* <div className="pink__gradient w-[30%] h-[20%] z-1 fixed top-0 right-0" />
      <div className="orange__gradient w-[30%] h-[20%] z-1 fixed top-0 left-0" />
      <div className="purple_blue__gradient w-[15%] h-[20%] z-1 fixed top-[24%] left-[18%]" />
      <div className="blue__gradient w-[30%] h-[20%] z-1 fixed top-0 left-0" /> */}
      <div
        className={`blur-screen fixed h-screen w-full blur-screen-${type} z-2`}
      />
      <div
        className={`fixed hidden lg:flex items-center top-[8px] right-[300px] opacity-70 z-3 grayscale`}
      >
        <Image
          showSkeleton
          maxDelay={10000}
          width={50}
          height={50}
          src="/brinq-logo-full-color.png"
          alt="Default Image"
        />
        <div className="flex items-center ml-2 text-xs tracking-widest uppercase mt-[4px]">ALPHA</div>
      </div>
    </div>
  )
}

export default BubbleBackground
