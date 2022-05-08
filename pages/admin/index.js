import { useTheme } from '@nextui-org/react'
import React, { useEffect } from 'react'
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

export default function Admin() {
  const { type } = useTheme()
  const { state, setState } = useAppContext()
  const { appHeader, setAppHeader } = useAppHeaderContext()

  useEffect(() => {
    setAppHeader({
      ...appHeader,
      titleContent: (
        <PageTitle icon={<MdOutlineAdminPanelSettings />} text="Admin" />
      ),
    })
  }, [])

  return (
    <main className="flex w-full flex-col">
      <PageHeader>
        <div className={`w-max rounded-lg py-1`}>
          <AdminNavbar />
        </div>
      </PageHeader>

      <div className="flex flex-col pl-4">
        <div className="flex">
          {state.admin.navBar == 1 ? (
            <div className="flex w-full">
              <Agency />
              <UsersControlPanel />
            </div>
          ) : state.admin.navBar == 2 ? (
            <DealsSalesSettings />
          ) : state.admin.navBar == 3 ? (
            <Agency />
          ) : state.admin.navBar == 4 ? (
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
