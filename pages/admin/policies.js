import { useTheme } from '@nextui-org/react'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { MdOutlineAdminPanelSettings } from 'react-icons/md'
import PolicySettings from '../../components/admin/policy/PolicySettings'
import PageTitle from '../../components/ui/pageheaders/PageTitle'
import { useAppContext, useAppHeaderContext } from '../../context/state'
import AdminLayout from '../../layouts/AdminLayout'
import { timeout } from '../../utils/utils'

export default function AdminPolicies() {
  const { type } = useTheme()
  const [data, setData] = useState(null)
  const { state, setState } = useAppContext()
  const { appHeader, setAppHeader } = useAppHeaderContext()

  const fetchData = async () => {
    const res = await useNextApi('GET', `/api/agency/`)
    setData(res)
  }

  useEffect(() => {
    let isCancelled = false
    setAppHeader({
      ...appHeader,
      titleContent: (
        <PageTitle
          icon={<MdOutlineAdminPanelSettings />}
          text="Agency Policy Renewal Templates"
        />
      ),
    })
    return () => {
      isCancelled = true
    }
  }, [])

  return (
    <div>
      <PolicySettings />
    </div>
  )
}
AdminPolicies.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>
}
