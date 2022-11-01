import React from 'react'
import Panel from '../ui/panel/Panel'
import TagContainer from '../ui/tag/TagContainer'
import LineIcon from '../util/LineIcon'

const ClientHeader = ({
  client,
}) => {
  return (
    <div className="flex items-center w-full lg:py-4">
      <div className={`hidden mr-4 lg:flex items-center rounded px-2 text-5xl text-white`}>
        <LineIcon iconSize={25} size="md" line={client?.line} />
      </div>
      <div className={`mr-4 flex lg:hidden items-center rounded px-2 text-5xl text-white`}>
        <LineIcon iconSize={20} size="sm" line={client?.line} />
      </div>
      <div className="flex w-full flex-col max-w-[400px]">
        <h6 className="text-sm lg:text-xl">{client?.client_name}</h6>
        <TagContainer tags={client?.tags} />
      </div>
    </div>
  )
}

export default ClientHeader
