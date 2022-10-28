import React from 'react'
import { Avatar, Link, useTheme } from '@nextui-org/react'
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

export default function DashboardExpiringCard({ policy }) {
  const { type } = useTheme()
  const PolicyInfo = () => {
    return (
      <div className="flex w-full flex-col space-y-1 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-2">
        <div className="flex w-full items-center space-x-2">
          <div className="flex pl-2">
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
          <TagBasic text={policy.policy_type} />
          <div className="text-color-primary transition duration-100 hover:text-sky-500">
            <div className="flex items-center space-x-2">
              <div className="text-color-primary flex items-center">
                <BsBox />
              </div>
              <h6 className="flex w-[65px]">
                {truncateString(policy.policy_number, 9)}
              </h6>
            </div>
          </div>
        </div>
        <div>
          <div className="flex w-full items-center justify-end space-x-2">
            <div className="flex flex-auto items-center space-x-1 text-teal-500 ">
              <h6 className="flex items-center">
                {getIcon('dollarSign')}
              </h6>
              <h6 className="flex flex-auto lg:justify-end">
                ${abbreviateMoney(policy.premium)}
              </h6>
            </div>
            <h6 className="flex flex-auto items-center space-x-1">
              <div className="text-color-error flex items-center">
                <AiOutlineClockCircle />
              </div>
              <div className="flex w-[55px] justify-end">
                {getFormattedDate(policy.expiration_date)}
              </div>
            </h6>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="flex w-full items-center">
      <div className="flex w-full flex-col">
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