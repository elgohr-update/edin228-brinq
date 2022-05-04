import { Image, Switch, useTheme } from '@nextui-org/react'
import React, { useState } from 'react'
import { AiOutlineHome, AiOutlineCalendar } from 'react-icons/ai'
import { MdOutlineAdminPanelSettings } from 'react-icons/md'
import { BsFillMoonFill, BsFillSunFill, BsBox, BsStars } from 'react-icons/bs'
import { BiBook } from 'react-icons/bi'
import { IoMdListBox } from 'react-icons/io'
import { CgFileDocument, CgToolbox } from 'react-icons/cg'
import { useTheme as useNextTheme } from 'next-themes'
import { useSession } from 'next-auth/react'
import SidebarItem from './SidebarItem'
import SidebarDropdown from './SidebarDropdown'

const Sidebar = () => {
  const [expand, setExpand] = useState(false)
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
  const hoverSidebar = (status) => {
    const res = status === 'in' ? true : false
    setExpand(res)
  }

  return (
    <div className="relative z-50 flex h-full w-full flex-col">
      <div
        className={`absolute flex h-full w-full flex-col justify-between ${
          expand ? `panel-theme-${type} ${type}-shadow` : ``
        } sidebar-${isExpand()}`}
        onMouseOver={() => hoverSidebar('in')}
        onMouseOut={() => hoverSidebar('out')}
      >
        <div className="flex w-full flex-col">
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
                } flex scale-[0.7] transition`}
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
          <div className={`flex flex-col px-2 py-2`}>
            <SidebarItem
              href={'/dashboard'}
              isOpen={isExpand()}
              icon={<AiOutlineHome />}
              label={'Home'}
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
            />
            <SidebarDropdown
              icon={<BiBook />}
              label={'Book of Business'}
              basePath="/reports"
              isOpen={isExpand()}
              isExpand={expand}
            >
              <SidebarItem
                href={`/reports/clients`}
                isOpen={isExpand()}
                icon={<IoMdListBox />}
                label={'Clients'}
                basePath="/clients"
              />
              <SidebarItem
                href={`/reports/policies`}
                isOpen={isExpand()}
                icon={<BsBox />}
                label={'Policies'}
                basePath="/policies"
              />
              <SidebarItem
                href={`/reports/newbusiness`}
                isOpen={isExpand()}
                icon={<BsStars />}
                label={'New Business'}
                basePath="/newbusiness"
              />
            </SidebarDropdown>
            <SidebarDropdown
              icon={<CgToolbox />}
              label={'Tools'}
              basePath="/tools"
              isOpen={isExpand()}
              isExpand={expand}
            >
              <SidebarItem
                href={'/tools/proposals'}
                isOpen={isExpand()}
                icon={<CgFileDocument />}
                label={'Proposals'}
              />
              <SidebarItem
                href={'/tools/costcomparison'}
                isOpen={isExpand()}
                icon={<CgToolbox />}
                label={'Cost Comparison'}
              />
            </SidebarDropdown>
            {session?.user?.admin ? (
              <div>
                <div className="mt-6 mb-4 border-t opacity-30" />
                <SidebarItem
                  href={'/admin'}
                  isOpen={isExpand()}
                  icon={<MdOutlineAdminPanelSettings />}
                  label={'Admin'}
                />
              </div>
            ) : null}
          </div>
        </div>
        <div
          className={`flex items-center p-4 transition duration-100 ease-out ${
            expand ? 'opacity-1' : 'opacity-0'
          }`}
        >
          <div className="flex flex-col">
            <h4>Theme</h4>
            <Switch
              size="xs"
              checked={isDark}
              color="primary"
              onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
              iconOn={<BsFillMoonFill />}
              iconOff={<BsFillSunFill />}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
