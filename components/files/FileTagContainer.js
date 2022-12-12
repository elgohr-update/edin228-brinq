import React from 'react'
import FileTag from './FileTag'

export default function FileTagContainer({files}) {
  return (
    <div className="flex flex-col w-full space-y-2 lg:flex-row lg:space-y-0 lg:flex-wrap lg:space-x-0 lg:gap-2">
        { files.map( file => (
            <FileTag file={file} key={file.id} />
        ))}
    </div>
  )
}
