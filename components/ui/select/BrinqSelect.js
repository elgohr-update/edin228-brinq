import { Textarea, useTheme } from '@nextui-org/react'
import { data } from 'autoprefixer'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { timeout, useNextApi } from '../../../utils/utils'
import PanelTitle from '../title/PanelTitle'
import SelectInput from './SelectInput'

function BrinqSelect({
  title = null,
  initialOptions = null,
  placeholder = null,
  color = 'blue',
  disabled = false,
  filterable = false,
  callBack = null,
  useSearch = false,
  searchClients = false,
  useDetail = false,
  detailField = null,
  multiple = false,
  labelField = 'id',
  valueField = 'id',
  keyField = 'id',
  initialUser = null,
  initialValue = null,
  fullWidth = true,
  clearable = true,
  fastCallback = true,
  tooltip = false,
  tooltipContent = null,
}) {
  const [value, setValue] = useState('')
  const [search, setSearch] = useState(null)
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState(null)

  useEffect(() => {
    const setOpts = () => {
      setValue([initialUser])
      if (callBack && fastCallback) {
        callBack([initialUser])
      }
    }
    if (initialUser) {
      setOpts()
    }
  }, [initialUser])

  useEffect(() => {
    const setOpts = () => {
      setValue(initialValue)
      if (callBack && fastCallback) {
        callBack(initialValue)
      }
    }
    if (initialValue) {
      setOpts()
    }
  }, [initialValue])

  useEffect(() => {
    const setOpts = () => {
      setOptions(initialOptions)
    }
    setOpts()
  }, [initialOptions])

  const fetchSearchClients = async () => {
    const res = await useNextApi('GET', `/api/search?q=${search}`)
    return res.clients
  }

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(500)
      if (!isCancelled && search && searchClients) {
        setLoading(true)
        const data = await fetchSearchClients()
        setOptions(data)
        setLoading(false)
      }
    }
    if (filterable) {
      handleChange()
    }
    return () => {
      isCancelled = true
    }
  }, [search])

  const updateValue = (e) => {
    setValue(e)
    if (callBack) {
      callBack(e)
    }
  }

  return (
    <div
      className={`relative flex flex-col ${
        fullWidth ? 'w-full' : ''
      } pb-1 ${disabled ? 'opacity-20' : ''}`}
    >
      {title ? (
        <PanelTitle
          title={title}
          color={color}
          tooltip={tooltip}
          tooltipContent={tooltipContent}
        />
      ) : null}
      <div className={`flex ${fullWidth ? 'w-full' : ''} relative `}>
        <div className={`${fullWidth ? 'w-full' : ''} relative `}>
          <SelectInput
            loading={loading}
            value={value}
            opts={options}
            labelField={labelField}
            placeholder={placeholder}
            filterable={filterable}
            useDetail={useDetail}
            detailField={detailField}
            multiple={multiple}
            inputChange={useSearch ? (e) => setSearch(e) : null}
            onChange={(v) => updateValue(v)}
            disabled={disabled}
            keyField={keyField}
            valueField={valueField}
            clearable={clearable}
          />
        </div>
      </div>
    </div>
  )
}

export default BrinqSelect
