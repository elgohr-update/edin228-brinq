import { Button, Checkbox, Textarea, useTheme } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import HiddenBackdrop from '../../util/HiddenBackdrop'
import { useActivityDrawerContext } from '../../../context/state'
import { BsBox, BsChevronDown, BsChevronUp } from 'react-icons/bs'
import {
  getConstantIcons,
  sortByProperty,
  timeout,
  useNextApi,
} from '../../../utils/utils'
import { useRouter } from 'next/router'
import PanelTitle from '../title/PanelTitle'
import SelectInput from '../select/SelectInput'
import DrawerLoader from '../loaders/DrawerLoader'
import FileUploaderContainer from '../../files/FileUploaderContainer'
import { AiOutlineClose } from 'react-icons/ai'
import { motion } from 'framer-motion'

const ActivityDrawer = () => {
  const { activityDrawer, setActivityDrawer } = useActivityDrawerContext()
  const { type } = useTheme()
  const router = useRouter()
  const [isActivity, setIsActivity] = useState(true)
  const [isSuspense, setIsSuspense] = useState(false)
  const [drawerTab, setDrawerTab] = useState(1)

  const [clientInfo, setClientInfo] = useState(null)
  const [search, setSearch] = useState(null)
  const [client, setClient] = useState(null)
  const [policies, setPolicies] = useState(null)
  const [activityAction, setActivityAction] = useState(null)
  const [activityDescription, setActivityDescription] = useState(null)
  const [suspenseAction, setSuspenseAction] = useState(null)
  const [suspenseDescription, setSuspenseDescription] = useState(null)
  const [files, setFiles] = useState([])

  const [activityActions, setActivityActions] = useState(null)
  const [docTypes, setDocTypes] = useState(null)
  const [optPolicies, setOptPolicies] = useState([])
  const [loading, setLoading] = useState(false)
  const [opts, setOpts] = useState([])

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(500)
      if (!isCancelled && activityDrawer.clientId) {
        const data = await fetchClient()
        setClientInfo(data)
        setClient(data.id)
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
        const actions = await fetchActions()
        const doctypes = await fetchDocType()
        setOptPolicies(data)
        if (actions) {
          if (actions.AllowedValue.length > 0) {
            const newBase = actions.AllowedValue.map((x) => {
              return {
                id: x.__values__.Code,
                value: x.__values__.Description,
              }
            })
            setActivityActions(newBase)
          }
        }
        if (doctypes) {
          if (doctypes.AllowedValue.length > 0) {
            const newBase = doctypes.AllowedValue.map((x) => {
              return {
                id: x.__values__.Code,
                value: x.__values__.Description,
              }
            })
            setDocTypes(newBase)
          }
        }
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
    const res = await useNextApi('GET', `/api/ams360/valuelist/activityaction`)
    return res
  }

  const fetchDocType = async () => {
    const res = await useNextApi('GET', `/api/ams360/valuelist/doc360type`)
    return res
  }

  const closeDrawer = () => {
    const setDefault = {
      isOpen: false,
      clientId: null,
    }
    setActivityDrawer(setDefault)
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

  return (
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
      className={`fixed top-0 left-0 z-[9999999] flex h-full w-full`}
    >
      <div
        className={`fixed right-0 flex h-full w-full flex-col md:w-[500px] ${type}-shadow panel-theme-${type}`}
      >
        <div className="flex h-full flex-auto flex-col space-y-2 overflow-hidden py-4 lg:gap-2">
          <div className={`relative mb-2 flex w-full flex-col px-2`}>
            <div className="relative flex w-full flex-col md:flex-row md:justify-between md:pt-2">
              <p>New Activity / Suspense</p>
              <div className="flex items-center justify-end space-x-2">
                <Checkbox
                  color="primary"
                  checked={isActivity}
                  onChange={(e) => activityCheck(e)}
                  size="xs"
                >
                  Activity
                </Checkbox>
                <Checkbox
                  color="warning"
                  checked={isSuspense}
                  onChange={(e) => suspenseCheck(e)}
                  size="xs"
                >
                  Suspense
                </Checkbox>
              </div>
            </div>
            <div
              className="absolute top-0 right-5 flex md:hidden"
              onClick={() => closeDrawer()}
            >
              <div className="text-color-error">
                <AiOutlineClose />
              </div>
            </div>
            <div className={`bottom-border-flair pink-to-blue-gradient-1`} />
          </div>
          {activityDrawer.clientId && !clientInfo ? (
            <DrawerLoader />
          ) : (
            <div className="relative flex overflow-hidden">
              <div className="flex w-full flex-col space-y-4 overflow-y-auto">
                {clientInfo && activityDrawer.clientId ? (
                  <div className="flex w-full flex-col pl-4">
                    <div>
                      <PanelTitle title={`Client`} color="sky" />
                    </div>
                    <div className="flex">{clientInfo?.client_name}</div>
                  </div>
                ) : (
                  <div className="flex w-full flex-col pl-4">
                    <div>
                      <PanelTitle title={`Client`} color="sky" />
                    </div>
                    <div className="flex w-full ">
                      <SelectInput
                        loading={loading}
                        value={client}
                        opts={opts}
                        labelField={'client_name'}
                        placeholder={'Search for Client'}
                        filterable={true}
                        inputChange={(e) => setSearch(e)}
                        onChange={(v) => setClient(v)}
                        disabled={drawerTab == 2 && isSuspense && isActivity}
                      />
                    </div>
                  </div>
                )}
                {client && drawerTab == 1 ? (
                  <div className="flex w-full flex-col pl-4">
                    <div>
                      <PanelTitle title={`Policies`} color="indigo" />
                    </div>
                    <div className="flex w-full ">
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
                ) : null}
                {client && drawerTab == 1 ? (
                  <div className="flex w-full flex-col pl-4">
                    <div>
                      <PanelTitle title={`Activity Action`} color="orange" />
                    </div>
                    <div className="flex w-full ">
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
                ) : null}
                {client && isSuspense && drawerTab == 2 ? (
                  <div className="flex w-full flex-col pl-4">
                    <div>
                      <PanelTitle title={`Suspense Action`} color="orange" />
                    </div>
                    <div className="flex w-full ">
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
                ) : null}
                {client && drawerTab == 1 ? (
                  <div className="flex w-full flex-col px-4 pb-1">
                    <div>
                      <PanelTitle title={`Activity Description`} color="pink" />
                    </div>
                    <div
                      className={`flex w-full rounded-lg panel-flatter-${type}`}
                    >
                      <Textarea
                        fullWidth
                        placeholder="Write your activity here"
                        minRows={5}
                        onChange={(e) => setActivityDescription(e.target.value)}
                      />
                    </div>
                  </div>
                ) : null}
                {client && isSuspense && drawerTab == 2 ? (
                  <div className="flex w-full flex-col px-4 pb-1">
                    <div>
                      <PanelTitle title={`Suspense Description`} color="pink" />
                    </div>
                    <div
                      className={`flex w-full rounded-lg panel-flatter-${type}`}
                    >
                      <Textarea
                        fullWidth
                        placeholder="Write your suspense here"
                        minRows={5}
                        onChange={(e) => setSuspenseDescription(e.target.value)}
                      />
                    </div>
                  </div>
                ) : null}
                {client && drawerTab == 1 ? (
                  <div className="flex w-full flex-col px-4">
                    <div>
                      <PanelTitle title={`Attachments`} color="amber" />
                    </div>
                    <div className="flex flex-col space-y-2">
                      {sortedFiles().map((f) => (
                        <div
                          key={f.id}
                          className="flex w-full flex-col space-y-2"
                        >
                          <div className="flex w-full items-center">
                            <h4 className="flex w-full">{f.data.name}</h4>
                            <div className="flex w-full items-center justify-end">
                              <SelectInput
                                styling={`flex w-full min-w-[150px]`}
                                multiple={false}
                                value={f.action}
                                opts={docTypes}
                                labelField={'value'}
                                valueField={`value`}
                                keyField={`id`}
                                placeholder={'Select Document Type'}
                                filterable={true}
                                onChange={(v) => setFileDoctype(f.id, v)}
                              />
                            </div>
                          </div>
                          <div className="flex w-full flex-col">
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
                      <div className="flex w-full justify-center">
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
        <div className="flex w-full justify-end px-2 pt-1 pb-4">
          {isActivity && isSuspense ? (
            drawerTab == 1 ? (
              <Button
                color={!client ? 'primary' : 'gradient'}
                disabled={client ? false : true}
                onClick={() => setDrawerTab(2)}
                auto
              >
                Suspense
                {getConstantIcons('right')}
              </Button>
            ) : (
              <div className="flex w-full items-center justify-between">
                <Button
                  color={!client ? 'primary' : 'gradient'}
                  disabled={client ? false : true}
                  onClick={() => setDrawerTab(1)}
                  auto
                >
                  {getConstantIcons('left')}
                  Activity
                </Button>
                <Button
                  color={!isSubmitEnabled() ? 'primary' : 'gradient'}
                  disabled={!isSubmitEnabled()}
                  auto
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
  )
}

export default ActivityDrawer
