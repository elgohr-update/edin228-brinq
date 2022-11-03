import SDK from '@ringcentral/sdk'
import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next'

export const redirectUri = `${process.env.NEXT_PUBLIC_RC_REDIRECT_URL}/rc/redirect`

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

export const getRecentCalls = async () => {
  const getData = await rcsdk
    .get(`/restapi/v1.0/account/~/extension/~/call-log`, {
      query: { page: 1, perPage: 10 },
    })
    .then(function (response) {
      return response.json()
    })
    .catch(function (e) {
      console.log('Recent Calls Error: ' + e.message)
      return e.message
    })
  return getData
}

export const getRecording = async (recordingId) => {
  const url = `/restapi/v1.0/account/~/recording/${recordingId}/content`
  const getData = await rcsdk
    .get(url)
    .then(function (response) {
      return response.blob()
    })
    .catch(function (e) {
      console.log('Recent Calls Error: ' + e.message)
      return e.message
    })
  return getData
}

export const getVoicemail = async (url) => {
  const getData = await rcsdk
    .get(`${url}`)
    .then(function (response){
      return response.json()
    })
    .catch(function (e) {
      console.log('Recent Calls Error: ' + e.message)
      return e.message
    })
  return getData
}

export const getVoicemailDownload = async (contentUri) => {
  const url = `${contentUri}`
  const getData = await rcsdk
    .get(url)
    .then(function (response) {
      return response.blob()
    })
    .catch(function (e) {
      console.log('Recent Calls Error: ' + e.message)
      return e.message
    })
  return getData
}
