import React from 'react'
import PolicyTypeSettings from '../PolicyTypeSettings/PolicyTypeSettings'
import RenewalTimelines from './RenewalTimelines'

export default function PolicySettings() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex flex-col md:w-3/12">
        <PolicyTypeSettings />
      </div>
      <div className="flex flex-col flex-1">
        <RenewalTimelines />
      </div>
    </div>
  )
}
