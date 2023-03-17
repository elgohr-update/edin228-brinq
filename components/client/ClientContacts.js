import React from 'react'
import ContactCard from '../contact/ContactCard'
import Panel from '../ui/panel/Panel'
import PanelTitle from '../ui/title/PanelTitle'

const ClientContacts = ({
  client,
  flat = true,
  noBg = true,
  shadow = false,
  overflow = false,
  editable = false,
  showTitle = true,
}) => {
  return (
    <Panel flat={flat} noBg={noBg} shadow={shadow} overflow={overflow}>
      {showTitle ? <PanelTitle title={`Contacts`} color="lime" /> : null}
      <div className={`flex max-h-[40vh] flex-wrap overflow-y-auto`}>
        {client?.contacts?.map((c) => (
          <div className="flex flex-auto" key={c.id}>
            <ContactCard contact={c} />
          </div>
        ))}
      </div>
    </Panel>
  )
}

export default ClientContacts
