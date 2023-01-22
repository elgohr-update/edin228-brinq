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

export default function DashboardExpiringCard({ policy }) {
  const { type } = useTheme()
  const PolicyInfo = () => {
    return (
      <div className="flex flex-col w-full space-y-1 xl:flex-row xl:items-center xl:space-y-0 xl:space-x-2">
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
          <div className="transition duration-100 text-color-primary hover:text-sky-500">
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-color-primary">
                <BsBox />
              </div>
              <h6 className="flex w-[120px]">
                {truncateString(policy.policy_number, 15)}
              </h6>
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
            <h6 className="flex items-center flex-auto space-x-1">
              <div className="flex items-center text-color-error">
                <AiOutlineClockCircle />
              </div>
              <div className="flex w-[55px] justify-end">
                {getFormattedDate(policy.expiration_date)}
              </div>
            </h6>
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
