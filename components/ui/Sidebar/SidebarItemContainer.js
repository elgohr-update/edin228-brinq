import { useSession } from 'next-auth/react'
import React from 'react'
import { Image, useTheme } from '@nextui-org/react'
import { useTheme as useNextTheme } from 'next-themes'
import { AiOutlineHome, AiOutlineCalendar } from 'react-icons/ai'
import { MdOutlineAdminPanelSettings } from 'react-icons/md'
import { BsFillMoonFill, BsFillSunFill, BsBox, BsStars } from 'react-icons/bs'
import { BiBook } from 'react-icons/bi'
import { IoMdListBox } from 'react-icons/io'
import { CgFileDocument, CgToolbox } from 'react-icons/cg'
import SidebarItem from './SidebarItem'
import SidebarDropdown from './SidebarDropdown'
import SearchBar from '../../search/SearchBar'
import SidebarSearchbar from '../../search/SidebarSearchbar'

export default function SidebarItemContainer({ expand, isMobile=false }) {
  const { setTheme } = useNextTheme()
  const { isDark, type } = useTheme()
  const { data: session } = useSession()

  const currentYear = () => {
    const date = new Date()
    return date.getFullYear()
  }
  const currentMonth = () => {
    const date = new Date()
    return date.getMonth() + 1
  }

  const isExpand = () => {
    if (expand) {
      return `open`
    }
    return `closed`
  }

  return (
    <>
      <div className="flex w-full flex-col overflow-hidden h-full">
        <div
          className={`flex h-10 items-center justify-center py-8 ${
            expand ? `panel-theme-${type}` : ``
          }`}
        >
          <div className="relative flex w-full items-center justify-center transition duration-100 ease-out">
            <div
              className={`${
                expand ? 'opacity-1 relative' : 'absolute opacity-0'
              } flex scale-[0.7] transition`}
            >
              <Image
                showSkeleton
                maxDelay={10000}
                width={200}
                height={50}
                src="/brinq-logo-full-color.png"
                alt="Default Image"
              />
            </div>
            <div
              className={`${
                expand ? 'absolute opacity-0' : 'opacity-1 relative'
              } flex scale-[0.5] transition`}
            >
              <Image
                showSkeleton
                maxDelay={10000}
                width={50}
                height={50}
                src="/brinq-logo-q-color.png"
                alt="Default Image"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col h-full overflow-hidden">
          <div className={`flex flex-col h-full space-y-2  overflow-x-hidden px-2 py-4`}>
            <div className={`border-b ${isDark ? 'border-white/40': 'border-black/40'} pb-6`}>
              <SidebarSearchbar expand={expand} />
            </div>
            <SidebarItem
              href={'/dashboard'}
              isOpen={isExpand()}
              icon={<AiOutlineHome />}
              label={'Home'}
              isMobile={isMobile}
            />
            {/* <SidebarItem
                href={'/crm'}
                isOpen={isExpand()}
                icon={
                    <div className="icon-rotate">
                    <AiOutlineAlignLeft />
                    </div>
                }
                label={'CRM'}
                /> */}
            <SidebarItem
              href={`/renewals/${currentMonth()}/${currentYear()}`}
              isOpen={isExpand()}
              icon={<AiOutlineCalendar />}
              label={'Renewals'}
              basePath="/renewals"
              isMobile={isMobile}
            />
            <SidebarDropdown
              icon={<BiBook />}
              label={'Book of Business'}
              basePath="/reports"
              isOpen={isExpand()}
              isExpand={expand}
              isMobile={isMobile}
            >
              <SidebarItem
                href={`/reports/clients`}
                isOpen={isExpand()}
                icon={<IoMdListBox />}
                label={'Clients'}
                basePath="/clients"
                isMobile={isMobile}
                mainMenuItem={false}
              />
              <SidebarItem
                href={`/reports/policies`}
                isOpen={isExpand()}
                icon={<BsBox />}
                label={'Policies'}
                basePath="/policies"
                isMobile={isMobile}
                mainMenuItem={false}
              />
              <SidebarItem
                href={`/reports/newbusiness`}
                isOpen={isExpand()}
                icon={<BsStars />}
                label={'New Business'}
                basePath="/newbusiness"
                isMobile={isMobile}
                mainMenuItem={false}
              />
            </SidebarDropdown>
            <SidebarDropdown
              icon={<CgToolbox />}
              label={'Tools'}
              basePath="/tools"
              isOpen={isExpand()}
              isExpand={expand}
              isMobile={isMobile}
            >
              <SidebarItem
                href={'/tools/proposals'}
                isOpen={isExpand()}
                icon={<CgFileDocument />}
                label={'Proposals'}
                isMobile={isMobile}
                mainMenuItem={false}
              />
              <SidebarItem
                href={'/tools/costcomparison'}
                isOpen={isExpand()}
                icon={<CgToolbox />}
                label={'Cost Comparison'}
                isMobile={isMobile}
                mainMenuItem={false}
              />
            </SidebarDropdown>
            {session?.user?.admin ? (
              <div>
                <div className={`mt-6 mb-4 border-t ${isDark ? 'border-white/40': 'border-black/40'}`} />
                <SidebarItem
                  href={'/admin'}
                  isOpen={isExpand()}
                  icon={<MdOutlineAdminPanelSettings />}
                  label={'Admin'}
                  isMobile={isMobile}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div
        className={`flex items-center p-4 transition duration-100 ease-out ${
          expand ? 'opacity-1' : 'opacity-0'
        }`}
      >
        <div className="flex flex-col w-full py-1">
          <div className={`flex text-xs rounded-lg w-full items-center py-1 px-1 panel-theme-${type}`}>
            <div onClick={() => setTheme('light')} className={`flex cursor-pointer rounded-lg items-center justify-center py-1 space-x-1 w-full ${!isDark ? `panel-flat-${type} ${type}-shadow` : ``}`}>
                <div><BsFillSunFill /></div>
                <div>Light</div>
            </div>
            <div onClick={() => setTheme('dark')} className={`flex cursor-pointer rounded-lg items-center justify-center py-1 space-x-1 w-full ${isDark ? `panel-flat-${type} ${type}-shadow` : ``}`}>
                <div><BsFillMoonFill /></div>
                <div>Dark</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}