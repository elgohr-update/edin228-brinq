import { Button, Checkbox, Input, Textarea, useTheme } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import HiddenBackdrop from '../../util/HiddenBackdrop'
import {
  useActivityDrawerContext,
  useAgencyContext,
  useAMS360ValueListContext,
  useReloadContext,
} from '../../../context/state'
import { BsBox, BsChevronDown, BsChevronUp } from 'react-icons/bs'
import {
  getBase64String,
  getIcon,
  sortByProperty,
  timeout,
  useApi,
  useApiFormData,
  useNextApi,
} from '../../../utils/utils'
import { useRouter } from 'next/router'
import PanelTitle from '../title/PanelTitle'
import SelectInput from '../select/SelectInput'
import DrawerLoader from '../loaders/DrawerLoader'
import FileUploaderContainer from '../../files/FileUploaderContainer'
import { AiOutlineClose } from 'react-icons/ai'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { DateTime } from 'luxon'

const ActivityDrawer = () => {
  const { activityDrawer, setActivityDrawer } = useActivityDrawerContext()
  const { AMS360ValueList, setAMS360ValueList } = useAMS360ValueListContext()
  const { type } = useTheme()
  const router = useRouter()
  const [isActivity, setIsActivity] = useState(true)
  const [isSuspense, setIsSuspense] = useState(false)
  const [isAMSActivity, setIsAMSActivity] = useState(true)
  const [drawerTab, setDrawerTab] = useState(1)

  const [clientInfo, setClientInfo] = useState(null)
  const [search, setSearch] = useState(null)
  const [client, setClient] = useState(null)
  const [policies, setPolicies] = useState(null)
  const [activityAction, setActivityAction] = useState(null)
  const [activityDescription, setActivityDescription] = useState(null)
  const [suspenseAction, setSuspenseAction] = useState(null)
  const [suspenseDescription, setSuspenseDescription] = useState(null)
  const [suspenseDate, setSuspenseDate] = useState(null)
  const [suspenseUsers, setSuspenseUsers] = useState(null)
  const [suspenseUsersOptions, setSuspenseUsersOptions] = useState(null)
  const [files, setFiles] = useState([])

  const [activityActions, setActivityActions] = useState(null)
  const [docTypes, setDocTypes] = useState(null)
  const [optPolicies, setOptPolicies] = useState([])
  const [loading, setLoading] = useState(false)
  const [opts, setOpts] = useState([])
  const { data: session } = useSession()

  const { reload, setReload } = useReloadContext()
  const { agency, setAgency } = useAgencyContext()

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(500)
      if (!isCancelled && activityDrawer.clientId) {
        const data = await fetchClient()
        setClientInfo(data)
        setClient(data.id)
      }
      if (activityDrawer.prefill) {
        setActivityDescription(activityDrawer.prefill.description)
        setSuspenseDescription(activityDrawer.prefill.description)
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(500)
      if (!isCancelled && search) {
        setLoading(true)
        const data = await fetchData()
        setOpts(data)
        setLoading(false)
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [search])

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(1000)
      if (!isCancelled && client) {
        setLoading(true)
        const data = await fetchPolicies()
        await fetchActions()
        await fetchDocType()
        fetchUserInfo()
        setOptPolicies(data)
        setLoading(false)
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [client])

  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      closeDrawer()
    })
  }, [router.events])

  const fetchClient = async () => {
    const clientId = activityDrawer.clientId
    const res = await useNextApi('GET', `/api/clients/${clientId}`)
    return res
  }

  const fetchData = async () => {
    const res = await useNextApi('GET', `/api/search?q=${search}`)
    return res.clients
  }
  const fetchPolicies = async () => {
    const clientId = client
    const queryUrl = `?active=true`
    const res = await useNextApi(
      'GET',
      `/api/clients/${clientId}/policies${queryUrl}`
    )
    return res
  }
  const fetchActions = async () => {
    if (!AMS360ValueList.activityAction) {
      console.log('test')
      const res = await useNextApi(
        'GET',
        `/api/ams360/valuelist/activityaction`
      )
      const actions = res
      if (actions) {
        if (actions?.AllowedValue?.length > 0) {
          const newBase = actions?.AllowedValue?.map((x) => {
            return {
              id: x.__values__.Code,
              value: x.__values__.Description,
            }
          })
          setActivityActions(newBase)
          setAMS360ValueList({ ...AMS360ValueList, activityAction: newBase })
          return newBase
        }
      }
    }
    setActivityActions(AMS360ValueList.activityAction)
    return AMS360ValueList.activityAction
  }

  const fetchDocType = async () => {
    if (!AMS360ValueList.docType) {
      console.log('test')
      const res = await useNextApi('GET', `/api/ams360/valuelist/doc360type`)
      const doctypes = res
      if (doctypes) {
        if (doctypes?.AllowedValue?.length > 0) {
          const newBase = doctypes?.AllowedValue?.map((x) => {
            return {
              id: x.__values__.Code,
              value: x.__values__.Description,
            }
          })
          setDocTypes(newBase)
          setAMS360ValueList({ ...AMS360ValueList, docType: newBase })
          return newBase
        }
      }
    }
    setDocTypes(AMS360ValueList.docType)
    return AMS360ValueList.docType
  }

  const fetchUserInfo = () => {
    const users = agency?.users.map((x) => {
      return { id: x.id, name: x.name, code: x.ams360_employee_code }
    })
    setSuspenseUsersOptions(users)
  }

  const closeDrawer = () => {
    const setDefault = {
      ...activityDrawer,
      isOpen: false,
      clientId: null,
      style: 1,
      prefill: null
    }
    setActivityDrawer(setDefault)
    setReload({
      ...reload,
      activities: true,
    })
  }

  const onSave = (e) => {
    setFiles(e)
  }

  const sortedFiles = () => {
    const sorted = sortByProperty(files, 'id')
    return sorted
  }

  const setFileDescription = (fid, text) => {
    const fil = files.find((x) => x.id == fid)
    fil.description = text
    const fils = files.filter((x) => x.id != fid)
    const newFiles = [...fils, fil]
    setFiles(newFiles)
  }

  const setFileDoctype = (fid, action) => {
    const fil = files.find((x) => x.id == fid)
    fil.action = action
    const fils = files.filter((x) => x.id != fid)
    const newFiles = [...fils, fil]
    setFiles(newFiles)
  }

  const activityCheck = (e) => {
    if (!e) {
      if (isSuspense) {
        setIsActivity(e)
        setDrawerTab(2)
      }
    } else {
      setIsActivity(e)
    }
  }

  const suspenseCheck = (e) => {
    if (!e && !isActivity) {
      setIsActivity(true)
      setIsSuspense(false)
      setDrawerTab(1)
    } else {
      setIsSuspense(e)
    }
  }

  const setActivityAndSuspenseAction = (e) => {
    setActivityAction(e)
    setSuspenseAction(e)
  }

  const isSubmitEnabled = () => {
    const isOk = () => {
      if (isActivity && isSuspense) {
        return activityParams && suspenseParams ? true : false
      } else if (isActivity && !isSuspense) {
        return activityParams
      } else if (!isActivity && isSuspense) {
        return suspenseParams
      }
    }
    const activityParams =
      isActivity && activityDescription != null && activityAction != null
    const suspenseParams =
      isSuspense && suspenseDescription != null && suspenseAction != null
    return client && isOk()
  }

  const getSubmissionFormData = () => {
    const activitySubmission = {
      clientId: clientInfo.id,
      policies: policies,
      isActivity: isActivity,
      activityAction: activityAction,
      activityDescription: activityDescription,
      isSuspense: isSuspense,
      suspenseAction: suspenseAction,
      suspenseDescription: suspenseDescription,
      suspenseDate: suspenseDate,
      suspenseUsers: suspenseUsers,
      submissionDateTime: DateTime.local(),
    }
    const formData = new FormData()
    formData.append('activityParams', JSON.stringify(activitySubmission))
    formData.append('brinqActivityId', JSON.stringify([]))
    if (files?.length > 0) {
      for (let fil of files) {
        formData.append('files', fil.data) // note, no square-brackets
        formData.append(
          'fileParams',
          JSON.stringify({
            action: fil.action,
            description: fil.description,
            private: fil.private,
            size: fil.data.size,
          })
        )
      }
    }
    return formData
  }

  const submitBrinqActivity = async () => {
    const formData = getSubmissionFormData()
    const url =
      files?.length > 0
        ? `/activity/brinq-activity/`
        : `/activity/brinq-activity-no-files/`
    const res = await useApiFormData(
      'POST',
      url,
      `${session.accessToken}`,
      formData
    )
    return res.activityIds
  }
  const submitAmsActivity = async (data) => {
    if (data) {
      const formData = getSubmissionFormData()
      formData.set('brinqActivityId', JSON.stringify({ ids: data }))
      const url =
        files?.length > 0
          ? `/activity/ams360-activity/`
          : `/activity/ams360-activity-no-files/`
      const res = await useApiFormData(
        'POST',
        url,
        `${session.accessToken}`,
        formData
      )
      if (res) {
        closeDrawer()
        return true
      }
    }
  }

  const submitActivity = async () => {
    if (isActivity) {
      const bSubmission = await submitBrinqActivity()
      if (isAMSActivity) {
        await submitAmsActivity(bSubmission)
      }
    }
    if (isSuspense) {
      console.log('run suspense')
    }
  }

  return (
    <>
      {activityDrawer.isOpen ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              opacity: 1,
              x: 0,
            },
            hidden: { opacity: 0, x: 50 },
          }}
          transition={{ ease: 'easeInOut', duration: 0.25 }}
          className={`fixed left-0 top-0 z-[9999999] flex h-full w-full lg:z-[999997]`}
        >
          <div
            className={`fixed ${
              activityDrawer.style == 1 ? 'xl:right-[100px]' : 'xl:right-[450px]'
            }   right-0 flex h-full w-full flex-col md:w-[400px] ${type}-shadow panel-theme-${type}`}
          >
            <div className="flex flex-col flex-auto h-full py-2 space-y-2 overflow-hidden lg:gap-2">
              <div className={`relative mb-2 flex w-full flex-col px-2`}>
                <div className="relative flex flex-col w-full md:flex-row md:justify-between">
                  <div className="text-md flex h-[38px] items-end pb-1 font-semibold tracking-widest">
                    New Activity
                  </div>
                </div>
                <div
                  className="absolute top-0 flex right-5 md:hidden"
                  onClick={() => closeDrawer()}
                >
                  <div className="text-color-error">
                    <AiOutlineClose />
                  </div>
                </div>
                <div
                  className={`bottom-border-flair pink-to-blue-gradient-1`}
                />
              </div>
              {activityDrawer.clientId && !clientInfo ? (
                <DrawerLoader />
              ) : (
                <div className="relative flex overflow-hidden">
                  <div className="flex flex-col w-full space-y-4 overflow-y-auto">
                    <div className="flex items-center justify-center space-x-2">
                      <Checkbox
                        color="primary"
                        defaultSelected
                        checked={isActivity}
                        onChange={(e) => activityCheck(e)}
                        size="xs"
                      >
                        <div className="text-xs tracking-widest">Activity</div>
                      </Checkbox>
                      <Checkbox
                        color="warning"
                        defaultSelected
                        checked={isAMSActivity}
                        onChange={(e) => setIsAMSActivity(e)}
                        size="xs"
                      >
                        <div className="text-xs tracking-widest">
                          AMS360Activity
                        </div>
                      </Checkbox>
                      <Checkbox
                        color="secondary"
                        checked={isSuspense}
                        onChange={(e) => suspenseCheck(e)}
                        size="xs"
                      >
                        <div className="text-xs tracking-widest">Suspense</div>
                      </Checkbox>
                    </div>
                    {clientInfo && activityDrawer.clientId ? (
                      <div className="flex flex-col w-full pl-4">
                        <div>
                          <PanelTitle title={`Client`} color="sky" />
                        </div>
                        <div className="flex">{clientInfo?.client_name}</div>
                      </div>
                    ) : (
                      <div className="flex flex-col w-full px-4">
                        <div>
                          <PanelTitle title={`Client`} color="sky" />
                        </div>
                        <div className="flex w-full ">
                          <div className="w-full">
                            <SelectInput
                              loading={loading}
                              value={client}
                              opts={opts}
                              labelField={'client_name'}
                              placeholder={'Search for Client'}
                              filterable={true}
                              inputChange={(e) => setSearch(e)}
                              onChange={(v) => setClient(v)}
                              disabled={
                                drawerTab == 2 && isSuspense && isActivity
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {client ? (
                      <div className="flex flex-col w-full px-4">
                        <div>
                          <PanelTitle title={`Policies`} color="indigo" />
                        </div>
                        <div className="flex w-full ">
                          <div className="w-full">
                            <SelectInput
                              multiple={true}
                              value={policies}
                              opts={optPolicies}
                              labelField={'policy_number'}
                              placeholder={'Assign to Policies'}
                              filterable={true}
                              useDetail
                              detailField={`policy_type`}
                              onChange={(v) => setPolicies(v)}
                            />
                          </div>
                        </div>
                      </div>
                    ) : null}
                    {client && isSuspense && drawerTab == 2 ? (
                      <div className="flex flex-col w-full px-4 pb-1">
                        <div>
                          <PanelTitle
                            title={`Suspense Assigned To`}
                            color="lime"
                          />
                        </div>
                        <div className="flex w-full ">
                          <div className="w-full">
                            <SelectInput
                              multiple={true}
                              value={suspenseUsers}
                              opts={suspenseUsersOptions}
                              labelField={'name'}
                              placeholder={'Assign to users to Suspense'}
                              filterable={true}
                              onChange={(v) => setSuspenseUsers(v)}
                            />
                          </div>
                        </div>
                      </div>
                    ) : null}
                    {client && isSuspense && drawerTab == 2 ? (
                      <div className="flex flex-col w-full px-4 pb-1">
                        <div>
                          <PanelTitle title={`Suspense Date`} color="red" />
                        </div>
                        <div className="flex w-full ">
                          <Input
                            fullWidth
                            type="date"
                            onChange={(v) => setSuspenseDate(v.target.value)}
                          />
                        </div>
                      </div>
                    ) : null}
                    {client && drawerTab == 1 ? (
                      <div className="flex flex-col w-full px-4">
                        <div>
                          <PanelTitle
                            title={`Activity Action`}
                            color="orange"
                          />
                        </div>
                        <div className="flex w-full ">
                          <div className="w-full">
                            <SelectInput
                              multiple={false}
                              value={activityAction}
                              opts={activityActions}
                              labelField={'value'}
                              valueField={`value`}
                              keyField={`id`}
                              placeholder={'Select Activity Action'}
                              filterable={true}
                              onChange={(v) => setActivityAndSuspenseAction(v)}
                            />
                          </div>
                        </div>
                      </div>
                    ) : null}
                    {client && isSuspense && drawerTab == 2 ? (
                      <div className="flex flex-col w-full px-4">
                        <div>
                          <PanelTitle
                            title={`Suspense Action`}
                            color="orange"
                          />
                        </div>
                        <div className="flex w-full ">
                          <div className="w-full">
                            <SelectInput
                              multiple={false}
                              value={suspenseAction}
                              opts={activityActions}
                              labelField={'value'}
                              valueField={`value`}
                              keyField={`id`}
                              placeholder={'Select Suspense Action'}
                              filterable={true}
                              onChange={(v) => setSuspenseAction(v)}
                            />
                          </div>
                        </div>
                      </div>
                    ) : null}
                    {client && drawerTab == 1 ? (
                      <div className="flex flex-col w-full px-4 pb-1">
                        <div>
                          <PanelTitle
                            title={`Activity Description`}
                            color="pink"
                          />
                        </div>
                        <div
                          className={`flex w-full rounded-lg panel-flatter-${type}`}
                        >
                          <Textarea
                            fullWidth
                            bordered
                            value={activityDescription}
                            placeholder="Write your activity here"
                            minRows={5}
                            onChange={(e) =>
                              setActivityDescription(e.target.value)
                            }
                          />
                        </div>
                      </div>
                    ) : null}

                    {client && isSuspense && drawerTab == 2 ? (
                      <div className="flex flex-col w-full px-4 pb-1">
                        <div>
                          <PanelTitle
                            title={`Suspense Description`}
                            color="yellow"
                          />
                        </div>
                        <div
                          className={`flex w-full rounded-lg panel-flatter-${type}`}
                        >
                          <Textarea
                            fullWidth
                            bordered
                            value={suspenseDescription}
                            placeholder="Write your suspense here"
                            minRows={5}
                            onChange={(e) =>
                              setSuspenseDescription(e.target.value)
                            }
                          />
                        </div>
                      </div>
                    ) : null}

                    {client && drawerTab == 1 ? (
                      <div className="flex flex-col w-full px-4">
                        <div>
                          <PanelTitle title={`Attachments`} color="amber" />
                        </div>
                        <div className="flex flex-col space-y-2">
                          {sortedFiles().map((f) => (
                            <div
                              key={f.id}
                              className="flex flex-col w-full space-y-2"
                            >
                              <div className="flex items-center w-full">
                                <h4 className="flex w-full">{f.data.name}</h4>
                                <div className="flex items-center justify-end w-full">
                                  <SelectInput
                                    styling={`flex w-full min-w-[150px]`}
                                    multiple={false}
                                    value={f.action}
                                    opts={docTypes}
                                    labelField={'value'}
                                    valueField={`id`}
                                    keyField={`id`}
                                    placeholder={'Select Document Type'}
                                    filterable={true}
                                    onChange={(v) => setFileDoctype(f.id, v)}
                                  />
                                </div>
                              </div>
                              <div className="flex flex-col w-full">
                                <Textarea
                                  value={f.description}
                                  placeholder="Attachment Description"
                                  minRows={1}
                                  onChange={(e) =>
                                    setFileDescription(f.id, e.target.value)
                                  }
                                />
                              </div>
                            </div>
                          ))}
                          <div className="flex justify-center w-full">
                            <FileUploaderContainer
                              showLargeButton
                              onSave={(e) => onSave(e)}
                            />
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end w-full px-2 pt-1 pb-4">
              {isActivity && isSuspense ? (
                drawerTab == 1 ? (
                  <Button
                    color={!client ? 'primary' : 'gradient'}
                    disabled={client ? false : true}
                    onClick={() => setDrawerTab(2)}
                    auto
                  >
                    Suspense
                    {getIcon('right')}
                  </Button>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <Button
                      color={!client ? 'primary' : 'gradient'}
                      disabled={client ? false : true}
                      onClick={() => setDrawerTab(1)}
                      auto
                    >
                      {getIcon('left')}
                      Activity
                    </Button>
                    <Button
                      color={!isSubmitEnabled() ? 'primary' : 'gradient'}
                      disabled={!isSubmitEnabled()}
                      auto
                      onClick={() => submitActivity()}
                    >
                      Create
                    </Button>
                  </div>
                )
              ) : (
                <Button
                  color={!isSubmitEnabled() ? 'primary' : 'gradient'}
                  disabled={!isSubmitEnabled()}
                  className="w-full"
                  onClick={() => submitActivity()}
                >
                  Create
                </Button>
              )}
            </div>
          </div>
          {activityDrawer.isOpen ? (
            <HiddenBackdrop onClick={() => closeDrawer()} />
          ) : null}
        </motion.div>
      ) : null}
    </>
  )
}
export default ActivityDrawer
