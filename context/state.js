import { createContext, useContext, useState } from 'react'

const AppContext = createContext()

export function AppWrapper({ children }) {
  const [state, setState] = useState({
    search: '',
    scrollY: 0,
    lowZIndex: false,
    reports: {
      default: 'clients',
      data: {
        clients: {
          raw: [],
          filtered: [],
          loading: true,
        },
        policies: {
          raw: [],
          filtered: [],
          loading: true,
        },
        carriers: {
          raw: [],
          filtered: [],
          loading: true,
        },
        nb: {
          raw: [],
          filtered: [],
          loading: true,
        },
      },
      filters: {
        clients: {
          minPrem: null,
          maxPrem: null,
          minPolicies: null,
          maxPolicies: null,
          lineList: ['Commercial Lines', 'Personal Lines', 'Benefits'],
        },
      },
    },
    costComparison: {
      builder: {
        template: {
          id: null,
          title: null,
          headers: [],
          rows: [],
        },
      },
    },
    client: {
      dataNavbar: 1,
      actionNavbar: 1,
    },
    admin: {
      navBar: 1,
    },
  })

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  return useContext(AppContext)
}

// const ReportsContext = createContext()

// export function ReloadWrapper({ children }) {
//   const [reports, setReports] = useState({
//     activities: false,
//     policies: false,
//     client: false,
//     agency: false,
//     comment: false,
//   })
//   return (
//     <ReportsContext.Provider value={{ reports, setReports }}>
//       {children}
//     </ReportsContext.Provider>
//   )
// }

// export function useReportsContext() {
//   return useContext(ReportsContext)
// }

const ReloadContext = createContext()

export function ReloadWrapper({ children }) {
  const [reload, setReload] = useState({
    activities: false,
    policies: false,
    client: false,
    agency: false,
    comment: false,
    suspense: false,
    paths: false
  })
  return (
    <ReloadContext.Provider value={{ reload, setReload }}>
      {children}
    </ReloadContext.Provider>
  )
}

export function useReloadContext() {
  return useContext(ReloadContext)
}

const NotificationContext = createContext()
const NotificationUpdateContext = createContext()

export function NotificationWrapper({ children }) {
  const [notification, setNotification] = useState([])
  return (
    <NotificationContext.Provider value={{notification}}>
      <NotificationUpdateContext.Provider value={{setNotification}}>
        {children}
      </NotificationUpdateContext.Provider>
    </NotificationContext.Provider>
  )
}

export function useNotificationContext() {
  return useContext(NotificationContext)
}
export function useNotificationUpdateContext() {
  return useContext(NotificationUpdateContext)
}

const AgencyContext = createContext()

export function AgencyWrapper({ children }) {
  const [agency, setAgency] = useState({
    id: null,
    uid: null,
    name: null,
    email: null,
    image_file: null,
    users: null,
  })
  return (
    <AgencyContext.Provider value={{ agency, setAgency }}>
      {children}
    </AgencyContext.Provider>
  )
}

export function useAgencyContext() {
  return useContext(AgencyContext)
}

const ClientDrawerContext = createContext()

export function ClientDrawerWrapper({ children }) {
  const [clientDrawer, setClientDrawer] = useState({
    isOpen: false,
    clientId: null,
    isRenewal: false,
    renewalMonth: null,
    renewalYear: null,
    nav: 1,
    style: 1,
    companyId:null,
    parent:false,
    writing:false
  })
  return (
    <ClientDrawerContext.Provider value={{ clientDrawer, setClientDrawer }}>
      {children}
    </ClientDrawerContext.Provider>
  )
}

export function useClientDrawerContext() {
  return useContext(ClientDrawerContext)
}

const ParentCompanyDrawerContext = createContext()

export function ParentCompanyDrawerWrapper({ children }) {
  const [parentCompanyDrawer, setParentCompanyDrawer] = useState({
    isOpen: false,
    companyId: null,
  })
  return (
    <ParentCompanyDrawerContext.Provider
      value={{ parentCompanyDrawer, setParentCompanyDrawer }}
    >
      {children}
    </ParentCompanyDrawerContext.Provider>
  )
}
export function useParentCompanyDrawerContext() {
  return useContext(ParentCompanyDrawerContext)
}

const WritingCompanyDrawerContext = createContext()

export function WritingCompanyDrawerWrapper({ children }) {
  const [writingCompanyDrawer, setWritingCompanyDrawer] = useState({
    isOpen: false,
    companyId: null,
  })
  return (
    <WritingCompanyDrawerContext.Provider
      value={{ writingCompanyDrawer, setWritingCompanyDrawer }}
    >
      {children}
    </WritingCompanyDrawerContext.Provider>
  )
}

export function useWritingCompanyDrawerContext() {
  return useContext(WritingCompanyDrawerContext)
}

const AppHeaderContext = createContext()

export function AppHeaderWrapper({ children }) {
  const [appHeader, setAppHeader] = useState({
    titleContent: '',
  })
  return (
    <AppHeaderContext.Provider value={{ appHeader, setAppHeader }}>
      {children}
    </AppHeaderContext.Provider>
  )
}

export function useAppHeaderContext() {
  return useContext(AppHeaderContext)
}

const PhoneContext = createContext()

export function PhoneWrapper({ children }) {
  const [phoneState, setPhoneState] = useState({
    auth:false,
    tab: 1,
    recentCalls: [],
  })
  return (
    <PhoneContext.Provider value={{phoneState, setPhoneState }}>
      {children}
    </PhoneContext.Provider>
  )
}

export function usePhoneContext() {
  return useContext(PhoneContext)
}

const AMS360ValueListContext = createContext()

export function AMS360ValueListWrapper({ children }) {
  const [AMS360ValueList, setAMS360ValueList] = useState({
    activityAction:null,
    docType:null,
  })
  return (
    <AMS360ValueListContext.Provider value={{AMS360ValueList, setAMS360ValueList }}>
      {children}
    </AMS360ValueListContext.Provider>
  )
}

export function useAMS360ValueListContext() {
  return useContext(AMS360ValueListContext)
}

const UpdateDataContext = createContext()

export function UpdateDataWrapper({ children }) {
  const [updateData, setUpdateData] = useState({
    task:null
  })
  return (
    <UpdateDataContext.Provider value={{updateData, setUpdateData }}>
      {children}
    </UpdateDataContext.Provider>
  )
}

export function useUpdateDataContext() {
  return useContext(UpdateDataContext)
}