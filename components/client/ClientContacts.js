import React from 'react'
import ContactCard from '../contact/ContactCard'
import Panel from '../ui/panel/Panel'
import PanelTitle from '../ui/title/PanelTitle'

const ClientContacts = ({client, flat=true, noBg=true, shadow=false, overflow=false, editable=false}) => {
    return (
      <Panel flat={flat} noBg={noBg} shadow={shadow} overflow={overflow}>
        <PanelTitle title={`Contacts`} color="sky" />
        <div className={`flex flex-wrap`}>
            {client?.contacts?.map( c => (
                <ContactCard key={c.id} contact={c}  />
            ))}
        </div>
    </Panel>
  )
}

export default ClientContacts