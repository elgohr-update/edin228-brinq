import { Input, useTheme } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import PanelTitle from '../title/PanelTitle'

function BrinqInput({
  title = null,
  initialValue = null,
  placeholder = null,
  minRows = 5,
  color = 'blue',
  bordered = true,
  fullWidth = true,
  disabled = false,
  clearable = true,
  label = null,
  labelPlaceholder = null,
  size = 'sm',
  inputType = 'text',
  underlined = null,
  rounded = null,
  labelLeft = null,
  labelRight = null,
  required = false,
  callBack = null,
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
    <div className={`flex flex-col w-full px-4 pb-1 ${disabled ? 'opacity-50':''}`}>
      {title ? <PanelTitle title={title} color={color} /> : null}
      <div className="flex w-full ">
        <Input
          disabled={disabled}
          clearable={clearable}
          fullWidth={fullWidth}
          bordered={bordered}
          label={label}
          labelPlaceholder={labelPlaceholder}
          placeholder={placeholder}
          type={inputType}
          size={size}
          underlined={underlined}
          rounded={rounded}
          labelLeft={labelLeft}
          labelRight={labelRight}
          required={required}
          onChange={(v) => updateValue(v.target.value)}
          borderWeight={'light'}
          className="h-[38px] rounded-[10px]"
        />
      </div>
    </div>
  )
}

export default BrinqInput
