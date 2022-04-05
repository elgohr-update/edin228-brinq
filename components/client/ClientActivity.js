import React from 'react'
import ActivityCard from '../activity/ActivityCard'
import Panel from '../ui/panel/Panel'

const ClientActivity = ({activity, flat=true, noBg=true, shadow=false, editable=false}) => {
  return (
    <Panel flat={flat} noBg={noBg} shadow={shadow}>
        <div className={`rounded flex flex-col w-full h-full`}>
            {activity?.map( u => (
                <ActivityCard key={u.id} activity={u} hideClient />
            ))}
        </div>
    </Panel>
  )
}

export default ClientActivity