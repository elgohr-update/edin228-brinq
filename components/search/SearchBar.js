import { Input, Switch, useTheme } from '@nextui-org/react'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { BiSearch } from 'react-icons/bi';
import { useTheme as useNextTheme } from 'next-themes'
import { useRouter } from 'next/router'
import HiddenBackdrop from '../util/HiddenBackdrop';
import { useSession } from 'next-auth/react';


const SearchBar = () => {
    const { setTheme } = useNextTheme();
    const { isDark, type } = useTheme();
    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState([{id:1}])
    const [validSearch, setValidSearch] = useState(null)
    const { data: session } = useSession()
    const router = useRouter()

    useEffect(() => {
        search.length > 3 ? setValidSearch(search): setValidSearch(null)
        if (search.length > 3) {
            const fetchData = async () => {
                const results = await fetch(`/api/search?q=${search}`, {
                    method: 'GET'
                }).then((res) => res.json())
                .then((data) => {
                    const combo = [...data.clients,...data.contacts]
                    setSearchResults(combo)
                })
            }
            fetchData();
        }
    }, [search])
    
    const closeSearch = () => {
        setSearch('')
    }

    return (
        <div className="flex items-center justify-between w-full h-full relative">
            <Input 
                className={`z-10 ${type}-shadow`}
                type="search"
                size="sm" 
                fullWidth
                placeholder="Search" 
                aria-label="asdsad"
                labelRight={<BiSearch />}
                onChange={ e => setSearch(e.target.value)}
            />
            {validSearch?<HiddenBackdrop onClick={() => closeSearch()} />:null}   
            <div className={validSearch?`z-50 transition-all duration-200 ease-out opacity-1 absolute top-[40px] left-[1px] h-80 w-[360px] md:w-[550px] rounded panel-theme-${type} ${type}-shadow`: `rounded panel-theme-${type} ${type}-shadow absolute w-[360px] md:w-[550px] transition-all duration-200 ease-out opacity-0`}>
                {searchResults?.map( x => { return (
                    <div key={x?.id}>
                        { x?.client_name}
                    </div>
                )})}
            </div>
        </div>
    )
}

export default SearchBar