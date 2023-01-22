import { Input, User } from '@nextui-org/react'
import React, { useState } from 'react'
import { useAgencyContext } from '../../../../context/state'
import UserAvatar from '../../../user/Avatar'

export default function UserSalesItem({ user }) {
  const { agency, setAgency } = useAgencyContext()
  const [monthly, setMonthly] = useState(user?.monthly_rev_goal)

  const updateGoal = (e) => {
    const users = [...agency.users]
    const u = users.find((x) => x.id == user.id)
    u.monthly_rev_goal = isNaN(parseFloat(e)) ? 0 : parseFloat(e)
    setMonthly(isNaN(parseFloat(e)) ? 0 : parseFloat(e))
    setAgency({ ...agency, users: users })
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="min-w-[200px]">
        <User src={user.image_file} name={user.name} description={user.email} />
      </div>
      <div className="flex flex-auto flex-col space-x-4 xl:flex-row">
        <div>
          <Input
            type="number"
            labelLeft="$"
            label="Monthly Sales Goal"
            underlined
            clearable
            value={monthly}
            onChange={(e) => updateGoal(e.target.value)}
          />
        </div>
        <div>
          <Input
            type="number"
            labelLeft="$"
            label="Annual Sales Goal"
            disabled
            underlined
            value={12 * monthly}
          />
        </div>
      </div>
    </div>
  )
}
