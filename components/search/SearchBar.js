import { Input, Switch, useTheme } from '@nextui-org/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import { useTheme as useNextTheme } from 'next-themes'
import { useRouter } from 'next/router'
import HiddenBackdrop from '../util/HiddenBackdrop'
import { useSession } from 'next-auth/react'
import ClientSearchCard from './card/ClientSearchCard'
import ContactSearchCard from './card/ContactSearchCard'

const SearchBar = () => {
  const { setTheme } = useNextTheme()
  const { isDark, type } = useTheme()
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([{ id: 1 }])
  const [validSearch, setValidSearch] = useState(null)
  const { data: session } = useSession()
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

  const closeSearch = () => {
    setSearch('')
  }

  return (
    <div className="relative flex h-full w-full items-center justify-between">
      <Input
        className={`z-10 ${type}-shadow`}
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
            ? `opacity-1 min-h-80 absolute top-[40px] left-[1px] z-60 w-[360px] overflow-auto rounded-lg transition-all duration-100 ease-out md:w-[360px] panel-flatter-${type} ${type}-shadow`
            : `rounded-lg panel-flatter-${type} ${type}-shadow absolute w-[360px] top-[-500px] opacity-0 transition-all duration-100 ease-out md:w-[550px]`
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
