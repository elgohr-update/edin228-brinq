import { atom } from 'recoil'

export const clientNavState = atom({
  key: 'clientNavState',
  default: {
    dataNavbar: 1,
    actionNavbar: 1,
  },
})
