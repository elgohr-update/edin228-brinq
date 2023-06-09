import { useTheme } from '@nextui-org/react'
import Link from 'next/link'
import React from 'react'
import { MdPermContactCalendar } from 'react-icons/md'

function ContactSearchCard({ contact }) {
  const { isDark, type } = useTheme()
  return (
    <div className="flex w-full px-4 py-2 text-sm">
      <div className="flex ">
        <div className={`z-20 flex`}>
          <div
            className={`flex ${type}-shadow mr-2 items-center justify-center rounded ${
              isDark ? 'bg-slate-500/20' : 'bg-white/40'
            } h-[22px] w-[22px]`}
          >
            <div className={`text-xs`}>
              <MdPermContactCalendar />
            </div>
          </div>
        </div>
        <div className="flex flex-col ">
          <div className="transition duration-100 hover:text-sky-500">
            <Link href={`/clients/${contact.assoc_id}`}>
              <a className="flex items-center space-x-1">
                <div>{contact.first_name}</div>
                <div>{contact.last_name}</div>
              </a>
            </Link>
          </div>
          <div className="transition duration-100 hover:text-sky-500">
            <Link href={`/clients/${contact.assoc_id}`}>
              <a>
                <h4>{contact.assoc_name}</h4>
              </a>
            </Link>
          </div>
          <h4>{contact.email}</h4>
        </div>
      </div>
    </div>
  )
}

export default ContactSearchCard
