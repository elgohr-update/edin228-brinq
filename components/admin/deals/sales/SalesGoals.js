import { Button, Loading } from '@nextui-org/react'
import React from 'react'
import { useState } from 'react'
import { useAgencyContext, useReloadContext } from '../../../../context/state'
import { useNextApi } from '../../../../utils/utils'
import PanelTitle from '../../../ui/title/PanelTitle'
import UserSalesItem from './UserSalesItem'

export default function SalesGoals() {
  const { agency, setAgency } = useAgencyContext()
  const { reload, setReload } = useReloadContext()
  const [loading, setLoading] = useState(false)

  const getProducers = () => {
    return agency?.users?.filter((u) => u.producer && u.is_active)
  }

  const updateGoals = async () => {
    setLoading(true)
    const data = getProducers().map( u => {return {id:u.id,monthly_rev_goal:u.monthly_rev_goal}})
    const bundle = JSON.stringify({data: data})
    const res = await useNextApi('PUT', `/api/agency/sales`, bundle)
    if (res){
      setLoading(false)
      setReload({
        ...reload,
        agency: true,
      })
    }
  }

  return (
    <div className="flex flex-col">
      <PanelTitle title={`Sales Goals`} color="indigo" />
      <div className="flex flex-col w-full p-4 space-y-2">
        {getProducers().map((x) => (
          <UserSalesItem user={x} key={x.id} />
        ))}
      </div>
      <div className="flex w-full">
        <Button className="w-full" auto color="gradient" onClick={() => updateGoals()}>
          {loading ? (
            <Loading type="points-opacity" color="currentColor" size="md" />
          ) : (
            <div>Save</div>
          )}
        </Button>
      </div>
    </div>
  )
}
