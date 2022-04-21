import React from 'react'
import PolicyTypeHeatmap from '../policytype/PolicyTypeHeatmap'

export default function ClientPolicyInfo({policies,client,policyTypes}) {
  return (
    <div>
        <PolicyTypeHeatmap all={policyTypes} policies={policies} line={client.line} />
    </div>
  )
}
