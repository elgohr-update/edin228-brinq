import React from 'react'
import { Select, SelectOption } from 'reaselct'

export default function SelectInput({
  styling = 'flex w-full min-w-[350px]',
  loading = false,
  value = null,
  opts = [],
  labelField = 'id',
  valueField = 'id',
  keyField = 'id',
  useDetail = false,
  detailField,
  placeholder = 'Select',
  filterable = true,
  multiple = false,
  inputChange=null,
  clearable=true,
  disabled=false,
  onChange,
}) {

  return (
    <div className="select-wrapper">
      <Select
        className={styling}
        clearable={clearable}
        loading={loading}
        filterable={filterable}
        placeholder={placeholder}
        multiple={multiple}
        onInputChange={inputChange ? (e) => inputChange(e.target.value) : null}
        value={value}
        onChange={(v) => onChange(v)}
        disabled={disabled}
      >
        {opts?.map((o) => (
          <SelectOption key={o[keyField]} value={o[valueField]}>
            {useDetail ? `${o[detailField]} ${o[labelField]}` : o[labelField]}
          </SelectOption>
        ))}
      </Select>
    </div>
  )
}
