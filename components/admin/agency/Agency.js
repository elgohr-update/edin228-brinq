import React from 'react'
import AgencyBranches from './AgencyBranches'
import AgencyHeader from './AgencyHeader'
import AgencyIntegrations from './AgencyIntegrations'

export default function Agency({data}) {
  return (
    <div className="flex flex-col w-full h-full space-y-4 lg:w-4/12">
      <AgencyHeader data={data} />
      <AgencyBranches data={data} />
      <AgencyIntegrations data={data} />
    </div>
  )
}
