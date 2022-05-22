import { useTheme } from '@nextui-org/react'
import Image from 'next/image'
import WebLayout from '../layouts/WebLayout'

export default function Home() {
  const { isDark, type } = useTheme()
  return (
    <main className="flex h-full w-full">
      <div className="z-30 flex h-1/2 w-full flex-col items-center justify-center">
        <div className="flex flex-col items-center z-30">
          <div className={`flex`}>
            <Image
              width={180}
              height={80}
              src="/brinq-logo-full-color.png"
              alt="LOGO"
            />
          </div>
          <h1 className="">BETA</h1>
          <h4 className="">Coming Soon</h4>
        </div>
        {/* <div
          className={`fixed z-20 h-full w-[700px] overflow-hidden left-[-200px] lg:left-0 lg:top-0 lg:flex`}
        >
          <div className="relative flex h-full w-full">
            <div
              className={`absolute z-20 h-full bg-overlay-home w-full backdrop-blur-xl lg:left-0 lg:top-0 lg:flex`}
            ></div>
          </div>
          <div className="absolute top-0 left-0 z-10 scale-x-[-1]">
            <Image
              showSkeleton
              maxDelay={10000}
              width={711}
              height={1146}
              quality={100}
              src="/bg-flow.png"
              alt="LOGO"
            />
          </div>
        </div> */}
      </div>
    </main>
  )
}

Home.getLayout = function getLayout(page) {
  return <WebLayout>{page}</WebLayout>
}
