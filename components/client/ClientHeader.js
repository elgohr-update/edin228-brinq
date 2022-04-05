import React from 'react'
import Panel from '../ui/panel/Panel'
import TagBasic from '../ui/tag/TagBasic'
import LineIcon from '../util/LineIcon'

const ClientHeader = ({client, flat=true, noBg=true, shadow=false, editable=false}) => {
  return (
    <Panel flat={flat} noBg={noBg} shadow={shadow}>
        <div className="flex items-center w-full pb-4">
            <div className={`flex items-center text-5xl mr-4 px-2 rounded text-white`}>
                <LineIcon iconSize={30} size="lg" line={client?.line} />
            </div>
            <div className="flex flex-col w-full">
                <h3>{client?.client_name}</h3>
                <div className="flex items-center w-full">
                    <div className={`flex flex-1 flex-wrap w-full space-x-2`}>
                        {
                            client?.tags?.map( x => {
                                return <TagBasic key={x.id} text={x.name} color={x.color} />
                            })
                        }
                    </div>
                </div>  
            </div>    
        </div>
    </Panel>
  )
}

export default ClientHeader