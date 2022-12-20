import { Textarea } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import uuid from 'react-uuid'
import { useAMS360ValueListContext } from '../../context/state'
import { sortByProperty, timeout, useNextApi } from '../../utils/utils'
import FileUploaderContainer from '../files/FileUploaderContainer'
import SelectInput from '../ui/select/SelectInput'
import PanelTitle from '../ui/title/PanelTitle'

function ActivityFiles({
  callBack = null,
  client = null,
  initialFiles = null,
  disabled = false,
}) {
  const [files, setFiles] = useState([])
  const [docTypes, setDocTypes] = useState(null)
  const { AMS360ValueList, setAMS360ValueList } = useAMS360ValueListContext()

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(1000)
      if (!isCancelled && initialFiles) {
        const base = Array.from(initialFiles)
        const adjustedFiles = base.map((x) => {
          return {
            id: uuid(),
            data: x,
            description: '',
            private: true,
            action: '',
          }
        })
        const newFiles = [...adjustedFiles]
        setFiles(newFiles)
        if (callBack) {
          callBack(newFiles)
        }
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [initialFiles])

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(1000)
      if (!isCancelled && client) {
        await fetchDocType()
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [client])

  const fetchDocType = async () => {
    if (!AMS360ValueList.docType) {
      const res = await useNextApi('GET', `/api/activity/doctype`)
      if (res) {
        const newBase = res?.map((x) => {
          return {
            id: x.code,
            value: x.value,
          }
        })
        setDocTypes(newBase)
        setAMS360ValueList({ ...AMS360ValueList, docType: newBase })
        return newBase
      }
    }
    setDocTypes(AMS360ValueList.docType)
    return AMS360ValueList.docType
  }

  const onSave = (e) => {
    setFiles(e)
    if (callBack) {
      callBack(e)
    }
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
    if (callBack) {
      callBack(newFiles)
    }
  }

  const setFileDoctype = (fid, action) => {
    const fil = files.find((x) => x.id == fid)
    fil.action = action
    const fils = files.filter((x) => x.id != fid)
    const newFiles = [...fils, fil]
    setFiles(newFiles)
    if (callBack) {
      callBack(newFiles)
    }
  }

  return (
    <div
      className={`flex w-full flex-col px-4 pb-1 ${
        disabled ? 'opacity-20' : ''
      }`}
    >
      <div>
        <PanelTitle title={`Attachments`} color="amber" />
      </div>
      <div className="flex flex-col space-y-2">
        {sortedFiles().map((f) => (
          <div key={f.id} className="flex flex-col w-full space-y-2">
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
                  disabled={disabled}
                  onChange={(v) => setFileDoctype(f.id, v)}
                />
              </div>
            </div>
            <div className="flex flex-col w-full">
              <Textarea
                value={f.description}
                placeholder="Attachment Description"
                minRows={1}
                bordered
                disabled={disabled}
                borderWeight={'light'}
                onChange={(e) => setFileDescription(f.id, e.target.value)}
              />
            </div>
          </div>
        ))}
        <div className="flex justify-center w-full">
          <FileUploaderContainer
            initialFiles={initialFiles}
            showLargeButton
            onSave={(e) => onSave(e)}
          />
        </div>
      </div>
    </div>
  )
}

export default ActivityFiles
