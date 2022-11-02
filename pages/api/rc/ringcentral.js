import SDK from '@ringcentral/sdk'
import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next'

export const redirectUri = `${process.env.NEXT_PUBLIC_RC_REDIRECT_URL}/rc/redirect` // make sure you have this configured in Dev Portal

export const rcsdk = new SDK({
  appName: 'Brinq',
  appVersion: '1.0.0',
  server: `${process.env.NEXT_PUBLIC_RC_SERVER_URL}`,
  clientId: `${process.env.NEXT_PUBLIC_RC_CLIENT_ID}`,
  clientSecret: `${process.env.NEXT_PUBLIC_RC_CLIENT_SECRET}`,
  redirectUri,
})

export const rcLoginUrl = async () => {
  const loginUrl = rcsdk.platform().loginUrl({
    state: `1`,
    usePKCE: true,
  })
  const codeVerifier = rcsdk.platform().codeVerifier
  deleteCookie('codeVerifier')
  setCookie('codeVerifier', codeVerifier)
  return loginUrl
}
