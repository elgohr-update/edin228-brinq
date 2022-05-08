import { RiFolderUserFill,RiBuildingFill } from 'react-icons/ri';
import { BsBox } from 'react-icons/bs';
import React from 'react'
import NavLink from './NavLink';


const ReportNavbar = () => {
    return (
        <div className="flex space-x-2 py-2 lg:pl-4 md:py-0">
            <NavLink url={"/reports/newbusiness"} slug={"/newbusiness"} icon={<RiFolderUserFill />} title={"New Business"} />
            <NavLink url={"/reports/clients"} slug={"/clients"} icon={<RiFolderUserFill />} title={"Clients"} />
            <NavLink url={"/reports/policies"} slug={"/policies"} icon={<BsBox />} title={"Policies"} />
            {/* <NavLink url={"/reports/carriers"} slug={"/carriers"} icon={<RiBuildingFill />} title={"Carriers"} /> */}
        </div>
    )
}

export default ReportNavbar