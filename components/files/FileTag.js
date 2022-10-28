import React from 'react'
import { getIcon, useNextApi } from '../../utils/utils'

export default function FileTag({ file }) {
  const getDownload = async () => {
    const data = await useNextApi(`GET`, `/api/files/${file.uid}/`)
    if (data) {
      window.open(data.url)
    }
  }
  return (
    <div className="flex  cursor-pointer items-center rounded-lg bg-sky-800/10 px-2 py-1 text-sky-500">
      <div
        className="flex items-center space-x-1 text-xs"
        onClick={() => getDownload()}
      >
        <div>{getIcon('file')}</div>
        <div>{file.file_name}</div>
      </div>
    </div>
  )
}
