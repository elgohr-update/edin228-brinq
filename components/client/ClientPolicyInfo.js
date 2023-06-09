import React from 'react'
import PolicyTypeStarred from '../policytype/PolicyTypeStarred'
import SummaryCard from '../ui/card/SummaryCard'
import { BsBox } from 'react-icons/bs';
import { AiFillDollarCircle } from 'react-icons/ai';
import { sumFromArrayOfObjects } from '../../utils/utils';

export default function ClientPolicyInfo({ policies, client }) {
  
  const premSum = () => {
    return sumFromArrayOfObjects(policies, 'premium')
  }

  return (
    <div className="flex flex-col xl:flex-row w-full xl:items-center py-2">
      <div className="flex xl:items-center space-x-5 pl-2 xl:pl-0">
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
      <div className="flex flex-auto justify-end">
        <PolicyTypeStarred
          policies={policies}
          line={client?.line}
        />
      </div>
    </div>
  )
}
