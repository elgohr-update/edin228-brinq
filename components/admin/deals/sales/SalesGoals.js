import { Button } from '@nextui-org/react'
import React from 'react'
import { useAgencyContext, useReloadContext } from '../../../../context/state'
import { useNextApi } from '../../../../utils/utils'
import PanelTitle from '../../../ui/title/PanelTitle'
import UserSalesItem from './UserSalesItem'

export default function SalesGoals() {
  const { agency, setAgency } = useAgencyContext()
  const { reload, setReload } = useReloadContext()

  const getProducers = () => {
    return agency?.users?.filter((u) => u.producer && u.is_active)
  }

  const updateGoals = async () => {
    const data = getProducers().map( u => {return {id:u.id,monthly_rev_goal:u.monthly_rev_goal}})
    const bundle = JSON.stringify({
      data
    })
    const res = await useNextApi('PUT', `/api/agency/sales`, bundle)
    if (res){
      setReload({
        ...reload,
        agency: true,
      })
    }
  }

  return (
    <div className="flex w-full flex-col">
      <PanelTitle title={`Sales Goals`} color="indigo" />
      <div className="flex w-full flex-col space-y-2 p-4">
        {getProducers().map((x) => (
          <UserSalesItem user={x} key={x.id} />
        ))}
      </div>
      <div className="flex">
        <Button className="w-1/2" auto color="gradient" onClick={() => updateGoals()}>
          Save
        </Button>
      </div>
    </div>
  )
}
