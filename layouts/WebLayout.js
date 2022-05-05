import Head from 'next/head'
import WebContainer from '../components/ui/body/WebContainer';

export default function WebLayout({ children }) {
    return (
      <>
        <Head>
            <title>brinq</title>
            <link rel="icon" href="/brinq-icon.ico" />
        </Head>
        <WebContainer children={children} />
      </>
    )
}