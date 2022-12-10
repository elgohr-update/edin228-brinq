import { Loading } from '@nextui-org/react'
import React, { useState } from 'react'
import { getIcon, useNextApi } from '../../utils/utils'

export default function FileTag({ file }) {
  const [downloadUrl, setDownloadUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const getDownload = async () => {
    if (!downloadUrl) {
      setLoading(true)
      const data = await useNextApi(`GET`, `/api/files/${file.uid}/`)
      if (data) {
        setLoading(false)
        setDownloadUrl(data.url)
      }
    }
  }
  return (
    <div className={`flex h-full min-h-[20px] min-w-[50px] cursor-pointer items-center rounded-lg px-2 py-1 ${!downloadUrl ? 'bg-zinc-800/10 text-zinc-500' : 'bg-sky-800/10 text-sky-500'}`}>
      {downloadUrl ? (
        <a
          href={downloadUrl}
          target="_blank"
          className="flex items-center h-full space-x-1 text-xs"
        >
          <div>{getIcon('file')}</div>
          <div>{file.file_name}</div>
        </a>
      ) : loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <Loading type="points-opacity" color="currentColor" size="md" />
        </div>
      ) : (
        <div
          onClick={() => getDownload()}
          className="flex items-center h-full space-x-1 text-xs"
        >
          <div>{getIcon('file')}</div>
          <div>{file.file_name}</div>
        </div>
      )}
    </div>
  )
}
