import { useTheme } from '@nextui-org/react';
import Link from 'next/link';
import React from 'react'
import { MdPermContactCalendar } from 'react-icons/md';

function ContactSearchCard({contact}) {
    const { isDark, type } = useTheme();
  return (
    <div className="flex items-center w-full px-4 py-2">
        <div className="flex items-center ">
            <div className={`flex z-20`}>
                <div className={`flex items-center ${type}-shadow justify-center mr-2 rounded ${isDark?'bg-slate-500/20':'bg-white/40'} p-2 w-[30px] h-[30px]`}>
                    <div className={``}><MdPermContactCalendar /></div>
                </div>
            </div>
            <div className="flex flex-col ">
                <div className="hover:text-sky-500 transition duration-100">
                    <Link href={`/contact/${contact.id}`} >
                        <a>
                            <div>{contact.first_name}</div>
                        </a>
                    </Link>    
                </div>
                <div className="hover:text-sky-500 transition duration-100">
                    <Link href={`/client/${contact.assoc_id}`} >
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