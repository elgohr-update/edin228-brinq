import { Textarea, useTheme } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import PanelTitle from '../title/PanelTitle'

function BrinqTextArea({
  title = null,
  initialValue = null,
  placeholder = null,
  minRows = 5,
  maxRows = 6,
  color = 'blue',
  bordered = true,
  fullWidth = true,
  callBack = null,
  disabled = false,
  tooltip = false,
  tooltipContent = null,
}) {
  const { type } = useTheme()
  const [value, setValue] = useState('')

  useEffect(() => {
    const setVal = () => {
      setValue(initialValue)
    }
    setVal()
  }, [initialValue])

  const updateValue = (e) => {
    setValue(e)
    if (callBack) {
      callBack(e)
    }
  }

  return (
    <div
      className={`flex w-full flex-col px-4 pb-1 ${
        disabled ? 'opacity-20' : ''
      }`}
    >
      {title ? (
        <PanelTitle
          title={title}
          color={color}
          tooltip={tooltip}
          tooltipContent={tooltipContent}
        />
      ) : null}
      <div className={`flex w-full rounded-lg panel-flatter-${type}`}>
        <Textarea
          fullWidth={fullWidth}
          bordered={bordered}
          value={value}
          placeholder={placeholder}
          minRows={minRows}
          maxRows={maxRows}
          onChange={(e) => updateValue(e.target.value)}
          borderWeight={'light'}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

export default BrinqTextArea
