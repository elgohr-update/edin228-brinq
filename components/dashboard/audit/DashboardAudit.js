import { useTheme } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { timeout, useNextApi } from '../../../utils/utils'
import PanelTitle from '../../ui/title/PanelTitle'
import AuditCard from './AuditCard'

function DashboardAudit() {
  const { type } = useTheme()
  const [policies, setPolicies] = useState(null)
  const [contacts, setContacts] = useState(null)

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(100)
      if (!isCancelled) {
        fetchData()
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [])

  const fetchData = async () => {
    const res1 = await useNextApi('GET', `/api/audit/policies`)
    setPolicies(res1)
    const res2 = await useNextApi('GET', `/api/audit/contacts`)
    setContacts(res2)
  }

  return (
    <div
      className={`relative flex h-full w-full flex-auto shrink-0 flex-col rounded-lg`}
    >
      <div className="pl-4">
        <PanelTitle title={`Audits`} color="red" />
      </div>
      <div
        className={`flex flex-col space-y-2 lg:flex-row lg:space-y-0 panel-theme-${type} ${type}-shadow min-h-[140px] w-full gap-2 rounded-lg p-2`}
      >
        <AuditCard
          color={'rose'}
          title={'Expired Policies'}
          init={policies?.past_expiration}
          usePolicyCard
        />
        <AuditCard
          title={'Policies with $0 Premium'}
          init={policies?.zero_premium}
          usePolicyCard
        />
        <AuditCard
          title={'Contacts missing Email'}
          init={contacts?.contacts_missing_email}
          useContactCard
        />
        {/* <AuditCard
          title={'Contacts missing phone'}
          init={contacts?.contacts_missing_phone}
          useContactCard
        /> */}
        <AuditCard
          title={'Clients with No Contacts'}
          init={contacts?.contacts_missing}
          useClientCard
        />
      </div>
    </div>
  )
}

export default DashboardAudit
