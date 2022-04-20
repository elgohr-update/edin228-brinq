import React from 'react'
import Panel from '../ui/panel/Panel'
import TagBasic from '../ui/tag/TagBasic'
import TagContainer from '../ui/tag/TagContainer'
import LineIcon from '../util/LineIcon'

const ClientTitle = ({client, flat=true, noBg=true, shadow=false, editable=false}) => {
  return (
    <Panel flat={flat} noBg={noBg} shadow={shadow}>
        <div className="flex items-center w-full py-4">
            <div className={`flex items-center text-5xl mr-4 px-2 rounded text-white`}>
                <LineIcon iconSize={30} size="lg" line={client?.line} />
            </div>
            <div className="flex flex-col w-full">
                <h3>{client?.client_name}</h3>
                <TagContainer tags={client?.tags} />
            </div>    
        </div>
    </Panel>
  )
}

export default ClientTitle