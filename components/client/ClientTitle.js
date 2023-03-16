import React from 'react'
import Panel from '../ui/panel/Panel'
import TagContainer from '../ui/tag/TagContainer'
import LineIcon from '../util/LineIcon'

const ClientHeader = ({ client }) => {
  return (
    <div className="flex items-center w-full xl:py-4">
      <div
        className={`mr-4 hidden items-center rounded px-2 text-5xl text-white xl:flex`}
      >
        <LineIcon iconSize={25} size="md" line={client?.line} />
      </div>
      <div
        className={`mr-4 flex items-center rounded px-2 text-5xl text-white xl:hidden`}
      >
        <LineIcon iconSize={20} size="sm" line={client?.line} />
      </div>
      <div className="flex w-full max-w-[400px] flex-col">
        <h6 className="text-sm xl:text-xl">{client?.client_name}</h6>
        <TagContainer clientId={client?.id} allowAddition tags={client?.tags} />
      </div>
    </div>
  )
}

export default ClientHeader
