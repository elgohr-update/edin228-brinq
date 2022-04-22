import React from 'react'
import PolicyTypeHeatmap from '../policytype/PolicyTypeHeatmap'

export default function ClientPolicyInfo({policies,client,policyTypes}) {
  return (
    <div className="flex items-center w-full py-2">
      <div className="flex justify-end w-full">
        <PolicyTypeHeatmap all={policyTypes} policies={policies} line={client.line} />
      </div>
    </div>
  )
}
