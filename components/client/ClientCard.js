import { Avatar, Tooltip, useTheme } from '@nextui-org/react'
import React from 'react'
import { abbreviateMoney, getIcon, truncateString } from '../../utils/utils'
import ClientTableCell from '../table/ClientTableCell'
import UserAvatar from '../user/Avatar'
import LineIcon from '../util/LineIcon'

function ClientCard({ client }) {
  const { type } = useTheme()
  const ClientInfo = () => {
    return (
      <div className="flex flex-col w-full space-y-1 xl:flex-row xl:items-center xl:space-y-0 xl:space-x-2">
        <div className="flex items-center w-full space-x-2">
          <div className="flex pl-2">
            <Avatar.Group>
              {client?.users.map((u) => (
                <UserAvatar
                  key={u.id}
                  size="sm"
                  isLink={false}
                  squared={false}
                  isGrouped
                  isUser
                  passUser={u}
                />
              ))}
            </Avatar.Group>
          </div>
          <div>
            <Tooltip content={client.line}>
              <LineIcon iconSize={14} size="xs" line={client.line} />
            </Tooltip>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-end w-full space-x-2">
            <div className="flex items-center flex-auto space-x-1 text-teal-500 ">
              <h6 className="flex items-center">{getIcon('dollarSign')}</h6>
              <h6 className="flex w-[30px] flex-auto xl:justify-end">
                ${abbreviateMoney(client.premium)}
              </h6>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center w-full">
      <div className="flex flex-col w-full">
        <ClientTableCell
          type={type}
          clientId={client.id}
          cellValue={truncateString(client.client_name)}
          subContent={<ClientInfo />}
        />
      </div>
    </div>
  )
}

export default ClientCard
