import { RiFolderUserFill, RiBuildingFill } from 'react-icons/ri'
import { BsBox } from 'react-icons/bs'
import React from 'react'
import NavLink from './NavLink'
import { useSession } from 'next-auth/react'
import { getIcon } from '../../../utils/utils'

const ReportNavbar = () => {
  const { data: session } = useSession()
  return (
    <div className="flex py-2 space-x-2 md:py-0 lg:pl-4">
      {session?.user.admin && (
        <NavLink
          url={'/reports/newbusiness'}
          slug={'/newbusiness'}
          icon={getIcon('dollarSign')}
          title={'New Business'}
        />
      )}
      <NavLink
        url={'/reports/clients'}
        slug={'/clients'}
        icon={<RiFolderUserFill />}
        title={'Clients'}
      />
      <NavLink
        url={'/reports/policies'}
        slug={'/policies'}
        icon={<BsBox />}
        title={'Policies'}
      />
      <NavLink
        url={'/reports/carriers'}
        slug={'/carriers'}
        icon={<RiBuildingFill />}
        title={'Carriers'}
      />
    </div>
  )
}

export default ReportNavbar
