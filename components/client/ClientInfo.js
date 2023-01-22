import { User } from '@nextui-org/react'
import React from 'react'
import Panel from '../ui/panel/Panel'
import PanelTitle from '../ui/title/PanelTitle'
import { MdOutlineLocationOn } from 'react-icons/md'
import ClientReferences from './ClientReferences'
import { getIcon } from '../../utils/utils'

const ClientInfo = ({
  client,
  flat = true,
  noBg = true,
  shadow = false,
  overflow = false,
  horizontal = false,
  editable = false,
}) => {
  const getPosition = (user) => {
    return user?.producer
      ? 'Producer'
      : user?.account_manager
      ? 'Account Manager'
      : user?.support
      ? 'Support'
      : 'Admin'
  }
  return (
    <Panel
      horizontal={horizontal}
      flat={flat}
      noBg={noBg}
      shadow={shadow}
      overflow={overflow}
    >
      <div className="flex flex-col flex-auto shrink-0">
        <PanelTitle title={`Reps`} color="indigo" />
        <div className={`flex flex-auto shrink-0 flex-wrap space-y-2`}>
          {client?.users?.map((u) => (
            <div className="flex" key={u.id}>
              <User src={u.image_file} name={u.name}>
                {getPosition(u)}
              </User>
            </div>
          ))}
        </div>
      </div>
      <div className={`flex w-full flex-col py-2 xl:flex-row`}>
        <div className={`flex w-full flex-col `}>
          <PanelTitle title={`Address`} color="orange" />
          <div className="flex items-center h-full">
            <div className="flex items-center justify-center h-full px-2 border-r border-sky-500">
              {getIcon('location')}
            </div>
            <div className="flex flex-col px-2">
              <h6>{client?.client_name}</h6>
              <h6>{client?.address}</h6>
              <div className="flex items-center space-x-1">
                <h6>
                  {client?.city}
                  {client?.city ? `,` : null}
                </h6>
                <h6>{client?.state}</h6>
                <h6>{client?.zipcode}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ClientReferences client={client} />
    </Panel>
  )
}

export default ClientInfo
