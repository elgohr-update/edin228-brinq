import React from 'react'
import AgencyActions from './AgencyActions'
import AgencyBranches from './AgencyBranches'
import AgencyHeader from './AgencyHeader'
import AgencyIntegrations from './AgencyIntegrations'

export default function Agency({data}) {
  return (
    <div className="flex flex-col w-full h-full mb-2 space-y-4">
      <AgencyHeader data={data} />
      <AgencyBranches data={data} />
      <AgencyIntegrations data={data} />
      <AgencyActions />
    </div>
  )
}
