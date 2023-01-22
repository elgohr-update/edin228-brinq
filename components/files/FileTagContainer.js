import React from 'react'
import FileTag from './FileTag'

export default function FileTagContainer({files}) {
  return (
    <div className="flex flex-col w-full space-y-2 xl:flex-row xl:space-y-0 xl:flex-wrap xl:space-x-0 xl:gap-2">
        { files.map( file => (
            <FileTag file={file} key={file.id} />
        ))}
    </div>
  )
}
