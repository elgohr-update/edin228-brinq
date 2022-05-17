import React from 'react'
import TagBasic from './TagBasic'
import TagSimple from './TagSimple'

export default function TagContainer({ tags, simple = false }) {
  return (
    <div className="flex w-full items-center">
      <div className={`flex w-full flex-auto flex-wrap space-x-2`}>
        {simple
          ? tags?.map((x) => {
              return <TagSimple key={x.id} text={x.name} color={x.color} />
            })
          : tags?.map((x) => {
              return <TagBasic key={x.id} text={x.name} color={x.color} />
            })}
      </div>
    </div>
  )
}
