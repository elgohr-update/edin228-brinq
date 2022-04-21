import { Input, useTheme } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import { useRouter } from 'next/router'
import HiddenBackdrop from '../util/HiddenBackdrop'
import ClientSearchCard from './card/ClientSearchCard'
import ContactSearchCard from './card/ContactSearchCard'

const SearchBar = () => {
  const { type } = useTheme()
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([{ id: 1 }])
  const [validSearch, setValidSearch] = useState(null)
  const router = useRouter()

  useEffect(() => {
    search.length > 3 ? setValidSearch(search) : setValidSearch(null)
    if (search.length > 3) {
      const fetchData = async () => {
        const results = await fetch(`/api/search?q=${search}`, {
          method: 'GET',
        })
          .then((res) => res.json())
          .then((data) => {
            const combo = [...data.clients, ...data.contacts]
            setSearchResults(combo)
          })
      }
      fetchData()
    }
  }, [search])

  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      closeSearch()
    })
  }, [router.events])

  const closeSearch = () => {
    setSearch('')
  }

  return (
    <div className="relative flex h-full w-full items-center justify-between">
      <Input
        className={`z-10 ${type}-shadow ${validSearch ? `outline outline-2 outline-sky-500`:''}`}
        type="search"
        size="sm"
        fullWidth
        placeholder="Search"
        aria-label="asdsad"
        labelRight={<BiSearch />}
        onChange={(e) => setSearch(e.target.value)}
      />
      {validSearch ? <HiddenBackdrop onClick={() => closeSearch()} /> : null}
      <div
        className={
          validSearch
            ? `opacity-1 min-h-80 z-60 absolute pt-14 pb-4 px-1 top-[-10px] left-[-7px] w-[370px] overflow-auto rounded-lg transition-all duration-100 ease-out panel-flatter-${type} ${type}-shadow`
            : `rounded-lg panel-flatter-${type} ${type}-shadow absolute top-[-500px] w-[360px] opacity-0 transition-all duration-100 ease-out`
        }
      >
        {searchResults?.map((x) => {
          return (
            <div key={`${x?.cat}${x?.id}`}>
              {x.cat === 'Client' ? (
                <ClientSearchCard client={x} />
              ) : x.cat == 'Contact' ? (
                <ContactSearchCard contact={x} />
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SearchBar
