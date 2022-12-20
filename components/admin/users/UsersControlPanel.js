import React, { useEffect, useState } from 'react'
import { timeout, useNextApi } from '../../../utils/utils'
import UsersTable from '../../table/UsersTable'
import PanelTitle from '../../ui/title/PanelTitle'

export default function UsersControlPanel() {
  const [users, setUsers] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(100)
      if (!isCancelled) {
        fetchData()
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const res = await useNextApi('GET', `/api/users`)
    setUsers(res)
    setLoading(false)
  }



  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col w-full h-full lg:w-8/12">
        <PanelTitle title="Users" />
      </div>
      {users && !loading ? <UsersTable data={users} callback={fetchData} /> : null}
    </div>
  )
}
