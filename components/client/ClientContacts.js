import React from 'react'
import ContactCard from '../contact/ContactCard'
import Panel from '../ui/panel/Panel'

const ClientContacts = ({client, flat=true, noBg=true, shadow=false, overflow=false, editable=false}) => {
    return (
      <Panel flat={flat} noBg={noBg} shadow={shadow} overflow={overflow}>
        <h4>
            Contacts
        </h4>
        <div className={`flex flex-wrap w-full`}>
            {client?.contacts?.map( c => (
                <ContactCard key={c.id} contact={c}  />
            ))}
        </div>
    </Panel>
  )
}

export default ClientContacts