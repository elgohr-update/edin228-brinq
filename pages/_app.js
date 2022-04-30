
import '../styles/globals.css'

import { SessionProvider } from "next-auth/react"
import { createTheme, NextUIProvider } from "@nextui-org/react"
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { AgencyWrapper, AppWrapper, ReloadWrapper, ClientDrawerWrapper, ActivityDrawerWrapper } from '../context/state';
import ProgressBar from '@badrap/bar-of-progress';
import Router from 'next/router';

const progress = new ProgressBar({
  size: 2,
  color: "#0ad2ff",
  className: "z-90",
  delay: 100,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

const lightTheme = createTheme({
  type: 'light',
  theme:{
    colors:{ 
      text:'#0c083d',
      primary: '#00b8ff',
      primaryDark: '#0ad2ff1a',
      primaryLight: '#0ad2ff1a', 
      primaryShadow: '#0ad2ff91'
    },
    shadows: {
      xs: '-4px 0 4px rgb(0 0 0 / 5%);',
      sm: '0 5px 20px -5px rgba(0, 0, 0, 0.1)',
      md: '0 8px 30px rgba(0, 0, 0, 0.15)',
      lg: '0 30px 60px rgba(0, 0, 0, 0.15)',
      xl: '0 40px 80px rgba(0, 0, 0, 0.25)'
    }
  }
})

const darkTheme = createTheme({
  type: 'dark',
  theme:{
    colors:{ 
      text:'#d3d3d3',
      primary: '#00b8ff',
      primaryDark: '#0ad2ff1a',
      primaryLight: '#0ad2ff1a', 
      primaryShadow: '#0ad2ff91'
    },
    shadows: {
      xs: '-4px 0 15px rgb(0 0 0 / 50%)',
      sm: '0 5px 20px -5px rgba(20, 20, 20, 0.1)',
      md: '0 8px 30px rgba(20, 20, 20, 0.15)',
      lg: '0 30px 60px rgba(20, 20, 20, 0.15)',
      xl: '0 40px 80px rgba(20, 20, 20, 0.25)'
    }
  }
})

function MyApp({ Component,  pageProps: { session, ...pageProps }}) {
  const getLayout = Component.getLayout || ((page) => page)
  return (
    <SessionProvider session={session}>
      <AppWrapper>
        <AgencyWrapper>
          <ReloadWrapper>
            <ClientDrawerWrapper>
              <ActivityDrawerWrapper>
                <NextThemesProvider
                  defaultTheme="system"
                  attribute="class"
                  value={{
                    light: lightTheme.className,
                    dark: darkTheme.className
                  }}
                >
                  <NextUIProvider>
                    {getLayout(<Component {...pageProps} />)}
                  </NextUIProvider>
                </NextThemesProvider>
              </ActivityDrawerWrapper>
            </ClientDrawerWrapper>
          </ReloadWrapper>  
        </AgencyWrapper>
      </AppWrapper>
    </SessionProvider>
  )
}

export default MyApp