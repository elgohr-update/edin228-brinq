import React from 'react'
import FileTag from './FileTag'

export default function FileTagContainer({files}) {
  return (
    <div className="flex flex-wrap w-full space-y-2 lg:space-y-0 lg:gap-2">
        { files.map( file => (
            <FileTag file={file} key={file.id} />
        ))}
    </div>
  )
}
