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
  inititalValue = null
}) {
  const [value, setValue] = useState('')
  const [search, setSearch] = useState(null)
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState(null)

  useEffect(() => {
    const setOpts = () => {
      setValue([initialUser])
      if (callBack) {
        callBack([initialUser])
      }
    }
    if (initialUser) {
      setOpts()
    }
  }, [initialUser])

  useEffect(() => {
    const setOpts = () => {
      setValue(inititalValue)
      if (callBack) {
        callBack(inititalValue)
      }
    }
    if (inititalValue) {
      setOpts()
    }
  }, [inititalValue])

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
        console.log('test')
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
    <div className={`flex flex-col w-full px-4 pb-1 ${disabled ? 'opacity-50':''}`}>
      {title ? <PanelTitle title={title} color={color} /> : null}
      <div className="flex w-full">
        <div className="w-full">
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
          />
        </div>
      </div>
    </div>
  )
}

export default BrinqSelect
