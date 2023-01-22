import React from 'react'
import { Avatar, Link, Tooltip, useTheme } from '@nextui-org/react'
import {
  abbreviateMoney,
  getIcon,
  getFormattedDate,
  truncateString,
} from '../../../utils/utils'
import ClientTableCell from '../../table/ClientTableCell'
import TagBasic from '../../ui/tag/TagBasic'
import { BsBox } from 'react-icons/bs'
import { AiOutlineClockCircle, AiOutlineCloudDownload } from 'react-icons/ai'
import UserAvatar from '../../user/Avatar'
import LineIcon from '../../util/LineIcon'

export default function DashboardPolicyCard({ policy, expiring = false }) {
  const { type } = useTheme()
  const PolicyInfo = () => {
    return (
      <div className="flex flex-col w-full space-y-1 xl:flex-row xl:items-center xl:space-y-0 xl:space-x-2">
        <div className="flex flex-col w-full">
          <div className="pb-2 opacity-60">{policy.description}</div>
          <div className="flex items-center w-full space-x-2">
            <div>
              <Tooltip content={policy.line}>
                <LineIcon iconSize={14} size="xs" line={policy.line} />
              </Tooltip>
            </div>
            <TagBasic
              tooltip
              tooltipContent={policy.policy_type_full}
              text={`${policy.policy_type}`}
            />
            {policy.new_business ? (
              <TagBasic autoWidth color="green" text={`NEW`} />
            ) : null}
            <div className="transition duration-100 text-color-primary hover:text-sky-500">
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-color-primary">
                  <BsBox />
                </div>
                <h6 className="flex w-[150px]">
                  {truncateString(policy.policy_number, 20)}
                </h6>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-end w-full space-x-2">
            <div className="flex items-center flex-auto space-x-1 text-teal-500 ">
              <h6 className="flex items-center">{getIcon('dollarSign')}</h6>
              <h6 className="flex w-[30px] flex-auto xl:justify-end">
                ${abbreviateMoney(policy.premium)}
              </h6>
            </div>
            {expiring ? (
              <h6 className="flex items-center flex-auto space-x-1">
                <div className="flex items-center text-color-error">
                  <AiOutlineClockCircle />
                </div>
                <div className="flex w-[55px] justify-end">
                  {getFormattedDate(policy.expiration_date)}
                </div>
              </h6>
            ) : (
              <>
                <div className="flex items-center flex-auto">
                  <Tooltip content={'Expiration Date'}>
                    <div className="flex items-center flex-auto">
                      <h6 className="flex items-center font-bold text-color-warning">
                        <AiOutlineClockCircle />
                      </h6>
                      <h4 className="flex w-[60px] justify-end">
                        {getFormattedDate(policy.expiration_date)}
                      </h4>
                    </div>
                  </Tooltip>
                </div>
                <div className="flex items-center flex-auto">
                  <Tooltip content={'Added Date'}>
                    <h6 className="flex items-center font-bold text-color-warning">
                      <AiOutlineCloudDownload />
                    </h6>
                    <h4 className="flex w-[60px] justify-end">
                      {policy.added_date
                        ? getFormattedDate(policy.added_date)
                        : null}
                    </h4>
                  </Tooltip>
                </div>
              </>
            )}
            <div className="flex flex-auto justify-end items-center min-w-[60px]">
              <div className="flex pl-6">
                <Avatar.Group>
                  {policy?.users.map((u) => (
                    <UserAvatar
                      key={u.id}
                      size="sm"
                      isLink={false}
                      squared={false}
                      isGrouped
                      isUser
                      passUser={u}
                    />
                  ))}
                </Avatar.Group>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="flex items-center w-full">
      <div className="flex flex-col w-full">
        <ClientTableCell
          type={type}
          clientId={policy.client_id}
          cellValue={truncateString(policy.client_name)}
          subContent={<PolicyInfo />}
        />
      </div>
    </div>
  )
}
