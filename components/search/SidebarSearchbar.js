import { Input, Loading, useTheme } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import { useRouter } from 'next/router'
import HiddenBackdrop from '../util/HiddenBackdrop'
import ClientSearchCard from './card/ClientSearchCard'
import ContactSearchCard from './card/ContactSearchCard'

const SidebarSearchbar = ({ expand }) => {
  const { type } = useTheme()
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchResults, setSearchResults] = useState([{ id: 1 }])
  const [validSearch, setValidSearch] = useState(null)
  const router = useRouter()
  let delay

  useEffect(() => {
    search.length > 2 ? setValidSearch(search) : setValidSearch(null)
    setLoading(true)
    delay = setTimeout(() => {
      if (search) fetchData()
    }, 1000)
    return () => clearTimeout(delay)
  }, [search])

  const fetchData = async () => {
    const results = await fetch(`/api/search?q=${search}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        const combo = [...data.clients, ...data.contacts]
        setSearchResults(combo)
        setLoading(false)
      })
  }

  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      closeSearch()
    })
  }, [router.events])

  const closeSearch = () => {
    setSearch('')
  }

  return (
    <>
      <div
        className={`${
          expand ? 'absolute left-[-200px] opacity-0' : 'opacity-1 relative'
        } p-4 h-[30px] flex items-center justify-center panel-flat-${type} rounded-lg`}
      >
        <BiSearch />
      </div>
      <div
        className={`${
          expand ? 'opacity-1 relative' : 'absolute left-[-200px] opacity-0'
        } flex h-full w-full items-center justify-between `}
      >
        <div className={`h-[30px] z-50 flex w-full`}>
          <Input
            className={`z-10 ${type}-shadow${
              validSearch ? `outline outline-2 outline-sky-500` : ''
            }`}
            type="search"
            size="sm"
            fullWidth
            placeholder="Search"
            aria-label="Search"
            labelRight={<BiSearch />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {validSearch ? <HiddenBackdrop onClick={() => closeSearch()} /> : null}
        <div
          className={`${
            validSearch
              ? `opacity-1 min-h-80 absolute top-[-10px] left-[-7px] z-40 w-[275px] overflow-y-auto rounded-lg px-1 pt-14 pb-4 transition-all duration-100 ease-out panel-flatter-${type} ${type}-shadow`
              : `absolute top-[-500px] w-[275px] rounded-lg opacity-0 transition-all duration-100 ease-out`
          } max-h-[90vh]`}
        >
          {loading ? (
            <div className="flex w-full items-center justify-center">
              <Loading size="md" color="primary" textColor="primary" />
            </div>
          ) : (
            searchResults?.map((x) => {
              return (
                <div key={`${x?.cat}${x?.id}`}>
                  {x.cat === 'Client' ? (
                    <ClientSearchCard client={x} />
                  ) : x.cat == 'Contact' ? (
                    <ContactSearchCard contact={x} />
                  ) : null}
                </div>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}

export default SidebarSearchbar
