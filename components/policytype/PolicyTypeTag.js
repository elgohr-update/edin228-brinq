import { Button, Input, Popover, Radio } from '@nextui-org/react'
import React, { useState } from 'react'
import { getConstantIcons } from '../../utils/utils'
import TagBasic from '../ui/tag/TagBasic'

export default function PolicyTypeTag({ pt, isStarred, onClick }) {
  const [name, setName] = useState(pt.name)
  const [tag, setTag] = useState(pt.tag)
  const [line, setLine] = useState(null)

  const getTagColor = () => {
    return pt.starred ? 'blue' : 'def'
  }

  const submitChanges = async () => {
      const bundle = {
        name,
        tag,
        line
      }
      onClick(pt.id,bundle)
  }

  return (
    <div key={pt.id} className="m-1 flex items-center">
      <div onClick={() => onClick(pt.id)}>
        <TagBasic
          text={pt.tag}
          tooltip
          tooltipContent={pt.name}
          color={isStarred ? getTagColor() : `def`}
        />
      </div>
      <Popover placement={'top'}>
        <Popover.Trigger>
          <div className="cursor-pointer">{getConstantIcons('edit')}</div>
        </Popover.Trigger>
        <Popover.Content>
          <div className="flex flex-col space-y-2 p-2">
            <Input
              clearable
              underlined
              label="Name"
              size="xs"
              initialValue={pt.name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              clearable
              underlined
              size="xs"
              label="Tag"
              initialValue={pt.tag}
              onChange={(e) => setTag(e.target.value)}
            />
            <Radio.Group
              value={pt.cl ? 'CL' : pt.pl ? 'PL' : 'B'}
              onChange={(e) => setLine(e)}
              size="xs"
            >
              <Radio size="xs" color="primary" value="CL">
                Commercial Lines
              </Radio>
              <Radio size="xs" color="error" value="PL">
                Personal Lines
              </Radio>
              <Radio size="xs" color="success" value="B">
                Benefits
              </Radio>
            </Radio.Group>
            <div className="flex items-center w-full pt-4">
                <Button color="gradient" className="w-full" size="xs" onClick={() => submitChanges()}>
                    Save
                </Button>
            </div>
          </div>
        </Popover.Content>
      </Popover>
    </div>
  )
}
