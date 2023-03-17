import { Tooltip, useTheme } from '@nextui-org/react'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import {
  formatMoney,
  getIcon,
  sortByProperty,
  truncateString,
} from '../../utils/utils'
import ClientRenewalNote from '../client/ClientRenewalNote'
import PolicyTableRow from '../policy/PolicyTableRow'
import LineIcon from '../util/LineIcon'
import ClientTableCell from './ClientTableCell'

function RenewalTableRow({
  tableItem,
  month,
  year,
  currentUser,
  expandAllRows,
}) {
  const { type } = useTheme()
  const [showPolicies, setShowPolicies] = useState(false)

  useEffect(() => {
    setShowPolicies(expandAllRows)
    return () => {}
  }, [expandAllRows])

  return (
    <div className="flex w-full min-w-[960px] border-b-[1px] border-zinc-800 pl-4">
      <div className="w-full py-2">
        <div className="flex items-center w-full">
          <div className="flex items-center w-full">
            <div className="flex items-center justify-center mr-2">
              <Tooltip content={tableItem.line}>
                <LineIcon iconSize={18} size="sm" line={tableItem.line} />
              </Tooltip>
            </div>
            <div className="w-full">
              <ClientTableCell
                cellValue={tableItem.client_name}
                clientId={tableItem.id}
                tags={tableItem.tags}
                type={type}
                isRnwl={true}
                month={month}
                year={year}
                // drawerCallback={clientDrawerSet}
                premiumTotal={
                  <>
                    <div className="flex justify-center text-xs font-bold">
                      <div className="flex w-[90px] justify-end text-teal-500">
                        {`$ ${formatMoney(tableItem.premium)}`}
                      </div>
                    </div>
                  </>
                }
                renewedTotal={
                  <>
                    <div className="flex justify-center text-xs">
                      <div className="flex w-[50px] justify-end font-bold">
                        <span
                          className={`mx-1 ${
                            tableItem.isRenewedCount == 0 ? 'text-red-500' : ''
                          }`}
                        >
                          {tableItem.isRenewedCount}
                        </span>{' '}
                        /<span className="mx-1">{tableItem.policy_count}</span>
                      </div>
                    </div>
                  </>
                }
              />
            </div>
          </div>
          <div
            className="pl-4 pr-5 transition duration-100 cursor-pointer hover:text-sky-500"
            onClick={() => setShowPolicies(!showPolicies)}
          >
            {showPolicies ? getIcon('up') : getIcon('left')}
          </div>
        </div>
        <div className="flex flex-col w-full space-y-2">
          {showPolicies &&
            sortByProperty(tableItem?.policies, 'premium').map((pol, i) => (
              <PolicyTableRow
                i={i}
                key={pol.id}
                pol={pol}
                currentUser={currentUser}
              />
            ))}
        </div>
      </div>
      <div className="flex h-auto min-w-[350px]">
        {showPolicies ? (
          <ClientRenewalNote
            clientId={tableItem.client_id}
            val={tableItem.renewal_notes}
            editedBy={tableItem.renewal_notes_last_changed_by}
            editedDate={tableItem.renewal_notes_last_changed}
          />
        ) : (
          <h4 className="p-4">{truncateString(tableItem.renewal_notes, 60)}</h4>
        )}
      </div>
    </div>
  )
}

export default RenewalTableRow
