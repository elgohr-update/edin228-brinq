import React from 'react'
import PanelTitle from '../../ui/title/PanelTitle'

export default function DashboardTeam() {
  return (
    <div className="flex w-full flex-col">
      <div className="pl-4">
        <PanelTitle title={`Team`} color="orange" />
      </div>
      <div className="flex w-full rounded-lg relative">
        <div className="flex p-2 w-full overflow-x-auto space-x-1 lg:space-x-0 lg:overflow-x-hidden lg:flex-wrap lg:gap-2 lg:max-h-[54vh] lg:overflow-y-auto">
          {Array.from(Array(20).keys()).map((y,i) => (
            <div key={y} className="flex h-[80px] w-full p-2 rounded-lg bg-gray-500/20">
              <div>{i}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
