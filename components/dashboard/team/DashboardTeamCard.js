import { Progress, useTheme } from '@nextui-org/react'
import React from 'react'
import { abbreviateMoney, getPercentage } from '../../../utils/utils'
import UserAvatar from '../../user/Avatar'

export default function DashboardTeamCard({ data = null }) {
  const { type } = useTheme()
  return (
    <div className={`relative flex h-full w-[190px] lg:w-[210px] rounded-lg p-2`}>
      <div className="flex flex-col items-center">
        <UserAvatar size="md" isUser squared={false} passUser={data?.user} />
        <h6 className="flex py-1 justify-end text-teal-500">${abbreviateMoney(data?.prem)}</h6>
      </div>
      <div className="ml-4 flex w-full flex-col">
        <div className="flex w-full flex-col">
          <div className="flex flex-col">
            <div className="flex w-full justify-between">
              <h4>Renewals</h4>
              <h5 className="flex w-full justify-end text-xs">
                {getPercentage(
                  data?.renewal.renewals_completed,
                  data?.renewal.renewals_total
                )}
                %
              </h5>
            </div>
            <Progress
              shadow={true}
              size="sm"
              color="gradient"
              value={getPercentage(
                data?.renewal.renewals_completed,
                data?.renewal.renewals_total
              )}
            />
          </div>
        </div>
        <div className="flex w-full flex-col">
          <div className="flex w-full flex-col">
            <div className="flex w-full justify-between">
              <h4>Tasks</h4>
              <h5 className="flex w-full justify-end text-xs">
                {getPercentage(
                  data?.tasks.tasks_completed,
                  data?.tasks.tasks_total
                )}
                %
              </h5>
            </div>
            <Progress
              shadow={true}
              size="sm"
              color="gradient"
              value={getPercentage(
                data?.tasks.tasks_completed,
                data?.tasks.tasks_total
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
