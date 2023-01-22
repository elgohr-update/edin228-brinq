import { useTheme } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { useAppContext, useAppHeaderContext } from '../../context/state'
import { MdOutlineAdminPanelSettings } from 'react-icons/md'
import AdminLayout from '../../layouts/AdminLayout'
import PageHeader from '../../components/ui/pageheaders/PageHeader'
import PageTitle from '../../components/ui/pageheaders/PageTitle'
import UsersControlPanel from '../../components/admin/users/UsersControlPanel'
import Agency from '../../components/admin/agency/Agency'
import AdminNavbar from '../../components/admin/AdminNavbar'
import PolicySettings from '../../components/admin/policy/PolicySettings'
import DealsSalesSettings from '../../components/admin/deals/DealsSalesSettings'
import { timeout, useNextApi } from '../../utils/utils'

export default function Admin() {
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
        <PageTitle icon={<MdOutlineAdminPanelSettings />} text="Admin" />
      ),
    })
    return () => {
      isCancelled = true
    }
  }, [])

  return (
    <main className="flex flex-col w-full">
      <PageHeader>
        <div className={`w-max rounded-lg py-1`}>
          <AdminNavbar />
        </div>
      </PageHeader>

      <div className="flex flex-col xl:pl-4">
        <div className="flex">
          {state.admin.navBar == 1 ? (
            <div className="flex flex-col w-full p-2 space-x-0 space-y-2">
              <Agency data={data} />
              <UsersControlPanel data={data} />
            </div>
          ) : state.admin.navBar == 2 ? (
            <DealsSalesSettings />
          ) : state.admin.navBar == 3 ? (
            <PolicySettings />
          ) : null}
        </div>
      </div>
    </main>
  )
}

Admin.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>
}
