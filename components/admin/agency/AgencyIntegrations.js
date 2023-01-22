import React from 'react'
import PanelTitle from '../../ui/title/PanelTitle'
import { motion } from 'framer-motion'
import { Image, useTheme } from '@nextui-org/react'
import { getIcon } from '../../../utils/utils'

const IntegrationCard = ({ data }) => {
  const { isDark, type } = useTheme()
  return (
    <div
      className={`flex w-full flex-col rounded-lg xl:w-[200px] panel-theme-${type} ${type}-shadow p-2`}
    >
      <div className="flex w-full">
        <div
          className={`flex shrink-0 items-center justify-center overflow-hidden border-2 ${
            !isDark ? `border-black` : `border-white`
          } rounded-full panel-theme-${type} ${type}-shadow h-[40px] w-[40px]`}
        >
          {data.icon ? (
            <Image
              showSkeleton
              maxDelay={10000}
              width={50}
              height={50}
              src={data.icon}
              alt="Default Image"
            />
          ) : (
            getIcon('imagePlus')
          )}
        </div>
        <div className="flex flex-col w-full ml-4">
          <div className="flex items-center text-xs font-bold">
            {data.name}
          </div>
          <div className="flex items-center mt-2">
            <div
              className={`flex shrink-0 items-center justify-center ${
                data.active
                  ? `green-gradient-1 ${isDark ? 'border-white' : 'border-black'}`
                  : `blood-orange-gradient-1 ${isDark ? 'border-white' : 'border-black'}`
              } rounded-full ${type}-shadow h-[14px] w-[14px]`}
            ></div>
            <div className="ml-2 text-xs tracking-widest uppercase ">
              {data.active ? 'ON' : 'OFF'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AgencyIntegrations({ data = null }) {
  return (
    <div className="flex flex-col w-full">
      <PanelTitle title="Integrations" color="orange" />
      <div className="flex flex-col">
        {data?.integrationAms360?.map((u) => (
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
            <IntegrationCard data={u} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default AgencyIntegrations
