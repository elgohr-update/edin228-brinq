import { BsTable } from 'react-icons/bs';
import React from 'react'
import { CgFileDocument } from 'react-icons/cg';
import NavLink from './NavLink';


const ProposalNavbar = () => {
    return (
        <div className="flex justify-center md:justify-end items-center space-x-2 py-2 md:py-0">
            <NavLink url={"/tools/costcomparison"} slug={"/costcomparison"} icon={<BsTable />} title={"Cost Comparison"} />
            <NavLink url={"/tools/proposals"} slug={"/proposals"} icon={<CgFileDocument />} title={"Proposals"} />
        </div>
    )
}
export default ProposalNavbar