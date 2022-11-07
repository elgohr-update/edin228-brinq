import { Button, Loading, Modal, useTheme } from '@nextui-org/react'
import React, { useState } from 'react'
import {
  getTranscriptCompleted,
  postTranscriptBlob,
  postTranscriptUrl,
} from '../../pages/api/assemblyai'
import { getRecording, getVoicemailDownload } from '../../utils/ringcentral'
import {
  getFormattedDateTime,
  getFormattedDuration,
  getIcon,
} from '../../utils/utils'

function CallLogCard({ record }) {
  const { type } = useTheme()
  const [transcriptLoading, setTranscriptLoading] = useState(false)
  const [transcriptData, setTranscriptData] = useState(null)
  const [trancriptModal, setTrancriptModal] = useState(false)
  const outbound = record.direction == 'Outbound'
  const hasRecording = record.recording
  const hasMessage = record.message
  const isMissedCall =
    record.result == 'Stopped' || record.result == 'Voicemail'

  const getRecordingDownload = async (data = null) => {
    const dl = await getRecording(data.id)
    const url = window.URL.createObjectURL(new Blob([dl]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `PhoneRecording.wav`)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
  }

  const getRecordingTranscript = async (data = null) => {
    const dl = await getRecording(data.id)
    sendForTranscript(new Blob([dl]))
  }

  const getProcessedTranscript = async (data) => {
    let transcript = await getTranscriptCompleted(data.id)
    if (transcript) {
      setTranscriptData(transcript)
      setTranscriptLoading(false)
      setTrancriptModal(true)
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

  const getVoicemailInfo = async (contentUri) => {
    const dl = await getVoicemail(contentUri)
    downloadVoicemail(dl.attachments[0].uri)
  }

  return (
    <div
      className={`relative flex w-full rounded-lg p-2 transition duration-200 ease-out hover:bg-gray-600/20`}
    >
      <div className="flex items-center w-full">
        <span className="px-4 mr-2 text-xs">
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
          <div className="text-sm font-bold">
            {outbound ? record.to.name : record.from.name}
          </div>
          <div className="text-xs opacity-80">
            {outbound && record.to.phoneNumber
              ? record.to.phoneNumber
              : record.from.phoneNumber}
          </div>
          <div className="text-xs opacity-80">
            Ext.{' '}
            {outbound ? record.to.extensionNumber : record.from.extensionNumber}
          </div>
          <div className="text-xs opacity-80">
            {getFormattedDateTime(record.startTime)}
          </div>
        </div>
      </div>
      <div className="absolute top-[5px] right-[5px]">
        {hasRecording ? (
          <div className="flex space-x-1">
            <Button
              color="error"
              auto
              ghost
              size="xs"
              onClick={() => {
                getRecordingDownload(record.recording)
              }}
            >
              <span className="text-xs">{getIcon('record')}</span>
            </Button>
            {transcriptData ? (
              <Button
                color="primary"
                disabled={transcriptLoading}
                auto
                ghost
                size="xs"
                onClick={() => {
                  setTrancriptModal(true)
                }}
              >
                <span className="text-xs">{getIcon('paperText')}</span>
              </Button>
            ) : (
              <Button
                color="primary"
                disabled={transcriptLoading}
                auto
                ghost
                size="xs"
                onClick={() => {
                  getRecordingTranscript(record.recording)
                }}
              >
                {transcriptLoading ? (
                  <Loading color="currentColor" size="xs" />
                ) : (
                  <span className="text-xs">{getIcon('paperText')}</span>
                )}
              </Button>
            )}
          </div>
        ) : null}
        {hasMessage ? (
          <div>
            <Button
              color="warning"
              auto
              ghost
              size="xs"
              onClick={() => {
                getVoicemailInfo(record.message.uri)
              }}
            >
              <span className="text-xs">{getIcon('voicemail')}</span>
            </Button>
          </div>
        ) : null}
      </div>
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
      {record ? <div></div> : null}
    </div>
  )
}

export default CallLogCard
