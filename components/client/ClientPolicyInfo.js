import React from 'react'
import PolicyTypeHeatmap from '../policytype/PolicyTypeStarred'
import SummaryCard from '../ui/card/SummaryCard'
import { BsBox } from 'react-icons/bs';
import { AiFillDollarCircle } from 'react-icons/ai';
import { sumFromArrayOfObjects } from '../../utils/utils';

export default function ClientPolicyInfo({ policies, client, policyTypes }) {
  
  const premSum = () => {
    return sumFromArrayOfObjects(policies, 'premium')
  }

  return (
    <div className="flex flex-col md:flex-row w-full md:items-center py-2">
      <div className="flex md:items-center space-x-4 pl-2 md:pl-0">
        <SummaryCard
          isIcon={false}
          autoWidth
          noPadding
          val={premSum()}
          gradientColor="green-to-blue-2"
          icon={<AiFillDollarCircle />}
          title="Premium"
          money
        />
        <SummaryCard
          isIcon={false}
          autoWidth
          noPadding
          val={policies.length}
          gradientColor="orange-to-red-2"
          title="Policies"
          icon={<BsBox />}
        />
      </div>
      <div className="flex w-full justify-end">
        <PolicyTypeHeatmap
          all={policyTypes}
          policies={policies}
          line={client.line}
        />
      </div>
    </div>
  )
}
