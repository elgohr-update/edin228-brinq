import React from 'react'
import PolicyTypeSettings from '../PolicyTypeSettings/PolicyTypeSettings'
import RenewalTimelines from './RenewalTimelines'

export default function PolicySettings() {
  return (
    <div className="flex flex-col p-4 xl:flex-row">
      {/* <div className="flex flex-col xl:w-3/12">
        <PolicyTypeSettings />
      </div> */}
      <div className="flex flex-col flex-auto">
        <RenewalTimelines />
      </div>
    </div>
  )
}
