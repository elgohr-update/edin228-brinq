import { Button, Text, useTheme } from '@nextui-org/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../../context/state'

const BaseHeader = () => {
  const { type } = useTheme()

  return (
    <div
      className={`relative z-40 flex h-full w-full items-center justify-between py-2 xl:min-w-[400px]`}
    >
      <div className="z-10 flex items-center justify-between w-full xl:mt-0">
        <Link href={`/`}>
          <div className={`flex scale-[0.5] transition`}>
            <Image
              showSkeleton
              maxDelay={10000}
              width={110}
              height={50}
              src="/brinq-logo-full-color.png"
              alt="LOGO"
            />
          </div>
        </Link>
        <div className="flex items-center justify-end">
          <Link href={`/about`}>
            <a className="w-full h-full p-2 transition duration-100 ease-in-out rounded cursor-pointer hover:bg-gray-600/20">
              <h6>About</h6>
            </a>
          </Link>
          <Link href={`/contact`}>
            <a className="w-full h-full p-2 transition duration-100 ease-in-out rounded cursor-pointer hover:bg-gray-600/20">
              <h6>Contact</h6>
            </a>
          </Link>
          <Link href={`/register`}>
            <a className="w-full h-full p-2 transition duration-100 ease-in-out rounded cursor-pointer hover:bg-gray-600/20">
              <Button auto ghost color="gradient" size="xs">
                Sign Up
              </Button>
            </a>
          </Link>
          <Link href={`/login`}>
            <a className="w-full h-full p-2 transition duration-100 ease-in-out rounded cursor-pointer hover:bg-gray-600/20">
              <Button auto color="gradient" size="xs">
                <h6>Login</h6>
              </Button>
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BaseHeader
