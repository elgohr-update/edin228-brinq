import Image from 'next/image'
import WebLayout from '../layouts/WebLayout'

export default function About() {
  return (
    <main className="flex h-full w-full">
      <div className="flex h-1/2 w-full flex-col items-center justify-center">
        <div className={`flex`}>
          <Image
            showSkeleton
            maxDelay={10000}
            width={180}
            height={80}
            src="/brinq-logo-full-color.png"
            alt="LOGO"
          />
        </div>
        <h1>BETA</h1>
        <h4>Coming Soon</h4>
      </div>
    </main>
  )
}

About.getLayout = function getLayout(page) {
  return <WebLayout>{page}</WebLayout>
}
