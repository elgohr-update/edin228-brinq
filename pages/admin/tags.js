import { Button, Loading, useTheme } from '@nextui-org/react'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { MdOutlineAdminPanelSettings } from 'react-icons/md'
import PolicySettings from '../../components/admin/policy/PolicySettings'
import PageTitle from '../../components/ui/pageheaders/PageTitle'
import PanelTitle from '../../components/ui/title/PanelTitle'
import { useAppContext, useAppHeaderContext } from '../../context/state'
import AdminLayout from '../../layouts/AdminLayout'

export default function AdminTags() {
  const { type } = useTheme()
  const [data, setData] = useState(null)
  const { state, setState } = useAppContext()
  const { appHeader, setAppHeader } = useAppHeaderContext()
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const fetchData = async () => {
    const res = await useNextApi('GET', `/api/tags/`)
    setData(res)
  }

  useEffect(() => {
    let isCancelled = false
    setAppHeader({
      ...appHeader,
      titleContent: (
        <PageTitle icon={<MdOutlineAdminPanelSettings />} text="Tags" />
      ),
    })
    return () => {
      isCancelled = true
    }
  }, [])

  return (
    <div className="flex flex-col w-full h-full p-4">
      <div className="w-full py-2">
        <PanelTitle title={`Tags`} color="yellow" />
      </div>
      <div className="flex flex-col w-full">
        <div>
          <Button
            disabled={loading}
            auto
            color="gradient"
            onClick={() => setShowModal(true)}
          >
            {loading ? (
              <Loading type="points-opacity" color="currentColor" size="md" />
            ) : (
              <div>Create</div>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
AdminTags.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>
}
