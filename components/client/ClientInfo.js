import { User } from '@nextui-org/react'
import React from 'react'
import Panel from '../ui/panel/Panel'

const ClientInfo = ({client, flat=true, noBg=true, shadow=false, overflow=false, editable=false}) => {
  return (
    <Panel flat={flat} noBg={noBg} shadow={shadow} overflow={overflow}>
        <div className="flex flex-col w-full">
            <h4 className={`mb-2`}>
                Reps
            </h4>
            <div className={`flex flex-wrap w-full space-y-2`}>
                {client?.users?.map( u => (
                    <div className="flex" key={u.id}>
                        <User 
                            src={u.image_file}
                            name={u.name}
                        >
                            {u.email}
                        </User>
                    </div>
                ))}
            </div>
        </div>
        <div className={`flex flex-col md:flex-row w-full py-2`}>
            <div className={`flex flex-col w-full `}>
                <h4 className={`mb-2`}>
                    Address
                </h4>
                <div className="flex flex-col px-2">
                    <h6>{client?.client_name}</h6>
                    <h6>{client?.address}</h6>
                    <div className="flex items-center space-x-1">
                        <h6>{client?.city}{client?.city ? `,`:null}</h6>
                        <h6>{client?.state}</h6>
                        <h6>{client?.zipcode}</h6>
                    </div>
                </div>
            </div>
        </div>
    </Panel>
  )
}

export default ClientInfo