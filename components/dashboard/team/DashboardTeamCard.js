import { Progress, useTheme } from '@nextui-org/react'
import React from 'react'
import { abbreviateMoney, getPercentage } from '../../../utils/utils'
import UserAvatar from '../../user/Avatar'

export default function DashboardTeamCard({ data = null }) {
  const { type } = useTheme()
  return (
    <div className={`relative flex flex-auto shrink-0 w-[190px] xl:w-[160px] rounded-lg p-2`}>
      <div className="flex flex-col items-center">
        <UserAvatar tooltip size="lg" isUser squared={true} passUser={data?.user} />
        <h6 className="flex pt-2 text-teal-500 justfy-end">${abbreviateMoney(data?.prem)}</h6>
      </div>
      <div className="flex flex-col w-full ml-4">
        <div className="flex flex-col w-full">
          <div className="flex flex-col">
            <div className="flex justify-between w-full">
              <h4>Renewals</h4>
              <h5 className="flex justify-end w-full text-xs">
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
        <div className="flex flex-col w-full">
          <div className="flex flex-col w-full">
            <div className="flex justify-between w-full">
              <h4>Tasks</h4>
              <h5 className="flex justify-end w-full text-xs">
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
