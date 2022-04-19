import { useTheme } from '@nextui-org/react'
import { useRouter } from 'next/router'
import React from 'react'
import ProposalNavbar from '../navbar/ProposalNavbar'
import ReportNavbar from '../navbar/ReportNavbar'

export default function HeaderNav() {
  const { isDark, type } = useTheme()
  const router = useRouter()

  return (
    <div>
      {router.pathname.includes(`/reports`) ? (
        <div className={`panel-flat-${type} ${type}-shadow rounded-lg px-4 py-1`}>
          <ReportNavbar />
        </div>
      ) : router.pathname.includes(`/tools`) ? (
        <div className={`panel-flat-${type} ${type}-shadow rounded-lg px-4 py-1`}>
          <ProposalNavbar />
        </div>
      ) : null}
    </div>
  )
}
