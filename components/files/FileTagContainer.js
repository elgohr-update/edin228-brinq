import React from 'react'
import FileTag from './FileTag'

export default function FileTagContainer({files}) {
  return (
    <div className="flex flex-wrap w-full space-x-2 lg:space-x-0 lg:gap-2">
        { files.map( file => (
            <FileTag file={file} key={file.id} />
        ))}
    </div>
  )
}
