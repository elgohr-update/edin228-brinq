import { useTheme } from '@nextui-org/react'
import Link from 'next/link'
import React from 'react'
import { RiFolderUserFill } from 'react-icons/ri'
import { truncateString } from '../../../utils/utils'

function ClientSearchCard({ client }) {
  const { isDark, type } = useTheme()
  return (
    <div className="flex w-full items-center px-4 py-2">
      <Link href={`/clients/${client.id}`}>
        <a>
          <div className="flex text-sm items-center transition duration-100 hover:text-sky-500">
            <div className={`z-20 flex`}>
              <div
                className={`flex items-center ${type}-shadow mr-2 justify-center rounded ${
                  isDark ? 'bg-slate-500/20' : 'bg-white/40'
                } h-[22px] w-[22px] p-2`}
              >
                <div className={`text-xs`}>
                  <RiFolderUserFill />
                </div>
              </div>
            </div>
            <div>{truncateString(client.client_name, 40)}</div>
          </div>
        </a>
      </Link>
    </div>
  )
}

export default ClientSearchCard
