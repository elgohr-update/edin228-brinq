import { Button, Loading, Modal, useTheme } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import {
  getTranscriptCompleted,
  postTranscriptBlob,
  postTranscriptUrl,
} from '../../pages/api/assemblyai'
import {
  getRecordingContent,
  getVoicemail,
  getVoicemailDownload,
} from '../../utils/ringcentral'
import {
  checkWidth,
  formatPhoneNumber,
  getFormattedDateTime,
  getFormattedDuration,
  getIcon,
  timeout,
} from '../../utils/utils'
import { motion } from 'framer-motion'
import NewActivityModal from '../activity/NewActivityModal'

function CallLogCard({ record }) {
  const { type, isDark } = useTheme()
  const [transcriptLoading, setTranscriptLoading] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [transcriptData, setTranscriptData] = useState(null)
  const [trancriptModal, setTrancriptModal] = useState(false)
  const outbound = record?.direction == 'Outbound'
  const hasRecording = record?.recording
  const hasMessage = record?.message
  const isMissedCall =
    record?.result == 'Stopped' || record?.result == 'Voicemail'
  const [showInfo, setShowInfo] = useState(false)
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [preLoadFiles, setPreLoadFiles] = useState([])
  const hasName = outbound ? record.to.name : record.from.name

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(1000)
      if (!isCancelled && transcriptData) {
        const _file = createTranscriptFile()
        setPreLoadFiles([...preLoadFiles, _file])
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [transcriptData])

  const getRecordingDownload = async (data = null) => {
    setDownloadLoading(true)
    const dl = await getRecordingContent(data.contentUri)
    const url = window.URL.createObjectURL(new Blob([dl]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `PhoneRecording.wav`)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
    setDownloadLoading(false)
  }

  const getRecordingTranscript = async (data = null) => {
    const dl = await getRecordingContent(data.contentUri)
    sendForTranscript(new Blob([dl]))
  }
  const getVoicemailTranscript = async (data = null) => {
    const voicemail = await getVoicemail(data.message.uri)
    if (voicemail) {
      const dl = await getVoicemailDownload(voicemail.attachments[0].uri)
      sendForTranscript(new Blob([dl]))
    }
  }
  const getProcessedTranscript = async (data) => {
    let transcript = await getTranscriptCompleted(data.id)
    if (transcript) {
      setTranscriptData(transcript)
      setTranscriptLoading(false)
    }
  }
  const processTrancriptUrl = async (assemblyUrl) => {
    const submitUrl = await postTranscriptUrl(assemblyUrl)
    if (submitUrl) {
      getProcessedTranscript(submitUrl)
    }
  }
  const sendForTranscript = async (_file) => {
    setTranscriptLoading(true)
    const submission = await postTranscriptBlob(_file)
    if (submission) {
      processTrancriptUrl(submission)
    }
  }
  const downloadVoicemail = async (contentUri) => {
    const dl = await getVoicemailDownload(contentUri)
    const url = window.URL.createObjectURL(new Blob([dl]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `VoiceMail.wav`)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
    setDownloadLoading(false)
  }
  const downloadTranscript = () => {
    const formatted = JSON.stringify(transcriptData.text)
    const data = new Blob([formatted], { type: 'text/plain' })
    const url = window.URL.createObjectURL(data)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `transcript.txt`)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
  }
  const createTranscriptFile = () => {
    const formatted = JSON.stringify(transcriptData.text)
    const data = new File([formatted], `${record.id}_Transcript.txt`, {
      type: 'text/plain',
    })
    return data
  }

  const getVoicemailInfo = async (contentUri) => {
    setDownloadLoading(true)
    const dl = await getVoicemail(contentUri)
    downloadVoicemail(dl.attachments[0].uri)
  }

  const openInfo = () => {
    setShowInfo(!showInfo)
  }

  const downloadFilesToPassBlobs = async () => {
    if (preLoadFiles.length < 2) {
      if (hasRecording) {
        const dl = await getRecordingContent(record.recording.contentUri)
        const _file = new File([dl], `${record.id}_Recording.wav`, {
          type: 'audio/wav',
        })
        if (!transcriptData) {
          sendForTranscript(_file)
          setPreLoadFiles([_file])
        } else {
          const transcriptFile = createTranscriptFile()
          setPreLoadFiles([transcriptFile, _file])
        }
      } else if (hasMessage) {
        const dl = await getVoicemail(record.message.uri)
        const _file = new File(
          [dl.attachments[0].uri],
          `${record.id}_Voicemail.wav`,
          {
            type: 'audio/wav',
          }
        )
        if (!transcriptData) {
          sendForTranscript(_file)
        } else {
          createTranscriptFile()
        }
        setPreLoadFiles([...preLoadFiles, _file])
      }
    }
  }

  const createActivity = async () => {
    downloadFilesToPassBlobs()
    setShowActivityModal(true)
  }

  const closeActivityModal = () => {
    setPreLoadFiles([])
    setShowActivityModal(false)
  }

  return (
    <div
      className={`relative flex w-full cursor-pointer flex-col rounded-lg p-2 transition duration-200 ease-out  ${
        showInfo
          ? isDark
            ? 'bg-zinc-600/20'
            : 'bg-zinc-400/20'
          : isDark
          ? 'hover:bg-zinc-600/20'
          : 'hover:bg-zinc-400/20'
      }`}
    >
      <div className="flex items-center w-full" onClick={openInfo}>
        <span className="min-w-[84px] px-2 text-xs">
          {outbound ? (
            <div className="flex flex-col items-center">
              <div
                className={`${
                  isMissedCall ? 'text-red-500' : 'text-green-500'
                }`}
              >
                {getIcon('phoneOutbound')}
              </div>
              <div className="mt-2 text-xs opacity-80">
                {getFormattedDuration(record.duration)}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div
                className={`${
                  isMissedCall ? 'text-red-500' : 'text-green-500'
                }`}
              >
                {getIcon('phoneInbound')}
              </div>
              <div className="mt-2 text-xs opacity-80">
                {getFormattedDuration(record.duration)}
              </div>
            </div>
          )}
        </span>
        <div className="flex flex-col">
          {hasName ? (
            <div className="text-sm font-bold">
              {outbound ? record.to.name : record.from.name}
            </div>
          ) : (
            <div className="text-sm font-bold">Unknown</div>
          )}
          <div className="flex w-full">
            <div className="text-xs font-bold opacity-80">
              {outbound && record.to.phoneNumber
                ? formatPhoneNumber(record.to.phoneNumber)
                : formatPhoneNumber(record.from.phoneNumber)}
            </div>
            {outbound ? (
              record.to.extensionNumber ? (
                <div className="text-xs opacity-80">
                  <span>Ext.</span>
                  {outbound
                    ? record.to.extensionNumber
                    : record.from.extensionNumber}
                </div>
              ) : record.from.extensionNumber ? (
                <div className="text-xs opacity-80">
                  <span>Ext.</span>
                  {outbound
                    ? record.to.extensionNumber
                    : record.from.extensionNumber}
                </div>
              ) : null
            ) : null}
          </div>

          <div className="text-xs opacity-80">
            {getFormattedDateTime(record.startTime)}
          </div>
        </div>
        <div className="absolute top-[5px] right-[10px]">
          {hasRecording ? (
            <div>
              <span className="text-xs text-rose-500">{getIcon('record')}</span>
            </div>
          ) : null}

          {hasMessage ? (
            <div>
              <span className="text-xs text-yellow-500">
                {getIcon('voicemail')}
              </span>
            </div>
          ) : null}
        </div>
      </div>
      {showInfo ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { opacity: 1 },
            hidden: { opacity: 0 },
          }}
          transition={{ ease: 'easeOut', duration: 0.5 }}
          className="flex w-[300px] flex-col p-2 xl:w-[400px]"
        >
          <div className="flex flex-col w-full mb-2">
            <div className="mb-2 text-xs opacity-60">Actions</div>
            <div className="flex w-full space-x-2">
              <div>
                <Button
                  color="gradient"
                  auto
                  size="xs"
                  onClick={createActivity}
                >
                  <span className="text-xs">
                    {getIcon('activity')} Activity
                  </span>
                </Button>
              </div>
              {hasRecording ? (
                <div className="flex space-x-2">
                  <Button
                    color="error"
                    auto
                    disabled={downloadLoading}
                    size="xs"
                    onClick={() => {
                      getRecordingDownload(record.recording)
                    }}
                  >
                    {downloadLoading ? (
                      <Loading color="currentColor" size="xs" />
                    ) : (
                      <span className="text-xs">
                        {getIcon('record')} Recording
                      </span>
                    )}
                  </Button>
                  <Button
                    color="primary"
                    disabled={!transcriptData}
                    auto
                    size="xs"
                    onClick={() => {
                      downloadTranscript()
                    }}
                  >
                    <span className="text-xs">
                      {getIcon('paperText')} Transcript
                    </span>
                  </Button>
                </div>
              ) : null}
              {hasMessage ? (
                <div>
                  <Button
                    color="warning"
                    disabled={downloadLoading}
                    auto
                    size="xs"
                    onClick={() => {
                      getVoicemailInfo(record.message.uri)
                    }}
                  >
                    {downloadLoading ? (
                      <Loading color="currentColor" size="xs" />
                    ) : (
                      <span className="text-xs">
                        {getIcon('voicemail')} Voicemail
                      </span>
                    )}
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
          {hasRecording ? (
            !transcriptData && !transcriptLoading ? (
              <div className="w-[100px]">
                <Button
                  size="xs"
                  ghost
                  onClick={() => getRecordingTranscript(record.recording)}
                >
                  <div>Load Transcript</div>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="mb-2 text-xs opacity-60">
                  Recording Transcript
                </div>
                {transcriptLoading ? (
                  <Loading color="currentColor" size="xs" />
                ) : (
                  <div className="text-sm">{transcriptData?.text}</div>
                )}
              </div>
            )
          ) : null}
          {hasMessage ? (
            !transcriptData && !transcriptLoading ? (
              <div className="w-[100px]">
                <Button
                  size="xs"
                  ghost
                  onClick={() => getVoicemailTranscript(record)}
                >
                  Load Transcript
                </Button>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="mb-2 text-xs opacity-60">
                  Voicemail Transcript
                </div>
                {transcriptLoading ? (
                  <Loading color="currentColor" size="xs" />
                ) : (
                  <div className="text-sm">{transcriptData?.text}</div>
                )}
              </div>
            )
          ) : null}
        </motion.div>
      ) : null}
      {transcriptData ? (
        <Modal
          closeButton
          aria-labelledby="modal-title"
          open={trancriptModal}
          onClose={() => setTrancriptModal(false)}
        >
          <Modal.Header>Trancript</Modal.Header>
          <Modal.Body>{transcriptData.text}</Modal.Body>
          <Modal.Footer>
            <div className="flex items-center justify-center w-full space-x-2">
              <Button
                color="primary"
                flat
                auto
                onClick={() => downloadTranscript()}
              >
                Download
              </Button>
              <Button
                color="error"
                flat
                auto
                onClick={() => setTrancriptModal(false)}
              >
                Close
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      ) : null}
      <NewActivityModal
        open={showActivityModal}
        callBack={closeActivityModal}
        preLoadFiles={preLoadFiles}
        callData={record}
        transcriptData={transcriptData}
      />
    </div>
  )
}

export default CallLogCard
