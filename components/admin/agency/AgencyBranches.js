import React from 'react'
import PanelTitle from '../../ui/title/PanelTitle'
import { motion } from 'framer-motion'
import { useTheme } from '@nextui-org/react'
import { getIcon } from '../../../utils/utils'

const BranchCard = ({ data }) => {
  const { type } = useTheme()
  return (
    <div
      className={`flex w-full flex-col rounded-lg lg:w-[200px] panel-theme-${type} ${type}-shadow p-2`}
    >
      <div className="flex items-center">
        <div className="mr-2 opacity-60">{getIcon('hash')}</div>
        <div className="text-sm font-bold">{data.name}</div>
      </div>
    </div>
  )
}

function AgencyBranches({ data = null }) {
  return (
    <div className="flex flex-col w-full">
      <PanelTitle title="Branches" color="yellow" />
      <div className="flex flex-col w-full space-y-2 lg:flex-row lg:flex-wrap lg:gap-2 lg:space-y-0">
        {data?.branches?.filter(x => x.IsInactive == 'False').filter(x => x.GLBranchCode.length > 0).map((u) => (
          <motion.div
            key={u.uid}
            initial="hidden"
            animate="visible"
            variants={{
              visible: { opacity: 1 },
              hidden: { opacity: 0 },
            }}
            transition={{ ease: 'easeOut', duration: 1 }}
          >
            <BranchCard data={u} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default AgencyBranches
