import React from 'react'
import { Link, useTheme } from '@nextui-org/react'
import {
  abbreviateMoney,
  getFormattedDate,
  truncateString,
} from '../../../utils/utils'
import ClientTableCell from '../../table/ClientTableCell'
import TagBasic from '../../ui/tag/TagBasic'
import { BsBox } from 'react-icons/bs'
import { AiOutlineClockCircle, AiOutlineCloudDownload } from 'react-icons/ai'

export default function DashboardPolicyCard({ policy }) {
  const { type } = useTheme()
  const PolicyInfo = () => {
    return (
      <div className="flex flex-col space-y-1 lg:space-y-0 lg:flex-row lg:items-center lg:space-x-2">
        <div className="flex w-full items-center space-x-1">
          <TagBasic text={policy.policy_type} />
          <Link href="/">
            <a className="transition duration-100 hover:text-sky-500">
              <h4 className="flex items-center space-x-1">
                <BsBox />
                <div className="flex w-[65px]">
                  {truncateString(policy.policy_number, 10)}
                </div>
              </h4>
            </a>
          </Link>
        </div>
        <div className="flex w-full items-center space-x-1">
          <h6 className="flex w-[40px] lg:justify-end text-teal-500">
            ${abbreviateMoney(policy.premium)}
          </h6>
          <h4 className="flex items-center space-x-1">
            <AiOutlineClockCircle />
            <div className="flex w-[55px] justify-end">
              {getFormattedDate(policy.expiration_date)}
            </div>
          </h4>
          {policy.added_date ? (
            <h4 className="flex items-center space-x-1">
              <AiOutlineCloudDownload />
              <div className="flex w-[55px] justify-end">
                {getFormattedDate(policy.added_date)}
              </div>
            </h4>
          ) : null}
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
