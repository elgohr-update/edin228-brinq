import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppWrapper({ children }) {
  const [state, setState] = useState(
    {
      search: '',
      scrollY:0,
      reports:{
        default:'clients',
        data:{
          clients:{
            raw: [],
            filtered: [],
            loading:true,
          },
          policies:{
            raw: [],
            filtered: [],
            loading:true,
          },
          carriers:{
            raw: [],
            filtered: [],
            loading:true,
          },
          nb:{
            raw: [],
            filtered: [],
            loading:true,
          }
        },
        filters:{
          clients:{
            minPrem:null,
            maxPrem:null,
            minPolicies:null,
            maxPolicies:null,
            lineList:['Commercial Lines','Personal Lines','Benefits']
          }
        }
      },
      drawer:{
          client:{
              isOpen:false,
              clientId:null,
              isRenewal:false,
              renewalMonth:null,
              renewalYear:null,
              nav: 1,
          }
      },
      costComparison:{
        builder:{
          template: {
            id:null,
            title: null,
            headers: [],
            rows: [],
          }
        }
      },
      client: {
        dataNavbar: 1,
        actionNavbar: 1,
      },
      admin:{
        navBar: 1
      }
    }
  )

  return (
    <AppContext.Provider value={{state, setState}}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}

const ReloadContext = createContext();

export function ReloadWrapper({ children }) {
  const [reload, setReload] = useState(
    {
        activities:false,
        policies:false,
        client:false,
        agency:false
    }
  )
  return (
    <ReloadContext.Provider value={{reload, setReload}}>
      {children}
    </ReloadContext.Provider>
  );
}

export function useReloadContext() {
  return useContext(ReloadContext);
}

const AgencyContext = createContext();

export function AgencyWrapper({ children }) {
  const [agency, setAgency] = useState(
    {
      id:null,
      uid:null,
      name:null,
      email:null,
      image_file:null,
      users:null,
    }
  )
  return (
    <AgencyContext.Provider value={{agency, setAgency}}>
      {children}
    </AgencyContext.Provider>
  );
}

export function useAgencyContext() {
  return useContext(AgencyContext);
}