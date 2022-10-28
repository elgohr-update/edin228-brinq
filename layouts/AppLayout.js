import Head from "next/head";
import { Row, Col, useTheme } from '@nextui-org/react';
import { useEffect,useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import ClientDrawer from "../components/ui/drawer/ClientDrawer";
import { useActivityDrawerContext, useAgencyContext, useClientDrawerContext, useParentCompanyDrawerContext, useReloadContext, useWritingCompanyDrawerContext } from "../context/state";
import { HeaderContainer } from "../components/ui/Header/HeaderContainer";
import { SidebarContainer } from "../components/ui/Sidebar/SidebarContainer";
import { BodyContainer } from "../components/ui/body/BodyContainer";
import { timeout, useNextApi } from "../utils/utils";
import ActivityDrawer from "../components/ui/drawer/ActivityDrawer";
import ParentCompanyDrawer from "../components/ui/drawer/ParentCompanyDrawer";
import WritingCompanyDrawer from "../components/ui/drawer/WritingCompanyDrawer";
import AppNotification from "../components/ui/Notifications/AppNotification";
import { signOut } from 'next-auth/react'
import BubbleBackground from "../components/ui/BubbleBackground";

export default function AppLayout({ children }) {
    const { isDark, type } = useTheme();
    const { data: session, status } = useSession({
      required: true,
      onUnauthenticated() {
        router.push("/login")
        setIsAuth(false)
      },
    })
    const router = useRouter();
    const { agency, setAgency } = useAgencyContext()
    const { reload, setReload } = useReloadContext()
    const { clientDrawer } = useClientDrawerContext()
    const { activityDrawer } = useActivityDrawerContext()
    const { parentCompanyDrawer } = useParentCompanyDrawerContext()
    const { writingCompanyDrawer } = useWritingCompanyDrawerContext()
    const [isAuth, setIsAuth] = useState(true)
    
    // useEffect(() => {
    //   let isCancelled = false
    //   const handleChange = async () => {
    //     await timeout(1000)
    //     if (!isCancelled && !agency.id) {
    //       fetchData()
    //     }
    //   }
    //   handleChange()
    //   return () => {
    //     isCancelled = true
    //   }
    // }, [])
    useEffect(() => {
      fetchData()
    }, [])
  
    useEffect(() => {
      if (reload.agency) {
        let isCancelled = false
        const handleChange = async () => {
          await timeout(100)
          if (!isCancelled) {
            fetchData()
            setReload({
              ...reload,
              agency: false,
            })
          }
        }
        handleChange()
        return () => {
          isCancelled = true
        }
      }
    }, [reload])
  
    const fetchData = async () => {
      const res = await useNextApi('GET', `/api/agency/`)
      if (res){
        setAgency(res)
        setIsAuth(true) 
      }
      else {
        signOut()
      }
    }

    return (
      <>
        <Head>
            <title>brinq</title>
            <link rel="icon" href="/brinq-icon.ico" />
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        </Head>
        <div className={`overflow-hidden container-main`}>
            <BubbleBackground />
            {clientDrawer.isOpen ? <ClientDrawer /> : null}   
            {activityDrawer.isOpen ? <ActivityDrawer /> : null}   
            {parentCompanyDrawer.isOpen ? <ParentCompanyDrawer /> : null}   
            {writingCompanyDrawer.isOpen ? <WritingCompanyDrawer /> : null}
            <AppNotification />   
            <Row fluid className={`overflow-hidden z-3`}>
              {isAuth ? <SidebarContainer /> : null}
              <Col className="h-screen">
                {isAuth ? <HeaderContainer /> : null}
                <BodyContainer>
                  {isAuth ? children : null}
                </BodyContainer>
              </Col>              
            </Row>
        </div>
      </>
    )
}