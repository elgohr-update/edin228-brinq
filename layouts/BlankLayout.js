import { Col, Container, Row, useTheme } from '@nextui-org/react';
import Head from 'next/head'
import BubbleBackground from '../components/ui/BubbleBackground';

export default function BlankLayout({ children }) {
    const { type } = useTheme();
    return (
      <>
        <Head>
            <title>brinq</title>
            <link rel="icon" href="/brinq-icon.ico" />
        </Head>
        <BubbleBackground />
        <Container fluid className={`container-main`}>
            <Row fluid className={`z-3`}>
              <Col className="h-screen">
                <Row fluid className={`z-3 w-full content-main`}>
                  {children}
                </Row>
              </Col>              
            </Row>
        </Container>
      </>
    )
}