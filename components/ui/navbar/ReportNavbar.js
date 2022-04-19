import { RiFolderUserFill,RiBuildingFill } from 'react-icons/ri';
import { BsBox } from 'react-icons/bs';
import React from 'react'
import NavLink from './NavLink';


const ReportNavbar = () => {
    return (
        <div className="flex justify-center md:justify-end space-x-2 py-2 md:py-0">
            <NavLink url={"/reports/clients"} slug={"/clients"} icon={<RiFolderUserFill />} title={"Clients"} />
            <NavLink url={"/reports/policies"} slug={"/policies"} icon={<BsBox />} title={"Policies"} />
            <NavLink url={"/reports/carriers"} slug={"/carriers"} icon={<RiBuildingFill />} title={"Carriers"} />
        </div>
    )
}

export default ReportNavbar