import React from 'react'
import Panel from '../ui/panel/Panel'
import PanelTitle from '../ui/title/PanelTitle'
import ClientCrossReferenceCard from './ClientCrossReferenceCard'

const ClientReferences = ({client, flat=true, noBg=true, shadow=false, overflow=false, editable=false}) => {
  return (
    <div className="flex flex-col w-full py-2">
        <PanelTitle title={`Cross References`} color="lime" />
        <div className={`flex flex-col w-full space-y-1`}>
            {
                client?.clientrefgroups[0]?.refs.filter(x => x.client_id != client.id).map( cref => (
                    <ClientCrossReferenceCard cref={cref} />
                ))
            }
        </div>
    </div>
  )
}

export default ClientReferences