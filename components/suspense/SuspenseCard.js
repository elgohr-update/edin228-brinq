import React from 'react'
import {
  Avatar,
  Button,
  Checkbox,
  Modal,
  Textarea,
  useTheme,
} from '@nextui-org/react'
import { BsBox } from 'react-icons/bs'
import UserAvatar from '../user/Avatar'
import {
  getFormattedDate,
  getFormattedDateTime,
  getIcon,
  truncateString,
  useNextApi,
} from '../../utils/utils'
import Link from 'next/link'
import TagBasic from '../ui/tag/TagBasic'
import { useState } from 'react'
import BrinqInput from '../ui/input/BrinqInput'
import { useReloadContext } from '../../context/state'

function SuspenseCard({
  data = null,
  border = false,
  panel = false,
  shadow = false,
  hideClient = false,
  hidePolicy = false,
  hideAssigned = true,
  indexLast = null,
}) {
  const { isDark, type } = useTheme()
  const [showModal, setShowModal] = useState(false)
  const [editSuspense, setEditSuspense] = useState({ ...data })

  const [editDescription, setEditDescription] = useState(false)
  const [editDate, setEditDate] = useState(false)
  const [editActivityType, setEditActivityType] = useState(false)
  const [changeMade, setChangeMade] = useState(false)

  const { reload, setReload } = useReloadContext()

  const isPanel = () => {
    return panel ? `panel-flat-${type}` : ``
  }
  const isShadow = () => {
    return shadow ? `${type}-shadow` : ``
  }
  const isBorder = () => {
    return border
      ? `${isDark ? `border-slate-900` : `border-slate-200`} border`
      : ``
  }
  const isLate = (due) => {
    const today = new Date()
    const date = new Date(due)
    return today > date ? `text-color-error` : ``
  }

  const cancelEditDescription = () => {
    setEditSuspense({
      ...editSuspense,
      description: data.description,
    })
    setEditDescription(false)
  }

  const changeSuspense = (e, field) => {
    setChangeMade(true)
    const newSuspense = { ...editSuspense }
    newSuspense[field] = e
    setEditSuspense({
      ...newSuspense,
    })
  }

  const closeModal = () => {
    setShowModal(false)
    setEditSuspense({ ...data })
    setEditDescription(false)
    setEditDate(false)
    setEditActivityType(false)
    setChangeMade(false)
  }

  const submit = async () => {
    const bundle = JSON.stringify({ ...editSuspense })
    const res = await useNextApi('PUT', `/api/suspense/${data.uid}`, bundle)
    if (res) {
      closeModal()
      setReload({
        ...reload,
        suspense: true,
      })
    }
  }

  const baseClass = `flex activity-card overflow-x-hidden overflow-y-hidden relative flex-col w-full py-1 mb-1 px-2 rounded-lg ${isBorder()} ${isPanel()} ${isShadow()} cursor-pointer ${
    isDark ? 'hover:bg-zinc-400/10' : 'hover:bg-zinc-400/20'
  } transition duration-100`

  return (
    <>
      <div className={baseClass}>
        <div className="flex w-full">
          <div className="z-90 relative mr-4 flex">
            {data?.system_action && data?.users.length < 1 ? (
              <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-slate-900">
                <Image
                  showSkeleton
                  maxDelay={10000}
                  width={20}
                  height={20}
                  src="/brinq-logo-q-color.png"
                  alt="Default Image"
                />
              </div>
            ) : (
              <UserAvatar
                squared={false}
                tooltip={false}
                size="sm"
                isUser={true}
                passUser={data?.users.find((x) => x.id === data?.author_id)}
              />
            )}
            {!indexLast ? (
              <div
                className={`absolute border-l-[2px] border-t-0 border-b-0 border-r-0 ${
                  isDark ? 'border-zinc-200' : 'border-zinc-500'
                } userBadge-timeline top-[35px] left-[48%] w-full border-[1px] opacity-10`}
              ></div>
            ) : null}
          </div>
          <div className="w-full">
            <div className="flex w-full items-center justify-between">
              {hideClient ? null : (
                <div className={`flex w-full flex-col`}>
                  <div className="page-link flex items-center space-x-2">
                    <div className="data-point-xs purple-to-green-gradient-1"></div>
                    <Link href={`/clients/${data?.client.id}`}>
                      <a>
                        <h6>{truncateString(data?.client.client_name, 50)}</h6>
                      </a>
                    </Link>
                  </div>
                </div>
              )}
              <div
                className={`flex w-full items-center ${
                  !hideClient ? 'justify-end' : ''
                } space-x-2`}
              >
                <div className="flex flex-col">
                  <h6 className={`${!hideClient ? 'text-right' : ''}`}>
                    {data.activity_type}
                  </h6>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`flex w-full items-center  ${
                        !hideClient ? 'justify-end' : ''
                      } space-x-2`}
                    >
                      <div className="data-point-xs pink-to-blue-gradient-1"></div>
                      <div className="flex items-center space-x-2">
                        <h4>Due</h4>
                        <h6
                          className={`font-bold ${
                            !data?.completed && isLate(data?.date)
                          } ${
                            data?.completed ? 'line-through opacity-50' : ''
                          } flex items-center`}
                        >
                          {getFormattedDate(data?.date)}
                        </h6>
                      </div>
                    </div>
                    {data.completed ? (
                      <div className="flex w-full items-center justify-end space-x-2">
                        <div className="data-point-xs green-gradient-1"></div>
                        <div className="flex items-center space-x-2">
                          <h4>Completed</h4>
                          <h6
                            className={`flex items-center font-bold text-emerald-500`}
                          >
                            {getFormattedDate(data?.completed_date)}
                          </h6>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div
              className="relative block py-1"
              onClick={() => setShowModal(true)}
            >
              <h6 className="block whitespace-pre-line">{data?.description}</h6>
            </div>
            <div className="flex w-full items-center space-x-2">
              {hidePolicy ||
              data?.system_action ||
              data?.policies.length == 0 ? null : data?.policies.length == 1 ? (
                <div className="flex items-center space-x-2">
                  <TagBasic
                    tooltip
                    tooltipContent={data?.policies[0].policy_type_full}
                    text={data?.policies[0].policy_type}
                  />
                  <Link href="/">
                    <a className="transition duration-100 hover:text-sky-500">
                      <h4 className="flex items-center space-x-2">
                        <BsBox />
                        <div>{data?.policies[0].policy_number}</div>
                      </h4>
                    </a>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  {data?.policies.map((pol) => (
                    <div key={pol.id} className="flex items-center space-x-2">
                      <TagBasic
                        tooltip
                        tooltipContent={pol.policy_number}
                        text={`${pol.policy_type}`}
                      />
                    </div>
                  ))}
                </div>
              )}
              {/* <div className="flex items-center space-x-2">
                <h4>Author:</h4>
                <div>
                  <UserAvatar
                    squared={false}
                    tooltip={false}
                    size="sm"
                    isUser={true}
                    passUser={data?.users.find((x) => x.id === data?.author_id)}
                  />
                </div>
              </div> */}
              {!hideAssigned ? (
                <div className="flex items-center space-x-2">
                  <h4 className="mr-2">Assigned:</h4>
                  {data?.users.length >= 1 ? (
                    <div>
                      <Avatar.Group
                        count={
                          data?.users.length >= 3 ? data?.users.length : null
                        }
                      >
                        {data?.users.map((u) => (
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
                  ) : (
                    <h4>None</h4>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <Modal
        closeButton
        noPadding
        scroll
        width={'600px'}
        className={'flex w-full items-center justify-center'}
        aria-labelledby="modal-title"
        open={showModal}
        onClose={() => closeModal()}
      >
        <Modal.Body className="flex w-full flex-col px-4">
          <div className="flex h-full w-full flex-col overflow-x-hidden">
            <div className="flex w-full items-center justify-between">
              <div className={`flex w-full flex-col`}>
                {hideClient ? null : (
                  <div className="page-link flex items-center space-x-2">
                    <div className="data-point-xs purple-to-green-gradient-1"></div>
                    <Link href={`/clients/${data?.client_id}`}>
                      <a>
                        <h6>{truncateString(data?.client_name, 50)}</h6>
                      </a>
                    </Link>
                  </div>
                )}
                {hidePolicy ||
                data?.system_action ||
                data?.policies.length == 0 ? null : data?.policies.length ==
                  1 ? (
                  <div className="flex flex-auto items-center space-x-2 px-4">
                    <TagBasic
                      tooltip
                      tooltipContent={data?.policies[0].policy_type_full}
                      text={data?.policies[0].policy_type}
                    />
                    <Link href="/">
                      <a className="transition duration-100 hover:text-sky-500">
                        <h4 className="flex items-center space-x-2">
                          <BsBox />
                          <div>{data?.policies[0].policy_number}</div>
                        </h4>
                      </a>
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    {data?.policies.map((pol) => (
                      <div key={pol.id} className="flex items-center space-x-2">
                        <TagBasic
                          tooltip
                          tooltipContent={pol.policy_number}
                          text={`${pol.policy_type}`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex w-full px-2 py-4">
              <div className="flex w-full flex-col md:flex-row md:justify-between">
                <h4 className="flex">{data.activity_type}</h4>
                <div className="flex items-center space-x-2">
                  {!editDate ? (
                    <div className="flex items-center  space-x-2">
                      <div className="data-point-xs pink-to-blue-gradient-1"></div>
                      <div className="flex items-center space-x-2">
                        <h4>Due</h4>
                        <h6
                          className={`font-bold ${isLate(
                            editSuspense?.date
                          )} flex items-center`}
                        >
                          {getFormattedDate(editSuspense?.date)}
                        </h6>
                      </div>
                    </div>
                  ) : (
                    <BrinqInput
                      color="lime"
                      placeholder="Set the suspense date"
                      callBack={(e) => changeSuspense(e, 'date')}
                      inputType="date"
                      underlined={false}
                      borderd={true}
                      disabled={false}
                      clearable={false}
                    />
                  )}
                  <Button
                    light
                    size="xs"
                    auto
                    onClick={() => setEditDate(!editDate)}
                  >
                    <div className="flex items-center">{getIcon('edit')}</div>
                  </Button>
                </div>
              </div>
            </div>
            {editDescription ? (
              <div className="relative block min-h-[10vh] overflow-y-auto rounded-lg py-1 ">
                <div
                  className={`h-full w-full ${
                    isDark ? 'bg-zinc-800/20' : 'bg-zinc-400/20'
                  } rounded-lg`}
                >
                  <Textarea
                    fullWidth
                    onChange={(e) =>
                      changeSuspense(e.target.value, 'description')
                    }
                    autoFocus
                    minRows={5}
                    maxRows={20}
                    size="xs"
                    initialValue={editSuspense.description}
                    clearable
                    underlined
                  />
                </div>

                <div className="flex w-full items-center justify-end space-x-2 pt-4">
                  <Button
                    flat
                    color="error"
                    size="xs"
                    auto
                    onClick={() => cancelEditDescription()}
                  >
                    <div className="flex items-center">Cancel</div>
                  </Button>
                  <Button
                    flat
                    size="xs"
                    auto
                    onClick={() => setEditDescription(!editDescription)}
                  >
                    <div className="flex items-center">{getIcon('edit')}</div>
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className={`relative block min-h-[10vh] overflow-y-auto rounded-lg ${
                  isDark ? 'bg-zinc-800/20' : 'bg-zinc-400/20'
                }  px-4 py-1`}
              >
                <h6 className="block whitespace-pre-line">
                  {editSuspense?.description}
                </h6>
                <div className="absolute bottom-[4px] right-[4px]">
                  <Button
                    flat
                    size="xs"
                    auto
                    onClick={() => setEditDescription(!editDescription)}
                  >
                    <div className="flex items-center">{getIcon('edit')}</div>
                  </Button>
                </div>
              </div>
            )}
            <div className="flex w-full flex-col py-4 px-1 xl:flex-row xl:items-center xl:justify-between xl:space-x-2">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <h4>Author:</h4>
                  <div>
                    <UserAvatar
                      squared={false}
                      tooltip={false}
                      size="sm"
                      isUser={true}
                      passUser={data?.users.find(
                        (x) => x.id === data?.author_id
                      )}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <h4 className="mr-2">Assigned:</h4>
                  {data?.users.length >= 1 ? (
                    <div>
                      <Avatar.Group
                        count={
                          data?.users.length >= 3 ? data?.users.length : null
                        }
                      >
                        {data?.users.map((u) => (
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
                  ) : (
                    <h4>None</h4>
                  )}
                </div>
              </div>
              <div className="flex items-center py-4 xl:justify-end xl:py-0">
                <div className="flex items-center justify-center space-x-2 py-2">
                  <Checkbox
                    color="success"
                    defaultSelected={editSuspense.completed}
                    isSelected={editSuspense.completed}
                    onChange={() => changeSuspense(true, 'completed')}
                    size="xs"
                  >
                    <div className="text-xs tracking-widest">Completed</div>
                  </Checkbox>
                  <Checkbox
                    color="error"
                    defaultSelected={editSuspense.completed}
                    isSelected={!editSuspense.completed}
                    onChange={() => changeSuspense(false, 'completed')}
                    size="xs"
                  >
                    <div className="text-xs tracking-widest">Not Completed</div>
                  </Checkbox>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer autoMargin={false} className="w-full p-4">
          <div className="w-full">
            <Button
              disabled={!changeMade}
              className="w-full"
              color="gradient"
              auto
              icon={getIcon('save')}
              onClick={() => submit()}
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default SuspenseCard
