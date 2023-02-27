import React from 'react'
import { useState } from 'react'
import PanelTitle from '../../ui/title/PanelTitle'

export default function RenewalTimelines() {
  const [renewalPaths, setRenewalPaths] = useState(null)
  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full h-full py-2">
        <PanelTitle title={`Policy Renewal Timelines`} color="yellow" />
      </div>
      <div className="flex flex-col w-full">
        <div className="w-full h-full py-2">
          <PanelTitle title={`Commercial Lines`} color="blue" />
        </div>
        <div className="w-full h-full py-2">
          <PanelTitle title={`Personal Lines`} color="red" />
        </div>
        <div className="w-full h-full py-2">
          <PanelTitle title={`Benefits`} color="lime" />
        </div>
      </div>
    </div>
  )
}
