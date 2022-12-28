import Image from 'next/image'
import WebLayout from '../layouts/WebLayout'

export default function Register() {
  return (
    <main className="flex w-full h-full">
      <div>
          REGISTER
      </div>
    </main>
  )
}

Register.getLayout = function getLayout(page) {
  return <WebLayout>{page}</WebLayout>
}
