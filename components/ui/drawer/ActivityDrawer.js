import { Button, Textarea, useTheme } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import HiddenBackdrop from '../../util/HiddenBackdrop'
import { useActivityDrawerContext } from '../../../context/state'
import { BsBox, BsChevronDown, BsChevronUp } from 'react-icons/bs'
import { timeout, useNextApi } from '../../../utils/utils'
import { useRouter } from 'next/router'
import PanelTitle from '../title/PanelTitle'
import SelectInput from '../select/SelectInput'
import DrawerLoader from '../loaders/DrawerLoader'

const ActivityDrawer = () => {
  const { activityDrawer, setActivityDrawer } = useActivityDrawerContext()
  const { type } = useTheme()
  const router = useRouter()

  const [clientInfo, setClientInfo] = useState(null)
  const [search, setSearch] = useState(null)
  const [client, setClient] = useState(null)
  const [policies, setPolicies] = useState(null)
  const [activityAction, setActivityAction] = useState(null)

  const [activityActions, setActivityActions] = useState(null)
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

  const closeDrawer = () => {
    const setDefault = {
      isOpen: false,
      clientId: null,
    }
    setActivityDrawer(setDefault)
  }

  return (
    <div className={`fixed top-0 left-0 z-[9999999] flex h-full w-full`}>
      <div
        className={`fixed right-0 flex h-full w-full flex-col md:w-[500px] ${type}-shadow panel-theme-${type}`}
      >
        <div className="flex h-full flex-1 flex-col gap-2 py-4">
          <div className={`relative mb-2 flex w-full px-2`}>
            <div className="relative flex w-full flex-col md:flex-row md:pt-2">
              New Activity / Suspense
            </div>
            <div className={`bottom-border-flair pink-to-blue-gradient-1`} />
          </div>
          {activityDrawer.clientId && !clientInfo ? (
            <DrawerLoader />
          ) : (
            <div className="flex w-full flex-col space-y-4">
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
                    />
                  </div>
                </div>
              )}
              {client ? (
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
              {client ? (
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
                      onChange={(v) => setActivityAction(v)}
                    />
                  </div>
                </div>
              ) : null}
              {client ? (
                <div className="flex w-full flex-col px-4">
                  <div>
                    <PanelTitle title={`Activity Description`} color="pink" />
                  </div>
                  <Textarea
                    placeholder="Write your activity here"
                    minRows={5}
                  />
                </div>
              ) : null}
            </div>
          )}
        </div>
        <div className="flex w-full justify-end px-2 pt-1 pb-4">
          <Button
            color={!client ? 'primary' : 'gradient'}
            disabled={client ? false : true}
            className="w-full"
          >
            Create
          </Button>
        </div>
      </div>
      {activityDrawer.isOpen ? (
        <HiddenBackdrop onClick={() => closeDrawer()} />
      ) : null}
    </div>
  )
}

export default ActivityDrawer
