import { Button, Checkbox, Loading, Modal, useTheme } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import {
  useAgencyContext,
  useAMS360ValueListContext,
  useReloadContext,
} from '../../context/state'
import {
  formatPhoneNumber,
  getFormattedDateTime,
  getFormattedDuration,
  timeout,
  useApiFormData,
  useNextApi,
} from '../../utils/utils'
import BrinqInput from '../ui/input/BrinqInput'
import BrinqSelect from '../ui/select/BrinqSelect'
import BrinqTextArea from '../ui/textarea/BrinqTextArea'
import ActivityFiles from './ActivityFiles'
import { DateTime } from 'luxon'

function NewActivityModal({
  open = false,
  callBack = null,
  preLoadClient = null,
  preLoadPolicy = null,
  callData = null,
  preLoadFiles = null,
  transcriptData = null,
  createSuspenseOnly = null,
}) {
  const { AMS360ValueList, setAMS360ValueList } = useAMS360ValueListContext()
  const { reload, setReload } = useReloadContext()
  const { agency, setAgency } = useAgencyContext()
  const [isActivity, setIsActivity] = useState(true)
  const [isSuspense, setIsSuspense] = useState(false)
  const [isAMSActivity, setIsAMSActivity] = useState(true)
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
  const [optPolicies, setOptPolicies] = useState([])
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()

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
      const res = await useNextApi('GET', `/api/activity/actions`)
      if (res) {
        const newBase = res?.map((x) => {
          return {
            id: x.code,
            value: x.value,
          }
        })
        setActivityActions(newBase)
        setAMS360ValueList({ ...AMS360ValueList, activityAction: newBase })
        return newBase
      }
    }
    setActivityActions(AMS360ValueList.activityAction)
    return AMS360ValueList.activityAction
  }
  const fetchUserInfo = () => {
    const users = agency?.users?.map((x) => {
      return { id: x.id, name: x.name, code: x.ams360_employee_code }
    })
    setSuspenseUsersOptions(users)
  }

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(1000)
      if (!isCancelled && preLoadClient) {
        setClient(preLoadClient.id)
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [preLoadClient])

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(1000)
      if (!isCancelled && preLoadPolicy) {
        setPolicies([preLoadPolicy])
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [preLoadPolicy])

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(1000)
      if (!isCancelled && createSuspenseOnly) {
        setIsActivity(false)
        setIsSuspense(true)
        setIsAMSActivity(false)
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [createSuspenseOnly])

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(1000)
      if (!isCancelled && client) {
        setLoading(true)
        const data = await fetchPolicies()
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
    let isCancelled = false
    const handleChange = async () => {
      await timeout(1000)
      if (!isCancelled && open) {
        await fetchActions()
        fetchUserInfo()
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [open])

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(1000)
      if (!isCancelled && callData) {
        const outbound = callData.direction == 'Outbound'
        const callDirection = `${
          outbound ? 'Outbound' : 'Inbound'
        } Call ${getFormattedDateTime(
          callData.startTime
        )} ${getFormattedDuration(callData.duration)}`
        const fromName = `From: ${
          callData.from.name ? callData.from.name : 'Unknown'
        }`
        const fromNumber = callData.from.phoneNumber
          ? `Phone Number: ${
              callData.from.phoneNumber
                ? formatPhoneNumber(callData.from.phoneNumber)
                : null
            } \n`
          : ''
        const toName = `To: ${callData.to.name ? callData.to.name : 'Unknown'}`
        const toNumber = callData.to.phoneNumber
          ? `Phone Number: ${
              callData.to.phoneNumber
                ? formatPhoneNumber(callData.to.phoneNumber)
                : null
            } \n`
          : ''
        const description = `${callDirection} \n${fromName} \n${fromNumber}${toName} \n${toNumber}`
        setActivityAndSuspenseDescription(description)
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [callData])

  const activityCheck = (e) => {
    if (!e) {
      if (isSuspense) {
        setIsActivity(e)
        setIsAMSActivity(e)
      }
    } else {
      setIsActivity(e)
      setIsAMSActivity(e)
    }
  }

  const suspenseCheck = (e) => {
    if (!e && !isActivity) {
      setIsActivity(true)
      setIsSuspense(false)
    } else {
      setIsSuspense(e)
    }
  }

  const setActivityAndSuspenseAction = (e) => {
    setActivityAction(e)
    setSuspenseAction(e)
  }
  const setActivityAndSuspenseDescription = (e) => {
    setActivityDescription(e)
    setSuspenseDescription(e)
  }

  const addTranscriptToDescription = () => {
    const transcriptText = transcriptData?.text
    const newDescription = `${activityDescription} \n${transcriptText}`
    setActivityAndSuspenseDescription(newDescription)
  }

  const getSubmissionFormData = () => {
    const activitySubmission = {
      clientId: client,
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
    setLoading(true)
    const formData = getSubmissionFormData()
    const url =
      files?.length > 0
        ? `/activity/brinq-activity`
        : `/activity/brinq-activity-no-files`
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
          ? `/activity/ams360-activity`
          : `/activity/ams360-activity-no-files`
      const res = await useApiFormData(
        'POST',
        url,
        `${session.accessToken}`,
        formData
      )
      if (res) {
        return true
      }
    }
  }

  const submitSuspense = async () => {
    const formData = getSubmissionFormData()
    const url = `/activity/suspense`
    const res = await useApiFormData(
      'POST',
      url,
      `${session.accessToken}`,
      formData
    )
    if (res) {
      return true
    }
  }

  const submitActivity = async () => {
    if (isActivity && isSuspense) {
      const bSubmission = await submitBrinqActivity()
      if (isAMSActivity) {
        await submitAmsActivity(bSubmission)
      }
      if (bSubmission) {
        setLoading(false)
        setReload({
          ...reload,
          activities: true,
        })
        setDefault()
      }
      if (isSuspense) {
        await submitSuspense()
      }
    } else if (isActivity && !isSuspense) {
      const bSubmission = await submitBrinqActivity()
      if (isAMSActivity) {
        await submitAmsActivity(bSubmission)
      }
      if (bSubmission) {
        setLoading(false)
        setReload({
          ...reload,
          activities: true,
        })
        setDefault()
      }
    } else if (isSuspense && !isActivity) {
      const suspenseSubmission = await submitSuspense()
      if (suspenseSubmission) {
        setLoading(false)
        setReload({
          ...reload,
          activities: true,
        })
        setDefault()
      }
    }
  }

  const setDefault = () => {
    setIsActivity(true)
    setIsSuspense(false)
    setIsAMSActivity(true)
    setClient(null)
    setPolicies([])
    setActivityAction(null)
    setActivityDescription(null)
    setSuspenseAction(null)
    setSuspenseDescription(null)
    setSuspenseDate(null)
    setSuspenseUsers(null)
    setSuspenseUsersOptions(null)
    setFiles([])
    setActivityActions(null)
    setOptPolicies(null)

    callBack()
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
      isSuspense &&
      suspenseDescription != null &&
      suspenseAction != null &&
      suspenseDate != null
    return client && isOk()
  }

  return (
    <Modal
      closeButton
      noPadding
      scroll
      width={'800px'}
      className={'flex w-full items-center justify-center'}
      aria-labelledby="modal-title"
      open={open}
      onClose={setDefault}
    >
      <Modal.Header className="flex flex-col w-full px-4">
        <div className="text-xs tracking-widest opacity-60">New Activity</div>
        <div className="flex items-center justify-center py-2 space-x-2">
          <Checkbox
            color="primary"
            defaultSelected={isActivity}
            isSelected={isActivity}
            onChange={(e) => activityCheck(e)}
            size="xs"
          >
            <div className="text-xs tracking-widest">Activity</div>
          </Checkbox>
          <Checkbox
            color="secondary"
            defaultSelected={isSuspense}
            isSelected={isSuspense}
            onChange={(e) => suspenseCheck(e)}
            size="xs"
          >
            <div className="text-xs tracking-widest">Suspense</div>
          </Checkbox>
        </div>
        <div className="relative flex flex-col w-full">
          <div className="w-full mb-2">
            {!preLoadClient ? (
              <BrinqSelect
                title="Client"
                placeholder="Search and Select Client"
                callBack={setClient}
                useSearch={true}
                searchClients={true}
                labelField={'client_name'}
                filterable={true}
              />
            ) : (
              <div className="py-4 text-lg font-bold">{preLoadClient.name}</div>
            )}
          </div>
          <div className="relative flex items-center justify-center w-full mb-4">
            <div className="search-border-flair pink-to-blue-gradient-1 !relative z-30 flex w-[80%] justify-center" />
          </div>
        </div>
      </Modal.Header>
      <Modal.Body className="flex flex-col w-full px-4">
        <div className="flex flex-col w-full">
          <BrinqSelect
            title="Policies"
            color="indigo"
            placeholder="Select policies"
            initialOptions={optPolicies}
            callBack={setPolicies}
            labelField={'policy_number'}
            filterable={true}
            multiple={true}
            useDetail={true}
            detailField={'policy_type'}
            disabled={client ? false : true}
          />
          <div className="flex flex-col w-full py-2 lg:flex-row">
            {isActivity ? (
              <div className="flex flex-col w-full pb-4">
                {isSuspense ? (
                  <div className="px-4 mb-2 text-xs tracking-widest opacity-60">
                    Activity
                  </div>
                ) : null}

                <BrinqSelect
                  title="Activity Action"
                  color="orange"
                  placeholder="Select Activity Action"
                  initialOptions={activityActions}
                  callBack={setActivityAndSuspenseAction}
                  labelField={'value'}
                  valueField={`value`}
                  filterable={true}
                  multiple={false}
                  disabled={client ? false : true}
                />
                <div className="relative">
                  <BrinqTextArea
                    title="Activity Description"
                    color="pink"
                    placeholder="Write your activity description here"
                    callBack={setActivityAndSuspenseDescription}
                    disabled={client ? false : true}
                    initialValue={activityDescription}
                    minRows={10}
                    maxRows={20}
                  />
                  {transcriptData ? (
                    <div className="absolute flex justify-end w-full px-4">
                      <Button
                        auto
                        ghost
                        disabled={client ? false : true}
                        size="xs"
                        onClick={() => addTranscriptToDescription()}
                      >
                        Add Transcript?
                      </Button>
                    </div>
                  ) : null}
                </div>

                <ActivityFiles
                  disabled={client ? false : true}
                  callBack={setFiles}
                  client={client}
                  initialFiles={preLoadFiles}
                />
              </div>
            ) : null}
            {isSuspense ? (
              <div className="flex flex-col w-full pb-4">
                <div className="px-4 mb-2 text-xs tracking-widest opacity-60">
                  Suspense
                </div>

                <BrinqSelect
                  title="Suspense Action"
                  color="orange"
                  placeholder="Select Suspense Action"
                  initialOptions={activityActions}
                  callBack={setSuspenseAction}
                  labelField={'value'}
                  valueField={`value`}
                  filterable={true}
                  multiple={false}
                  disabled={client ? false : true}
                  initialValue={suspenseAction}
                />
                <BrinqTextArea
                  title="Suspense Description"
                  color="pink"
                  placeholder="Write your suspense description here"
                  callBack={setSuspenseDescription}
                  disabled={client ? false : true}
                  initialValue={suspenseDescription}
                  minRows={10}
                  maxRows={20}
                />
                <BrinqInput
                  title="Suspense Date"
                  color="lime"
                  placeholder="Set the suspense date"
                  callBack={setSuspenseDate}
                  inputType="date"
                  underlined={false}
                  borderd={true}
                  disabled={client ? false : true}
                />
                <BrinqSelect
                  title="Suspense Assigned To"
                  color="blue"
                  placeholder="Assign to users to Suspense"
                  initialOptions={suspenseUsersOptions}
                  callBack={setSuspenseUsers}
                  labelField={'name'}
                  filterable={true}
                  multiple={true}
                  disabled={client ? false : true}
                  initialUser={session.user.id}
                />
              </div>
            ) : null}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer autoMargin={false} className="w-full p-4">
        <div className="w-full">
          <Button
            disabled={loading || !isSubmitEnabled()}
            auto
            color="gradient"
            className="w-full"
            onClick={() => submitActivity()}
          >
            {loading ? (
              <Loading type="points-opacity" color="currentColor" size="md" />
            ) : (
              <div>Create</div>
            )}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default NewActivityModal
