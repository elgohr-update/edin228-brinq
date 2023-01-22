import React, { useState } from 'react'
import { useTheme, Avatar } from '@nextui-org/react'
import { AiOutlineLeft, AiOutlineDown } from 'react-icons/ai'
import { BsListTask } from 'react-icons/bs'
import LineIcon from '../util/LineIcon'
import {
  formatMoney,
  getFormattedDate,
  truncateString,
} from '../../utils/utils'
import TagBasic from '../ui/tag/TagBasic'
import TaskCard from './../task/TaskCard'
import UserAvatar from '../user/Avatar'
import { motion } from 'framer-motion'

const PolicyCard = ({
  policy,
  border = false,
  truncate = 20,
  vertical = false,
  shadow = false,
}) => {
  const { isDark, type } = useTheme()
  const [showMore, setShowMore] = useState(false)
  const [modifyStyle, setModifyStyle] = useState({
    p: false,
    s: false,
    b: false,
  })

  const toggleShowMore = () => {
    setShowMore(!showMore)
    if (!showMore) {
      setModifyStyle({ p: true, s: true, b: false })
    } else {
      setModifyStyle({ p: false, s: false, b: false })
    }
  }

  const isVertical = () => {
    return vertical ? `flex-col space-y-2` : `flex-row items-center`
  }
  const isPanel = () => {
    return modifyStyle.p ? `panel-flatter-${type}` : ``
  }
  const isShadow = () => {
    return modifyStyle.s ? `${type}-shadow` : ``
  }
  const isBorder = () => {
    return modifyStyle.b
      ? `${isDark ? `border-slate-200` : `border-slate-200`} border`
      : ``
  }

  const baseClass = `flex shrink-0 items-center  relative text-xs transition-all ${
    border ? `${isDark ? `border-slate-900` : `border-slate-200`} border` : null
  } ${
    shadow ? `${type}-shadow` : null
  } duration-200 ease-out flex-col w-full p-2 rounded-lg ${isBorder()} ${isVertical()} ${isPanel()} ${isShadow()}`
  return (
    <div className={baseClass}>
      <div
        className={`flex w-full flex-auto flex-col md:flex-row md:items-center`}
      >
        <div className="flex w-full items-center md:w-fit md:min-w-[240px]">
          <div className="mr-4">
            <LineIcon iconSize={18} size="sm" line={policy.line} />
          </div>
          <div
            className={`relative mr-4 flex flex-col items-end space-x-1 space-y-1 md:space-x-0`}
          >
            <TagBasic text={policy.policy_type} />
            {policy.nonrenewed ? (
              <TagBasic text={`NRNWD`} color="red" />
            ) : policy.nottaken ? (
              <TagBasic text={`NTTKN`} color="red" />
            ) : policy.rewritten ? (
              <TagBasic text={`RWRTN`} color="purple" />
            ) : policy.canceled ? (
              <TagBasic text={`CNCLD`} color="red" />
            ) : policy.ams360quote ? (
              <TagBasic text={`QTE`} color="orange" />
            ) : policy.renewed ? (
              <TagBasic text={`RNWD`} color="blue" />
            ) : policy.expired ? (
              <TagBasic text={`EXPRD`} color="red" />
            ) : (
              <TagBasic text={`ACTV`} color="green" />
            )}
          </div>
          <div
            className={`relative flex w-full flex-col flex-wrap md:mr-2 md:w-[250px]`}
          >
            <h6 className={`flex w-full font-semibold`}>
              {truncateString(String(policy.policy_number), 16)}
            </h6>
            <h4 className={`flex w-full flex-wrap font-semibold`}>
              {truncateString(policy.policy_type_full, truncate)}
            </h4>
            <h4 className={`flex w-full flex-wrap`}>{policy.description}</h4>
          </div>
          <div
            onClick={() => toggleShowMore()}
            className={`relative ml-4 flex h-full cursor-pointer items-center justify-end px-1 transition duration-100 ease-out hover:text-sky-500 md:hidden`}
          >
            <BsListTask />
            {showMore ? <AiOutlineDown /> : <AiOutlineLeft />}
          </div>
        </div>
        <div className={`relative flex w-full flex-col py-2 md:hidden`}>
          <h6 className={`font-semibold`}>
            {truncateString(policy.carrier, truncate)}
          </h6>
          <h4>{truncateString(policy.writing, truncate)}</h4>
        </div>
        <div className="flex items-center w-full md:pt-0">
          <div className={`relative hidden w-full flex-col md:flex`}>
            <h6 className={`font-semibold`}>
              {truncateString(policy.carrier, truncate)}
            </h6>
            <h4 className={``}>{truncateString(policy.writing, truncate)}</h4>
          </div>
          <div className="flex flex-col w-full">
            <div className={`relative flex w-full lg:justify-end lg:items-end`}>
              <h4 className={`letter-spacing-1`}>
                {getFormattedDate(policy.effective_date)}
              </h4>
              <div className="mx-2">-</div>
              <h6 className={`letter-spacing-1`}>
                {getFormattedDate(policy.expiration_date)}
              </h6>
            </div>
            <div className={`relative flex w-full lg:justify-end`}>
              <h6 className={`font-bold text-teal-500`}>
                $ {formatMoney(policy.premium)}
              </h6>
            </div>
          </div>

          <div className="flex items-center w-full">
            <div className={`relative flex w-full justify-end`}>
              <Avatar.Group
                count={policy.users.length > 3 ? client.users.length : null}
              >
                {policy.users
                  .filter((x) => !x.producer)
                  .map((u) => (
                    <UserAvatar
                      tooltip={true}
                      tooltipPlacement="topEnd"
                      isUser={true}
                      passUser={u}
                      key={u.id}
                      isGrouped={true}
                      squared={false}
                      size={`sm`}
                    />
                  ))}
              </Avatar.Group>
            </div>
            <div
              onClick={() => toggleShowMore()}
              className={`relative ml-4 hidden h-full cursor-pointer items-center justify-end px-1 transition duration-100 ease-out hover:text-sky-500 md:flex`}
            >
              <BsListTask />
              {showMore ? <AiOutlineDown /> : <AiOutlineLeft />}
            </div>
          </div>
        </div>
      </div>
      {showMore ? (
        <div className="flex flex-auto w-full pt-2">
          <div className={`top2-border-flair pink-to-blue-gradient-1`} />
          <div className={`flex w-full flex-col py-2`}>
            <div className="flex flex-col space-y-1">
              {policy.tasks.map((t, i) => {
                return (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          delay: i * 0.05,
                        },
                      },
                      hidden: { opacity: 0, y: -10 },
                    }}
                    transition={{ ease: 'easeInOut', duration: 2 }}
                    className="flex flex-col space-y-1"
                    key={t.id}
                  >
                    <TaskCard task={t} />
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default PolicyCard
