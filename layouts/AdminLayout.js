import Head from "next/head";
import { Row, Col, useTheme } from '@nextui-org/react';
import { useEffect,useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import ClientDrawer from "../components/ui/drawer/ClientDrawer";
import { useAppContext } from "../context/state";
import { HeaderContainer } from "../components/ui/Header/HeaderContainer";
import { SidebarContainer } from "../components/ui/Sidebar/SidebarContainer";
import { BodyContainer } from "../components/ui/body/BodyContainer";

export default function AdminLayout({ children }) {
    const { type } = useTheme();
    const { data: session, status } = useSession({
      required: true,
      onUnauthenticated() {
        router.push("/login")
        setIsAuth(false)
      },
    })
    const router = useRouter();
    const {state, setState} = useAppContext();
    const [isAuth, setIsAuth] = useState(true)

    useEffect(() => {      
      if (status === "authenticated" && session.user.admin) {
        setIsAuth(true)
      }
      else if (status === 'loading') {
        setIsAuth(false)
      }else{
        setIsAuth(false)
        router.push("/login")
      }
    }, [session,status,router]);

    return (
      <>
        <Head>
            <title>brinq</title>
            <link rel="icon" href="/brinq-icon.ico" />
        </Head>
        <div className={`overflow-hidden container-main`}>
            <div className={`fixed h-screen w-full main-bg main-bg-${type} z-1`}/>
            <div className={`fixed h-screen w-full blur-screen blur-screen-${type} z-2`} />
            {state.drawer.client.isOpen ? <ClientDrawer /> : null}   
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