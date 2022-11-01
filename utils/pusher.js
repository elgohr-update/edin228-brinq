import { PusherProvider } from '@harelpls/use-pusher'

const config = {
  clientKey: `${process.env.PUSHER_KEY}`,
  cluster: 'us3',
}
export function PusherWrapper({ children }) {
  return <PusherProvider {...config}>{children}</PusherProvider>
}
