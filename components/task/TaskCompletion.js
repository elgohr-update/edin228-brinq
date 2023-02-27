import React, { useState } from 'react'
import { BsBox, BsCheckCircleFill, BsFillXCircleFill } from 'react-icons/bs'
import { BiCircle } from 'react-icons/bi'
import {
  Avatar,
  Button,
  Checkbox,
  Loading,
  Modal,
  Textarea,
  Tooltip,
  useTheme,
} from '@nextui-org/react'
import {
  getFormattedDate,
  getFormattedUTCDateTime,
  getIcon,
  truncateString,
  useNextApi,
} from '../../utils/utils'
import {
  UpdateDataWrapper,
  useAgencyContext,
  useReloadContext,
} from '../../context/state'
import UserAvatar from '../user/Avatar'
import BrinqInput from '../ui/input/BrinqInput'
import TagBasic from '../ui/tag/TagBasic'
import Link from 'next/link'
import CommentContainer from '../comments/CommentContainer'
import NewComment from '../comments/NewComment'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { DateTime } from 'luxon'
import BrinqSelect from '../ui/select/BrinqSelect'

export default function TaskCompletion({ task }) {
  const task_default = {
    id: task?.id,
    client_id: task?.client_id,
    policy_id: task?.policy_id,
    agency_id: task?.agency_id,
    completed: task?.done,
    description: task?.title + ' marked as Completed.',
    date: task?.date,
    users: task?.users?.map((x) => x.id),
    amsActivity: true,
    includeComments: false,
    completeSimilar: false,
  }
  const { isDark, type } = useTheme()
  const { reload, setReload } = useReloadContext()
  const { agency, setAgency } = useAgencyContext()
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const [taskBundle, setTaskBundle] = useState(task_default)
  const [editDate, setEditDate] = useState(false)
  const [editUsers, setEditUsers] = useState(false)
  const [changeMade, setChangeMade] = useState(false)
  const [showComments, setShowComments] = useState(true)
  const [userFilter, setUserFilter] = useState([])
  const [userFilterOptions, setUserFilterOptions] = useState([])

  const [descriptionWithoutComments, setDescriptionWithoutComments] = useState(
    task?.title + ' marked as Completed.'
  )

  useEffect(() => {
    const newBundle = { ...taskBundle, comments: task.comments }
    setTaskBundle(newBundle)
    const userOptions = agency?.users
      ?.filter((y) => y.is_active)
      .map((x) => {
        return { id: x.id, value: x.name }
      })
    const users = task?.users.map((x) => x.id)
    setUserFilterOptions(userOptions)
    setUserFilter(users)
    return () => {}
  }, [task])

  useEffect(() => {
    if (taskBundle.includeComments == true) {
      addCommentsToDescription()
    } else {
      editTask(descriptionWithoutComments, 'description')
    }
    return () => {}
  }, [taskBundle.includeComments])

  const addCommentsToDescription = () => {
    if (!descriptionWithoutComments) {
      setDescriptionWithoutComments(taskBundle.description)
    }
    const commentStrings = []
    task.comments.forEach((comment) => {
      const name = comment.user?.name
      const datetime = getFormattedUTCDateTime(comment.created)
      const message = comment.post
      const combined = `${name} ${datetime} \n${message}`
      commentStrings.push(combined)
      if (comment.replies.length >= 1) {
        comment.replies.forEach((reply) => {
          const reply_name = `    ${reply.user?.name} replied`
          const reply_datetime = `    ${getFormattedUTCDateTime(reply.created)}`
          const reply_message = `    ${reply.post}`
          const reply_combined = `${reply_name} ${reply_datetime} \n${reply_message}`
          commentStrings.push(reply_combined)
        })
      }
    })
    const combinedComments = commentStrings.join('\n')
    const newDescription =
      taskBundle.description +
      '\n' +
      '\n' +
      'Comments' +
      '\n' +
      combinedComments
    editTask(newDescription, 'description')
  }

  const closeModal = () => {
    setEditDate(false)
    setEditUsers(false)
    setChangeMade(false)
    setTaskBundle(task_default)
    setShowComments(true)
    setShowModal(false)
  }

  const submit = async () => {
    const finalBundle = { ...taskBundle, submissionDateTime: DateTime.local() }
    const bundle = JSON.stringify({ ...finalBundle })
    const res = await useNextApi('PUT', `/api/task/${taskBundle.id}`, bundle)
    if (res) {
      closeModal()
      // setUpdateData({
      //   ...updateData,
      //   task:
      // })
      setReload({
        ...reload,
        policies: true,
        activities: true,
      })
    }
  }

  const editTask = (e, field) => {
    setChangeMade(true)
    const newTask = { ...taskBundle }
    newTask[field] = e
    setTaskBundle({
      ...newTask,
    })
  }

  const isLate = (due) => {
    const today = new Date()
    const date = new Date(due)
    return today > date ? `text-color-error` : ``
  }

  return (
    <>
      <div
        className="flex w-[40px] items-center justify-center"
        onClick={() => setShowModal(!showModal)}
      >
        <Tooltip placement="top" content={task.title}>
          {task?.done ? (
            task?.completed ? (
              <div className="text-color-success text-xs">
                <BsCheckCircleFill />
              </div>
            ) : task?.na ? (
              <div className="text-color-warning text-xs">
                <BsFillXCircleFill />
              </div>
            ) : (
              <div className="text-color-warning text-xs">
                <BsFillXCircleFill />
              </div>
            )
          ) : (
            <div className="text-xs">
              <BiCircle />
            </div>
          )}
        </Tooltip>
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
        <Modal.Body className="flex w-full flex-col">
          <div className="flex h-full w-full flex-col overflow-x-hidden px-2">
            <div className="flex w-full items-center justify-between">
              <div className={`flex w-full flex-col`}>
                <div className="page-link flex items-center space-x-2">
                  <div className="data-point-xs purple-to-green-gradient-1"></div>
                  <Link href={`/clients/${task?.client_id}`}>
                    <a>
                      <h6>{truncateString(task?.client_name, 50)}</h6>
                    </a>
                  </Link>
                </div>
                <div className="flex flex-auto items-center space-x-2 px-4">
                  <TagBasic
                    tooltip
                    tooltipContent={task?.policy_type_full}
                    text={task?.policy_type}
                  />
                  <Link href="/">
                    <a className="transition duration-100 hover:text-sky-500">
                      <h4 className="flex items-center space-x-2">
                        <BsBox />
                        <div>{task?.policy_number}</div>
                      </h4>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex w-full px-2 py-4">
              <div className="flex w-full flex-col md:flex-row md:justify-between">
                {/* <h4 className="flex">{task.title}</h4> */}
                <div className="flex w-full items-center space-x-2">
                  <div className="flex w-full flex-col">
                    <div className="mb-2 flex items-center space-x-2">
                      <h4>Assigned</h4>
                      <Button
                        light
                        size="xs"
                        auto
                        onClick={() => setEditUsers(!editUsers)}
                      >
                        <div className="flex items-center">
                          {getIcon('edit')}
                        </div>
                      </Button>
                    </div>
                    {!editUsers ? (
                      taskBundle?.users.length >= 1 ? (
                        <div className="pl-2">
                          <Avatar.Group
                            count={
                              taskBundle?.users.length > 3
                                ? taskBundle?.users.length - 3
                                : null
                            }
                          >
                            {taskBundle?.users.slice(0, 3).map((u) => (
                              <UserAvatar
                                tooltip={true}
                                tooltipPlacement="topEnd"
                                lookUpUser={u}
                                key={u}
                                isGrouped={true}
                                squared={false}
                                size={`sm`}
                              />
                            ))}
                          </Avatar.Group>
                        </div>
                      ) : (
                        <h4>None</h4>
                      )
                    ) : (
                      <div className="w-full">
                        <BrinqSelect
                          fullWidth={true}
                          initialValue={taskBundle.users}
                          initialOptions={userFilterOptions}
                          labelField={'value'}
                          clearable={true}
                          multiple={true}
                          callBack={(e) => editTask(e, 'users')}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex w-full items-center justify-end space-x-2">
                  {!editDate ? (
                    <div className="flex items-center  space-x-2">
                      <div className="data-point-xs pink-to-blue-gradient-1"></div>
                      <div className="flex items-center space-x-2">
                        <h4>Due</h4>
                        <h6
                          className={`font-bold ${isLate(
                            taskBundle?.date
                          )} flex items-center`}
                        >
                          {getFormattedDate(taskBundle?.date)}
                        </h6>
                      </div>
                    </div>
                  ) : (
                    <BrinqInput
                      color="lime"
                      placeholder="Set the suspense date"
                      callBack={(e) => editTask(e, 'date')}
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
            <div className="mb-2 pl-2 text-xs opacity-50">
              Activity Description
            </div>
            <div className="relative block min-h-[10vh] overflow-y-auto rounded-lg py-1 ">
              <div
                className={`h-full w-full ${
                  isDark ? 'bg-zinc-800/20' : 'bg-zinc-400/20'
                } rounded-lg`}
              >
                <Textarea
                  fullWidth
                  onChange={(e) => editTask(e.target.value, 'description')}
                  autoFocus
                  minRows={10}
                  maxRows={30}
                  size="xs"
                  initialValue={taskBundle.description}
                  value={taskBundle.description}
                  clearable
                  underlined
                />
              </div>
            </div>

            <div className="flex w-full flex-col pr-2">
              <div className="flex w-full items-center justify-between">
                <div
                  className="mb-2 flex cursor-pointer items-center space-x-2 py-4 pl-2 text-xs opacity-50 transition duration-100 ease-out hover:text-sky-500"
                  onClick={() => setShowComments(!showComments)}
                >
                  <div className="flex items-center">Comments</div>
                  <div className="flex items-center">
                    {getIcon(showComments ? 'down' : 'left')}
                  </div>
                </div>
                {task?.comments?.length >= 1 ? (
                  <div className="flex w-full items-center justify-end">
                    <Checkbox
                      color="success"
                      defaultSelected={taskBundle.includeComments}
                      isSelected={taskBundle.includeComments}
                      onChange={() =>
                        editTask(!taskBundle.includeComments, 'includeComments')
                      }
                      size="xs"
                    >
                      <div className="text-xs tracking-widest">
                        Include Comments
                      </div>
                    </Checkbox>
                  </div>
                ) : null}
              </div>
              {showComments ? (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      opacity: 1,
                      transition: {
                        delay: 0.05,
                      },
                      y: 0,
                    },
                    hidden: { opacity: 0, y: -10 },
                  }}
                  transition={{ ease: 'easeOut', duration: 1 }}
                  className="flex w-full flex-col px-2"
                >
                  <CommentContainer
                    isSelected={true}
                    comments={task?.comments}
                  />
                  <NewComment source={task} />
                </motion.div>
              ) : null}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer
          autoMargin={false}
          className="flex w-full items-center p-4"
        >
          <div className="flex w-full flex-col">
            <div className="flex w-full flex-col py-4 px-1 xl:flex-row xl:items-center xl:justify-between xl:space-x-2">
              <div className="flex w-full flex-col items-center">
                <div className="flex flex-wrap items-center justify-center gap-4 space-x-2 py-2">
                  <Checkbox
                    color="success"
                    defaultSelected={taskBundle.completed}
                    isSelected={taskBundle.completed}
                    onChange={() => editTask(true, 'completed')}
                    size="xs"
                  >
                    <div className="text-xs tracking-widest">Completed</div>
                  </Checkbox>
                  <Checkbox
                    color="error"
                    defaultSelected={taskBundle.completed}
                    isSelected={!taskBundle.completed}
                    onChange={() => editTask(false, 'completed')}
                    size="xs"
                  >
                    <div className="text-xs tracking-widest">Not Completed</div>
                  </Checkbox>
                  <Checkbox
                    color="warning"
                    defaultSelected={taskBundle.amsActivity}
                    isSelected={taskBundle.amsActivity}
                    onChange={() =>
                      editTask(!taskBundle.amsActivity, 'amsActivity')
                    }
                    size="xs"
                  >
                    <div className="text-xs tracking-widest">
                      AMS360 Activity
                    </div>
                  </Checkbox>
                  <Checkbox
                    color="secondary"
                    defaultSelected={taskBundle.completeSimilar}
                    isSelected={taskBundle.completeSimilar}
                    onChange={() =>
                      editTask(!taskBundle.completeSimilar, 'completeSimilar')
                    }
                    size="xs"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-xs tracking-widest">
                        Apply to Similar Tasks
                      </div>
                      <Tooltip
                        content={`Any tasks with the same client, same stage, and same due date will have these changes and activities applied to them as well. This is useful for clients who have multiple policies renewing around the same time.`}
                      >
                        <div className="flex items-center">
                          {getIcon('info')}
                        </div>
                      </Tooltip>
                    </div>
                  </Checkbox>
                </div>
              </div>
            </div>
            <div className="flex w-full items-center gap-2">
              <div className="w-full">
                <Button
                  disabled={loading}
                  auto
                  color="gradient"
                  className="w-full"
                  onClick={() => submit()}
                >
                  {loading ? (
                    <Loading
                      type="points-opacity"
                      color="currentColor"
                      size="md"
                    />
                  ) : (
                    <div>Submit</div>
                  )}
                </Button>
              </div>
              <div>
                <Button
                  disabled={loading}
                  auto
                  color="error"
                  className="w-full"
                  onClick={() => closeModal()}
                >
                  <div>Cancel</div>
                </Button>
              </div>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}
