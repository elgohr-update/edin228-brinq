import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppWrapper({ children }) {
  const [state, setState] = useState(
    {
      search: '',
      reports:{
        default:'clients',
        data:{
          clients:{
            raw: [],
            filtered: []
          },
          policies:{
            raw: [],
            filtered: []
          },
          carriers:{
            raw: [],
            filtered: []
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
              renewalYear:null
          }
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