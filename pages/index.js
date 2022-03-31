import AppLayout from '../layouts/AppLayout'
import WebLayout from '../layouts/WebLayout'
import { useTheme as useNextTheme } from 'next-themes'
import { Row, Switch, useTheme } from '@nextui-org/react'


export default function Home() {

  return (
    <main className="w-full">      
      <Row fluid align="center">
        
      </Row>
    </main>
  )
}

Home.getLayout = function getLayout(page) {
  return (
    <WebLayout>
      {page}
    </WebLayout>
  )
}