import { createContext, useContext, useState } from 'react';

const ReloadContext = createContext();

export function ReloadWrapper({ children }) {
  const [reload, setReload] = useState(
    {
        activities:false,
        policies:false,
        client:false,
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