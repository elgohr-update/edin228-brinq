import { Popover, useTheme } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { isMobile, timeout, useNextApi } from '../../../utils/utils'
import PanelTitle from '../../ui/title/PanelTitle'
import AuditCard from './AuditCard'

function DashboardAudit({ gradient = null, shadowColor = 'pink' }) {
  const { type } = useTheme()
  const [policies, setPolicies] = useState(null)
  const [contacts, setContacts] = useState(null)
  const [policiesTotal, setPoliciesTotal] = useState(0)
  const [contactsTotal, setContactsTotal] = useState(0)

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
    setPoliciesTotal(
      res1?.past_expiration.length +
        res1?.zero_premium.length +
        res1?.policies_missing_description.length
    )
    const res2 = await useNextApi('GET', `/api/audit/contacts`)
    setContacts(res2)
    setContactsTotal(
      res2?.contacts_missing_email.length + res2?.contacts_missing.length
    )
  }
  const mobile = isMobile()
  const getShadowColor = () => {
    switch (shadowColor) {
      case 'green':
        return 'green-shadow'
      case 'blue':
        return 'blue-shadow'
      case 'orange':
        return 'orange-shadow'
      case 'purple':
        return 'purple-shadow'
      case 'pink':
        return 'pink-shadow'
    }
  }
  return (
    <div
      className={`content-dark relative flex flex-auto cursor-pointer flex-col items-end panel-theme-${type} h-[120px] w-full 2xl:w-[240px] overflow-hidden rounded-lg p-4 ${gradient} ${getShadowColor()}`}
    >
      <div className={`flex w-full items-center justify-end gap-4 rounded-lg`}>
        <Popover placement="bottom-right">
          <Popover.Trigger>
            <div
              className={`content-dark relative flex cursor-pointer flex-col items-end overflow-hidden rounded-lg `}
            >
              <div className="z-30 flex items-end justify-end w-full h-full font-bold">
                <div className="flex text-3xl font-bold">
                  {policies
                    ? policies?.past_expiration.length +
                      policies?.zero_premium.length +
                      policies?.policies_missing_description.length
                    : 0}
                </div>
              </div>
              <div
                className={`z-30 flex items-end justify-end text-right text-sm font-bold`}
              >
                Policy Issues
              </div>
            </div>
          </Popover.Trigger>
          <Popover.Content css={{ zIndex: '99', px: '$4', py: '$2' }}>
            <div className="flex items-center w-full gap-2">
              <AuditCard
                title={'Active Policies Expired'}
                init={policies?.past_expiration}
                usePolicyCard
              />
              <AuditCard
                title={'Policies with $0 Prem'}
                init={policies?.zero_premium}
                usePolicyCard
              />
              <AuditCard
                title={'Policies Missing Description'}
                init={policies?.policies_missing_description}
                usePolicyCard
              />
            </div>
          </Popover.Content>
        </Popover>
        <Popover placement="bottom-right">
          <Popover.Trigger>
            <div
              className={`content-dark relative flex cursor-pointer flex-col items-end overflow-hidden rounded-lg `}
            >
              <div className="z-30 flex items-end justify-end w-full h-full font-bold">
                <div className="flex text-3xl font-bold">
                  {contacts
                    ? contacts?.contacts_missing_email.length +
                      contacts?.contacts_missing.length
                    : 0}
                </div>
              </div>
              <div
                className={`z-30 flex items-end justify-end text-right text-sm font-bold`}
              >
                Contact Issues
              </div>
            </div>
          </Popover.Trigger>
          <Popover.Content css={{ zIndex: '99', px: '$4', py: '$2' }}>
            <div className="flex items-center w-full gap-2">
              <AuditCard
                title={'Contacts Missing Email'}
                init={contacts?.contacts_missing_email}
                useContactCard
              />
              <AuditCard
                title={'Clients Missing Contacts'}
                init={contacts?.contacts_missing}
                useClientCard
              />
            </div>
          </Popover.Content>
        </Popover>
      </div>
      <div className={`z-30 flex py-1 text-right font-bold xl:text-xl`}>
        Client Audits
      </div>
    </div>
  )
}

export default DashboardAudit
