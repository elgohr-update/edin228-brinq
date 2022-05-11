import React from 'react'
import Panel from '../ui/panel/Panel'
import TagContainer from '../ui/tag/TagContainer'
import LineIcon from '../util/LineIcon'

const ClientTitle = ({
  client,
}) => {
  return (
    <div className="flex w-full items-center py-4">
      <div
        className={`mr-4 flex items-center rounded px-2 text-5xl text-white`}
      >
        <LineIcon iconSize={25} size="md" line={client?.line} />
      </div>
      <div className="flex w-full flex-col">
        <h3>{client?.client_name}</h3>
        <TagContainer tags={client?.tags} />
      </div>
    </div>
  )
}

export default ClientTitle
