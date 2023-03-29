import { Tooltip, useTheme } from '@nextui-org/react'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import {
  formatMoney,
  getIcon,
  sortByProperty,
  sumFromArray,
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

  const allRenewed =
    tableItem?.policies.filter((x) => x.renewed == true).length /
      tableItem?.policies.length ==
    1

  const tasksCompleted = () => {
    const completed = sumFromArray(
      tableItem.policies.map(
        (pol) => pol.tasks.filter((x) => x.done && x.active).length
      )
    )
    const total = sumFromArray(
      tableItem.policies.map((pol) => pol.tasks.filter((x) => x.active).length)
    )
    return { completed, total }
  }

  console.log(tasksCompleted())
  useEffect(() => {
    setShowPolicies(expandAllRows)
    return () => {}
  }, [expandAllRows])

  return (
    <div className="flex w-full min-w-[960px] border-b-[1px] border-zinc-800 pl-4">
      <div className="w-full py-2">
        <div className="flex items-center w-full">
          <div className="flex items-center w-full">
            {/* <div className="flex items-center justify-center mr-4">
              {allRenewed ? (
                <div className="flex items-center justify-center text-emerald-500">
                  {getIcon('circleCheck')}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  {getIcon('circle')}
                </div>
              )}
            </div> */}
            <div
              className="flex items-center pr-4 transition duration-100 cursor-pointer hover:text-sky-500"
              onClick={() => setShowPolicies(!showPolicies)}
            >
              <div className="flex items-center pr-1">
                {showPolicies ? getIcon('up') : getIcon('right')}
              </div>
              {allRenewed ? (
                <div className="flex items-center justify-center text-emerald-500">
                  {getIcon('circleCheck')}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  {getIcon('list')}
                </div>
              )}
            </div>
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
                tasksTotal={
                  <>
                    <div className="flex justify-center text-xs">
                      <div className="flex min-w-[50px] justify-end font-bold">
                        <span
                          className={`mr-1 ${
                            tasksCompleted().completed == 0
                              ? 'text-red-500'
                              : tasksCompleted().completed ==
                                tasksCompleted().total
                              ? 'text-emerald-500'
                              : 'text-sky-500'
                          }`}
                        >
                          {tasksCompleted().completed}
                        </span>{' '}
                        /
                        <span
                          className={`ml-1 ${
                            tasksCompleted().completed == tasksCompleted().total
                              ? 'text-emerald-500'
                              : ''
                          }`}
                        >
                          {tasksCompleted().total}
                        </span>
                      </div>
                    </div>
                  </>
                }
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
                            tableItem.isRenewedCount == 0
                              ? 'text-red-500'
                              : allRenewed
                              ? 'text-emerald-500'
                              : 'text-sky-500'
                          }`}
                        >
                          {tableItem.isRenewedCount}
                        </span>{' '}
                        /
                        <span
                          className={`mx-1 ${
                            allRenewed ? 'text-emerald-500' : ''
                          }`}
                        >
                          {tableItem.policy_count}
                        </span>
                      </div>
                    </div>
                  </>
                }
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full py-2 space-y-2">
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
