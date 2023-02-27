import React from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import Agency from '../../components/admin/agency/Agency'
import { useTheme } from '@nextui-org/react'
import { useState } from 'react'
import { useAppContext, useAppHeaderContext } from '../../context/state'
import { timeout, useNextApi } from '../../utils/utils'
import PageTitle from '../../components/ui/pageheaders/PageTitle'
import { MdOutlineAdminPanelSettings } from 'react-icons/md'
import { useEffect } from 'react'
import UsersControlPanel from '../../components/admin/users/UsersControlPanel'

export default function AdminAgency() {
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
    const handleChange = async () => {
      await timeout(100)
      if (!isCancelled) {
        fetchData()
      }
    }
    handleChange()
    setAppHeader({
      ...appHeader,
      titleContent: (
        <PageTitle
          icon={<MdOutlineAdminPanelSettings />}
          text="Agency and Users"
        />
      ),
    })
    return () => {
      isCancelled = true
    }
  }, [])
  return (
    <div className="flex flex-col w-full h-full gap-4 p-4 xl:flex-row">
      <Agency data={data} />
      <UsersControlPanel data={data} />
    </div>
  )
}

AdminAgency.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>
}
