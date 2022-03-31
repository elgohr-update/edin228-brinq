import { Avatar, Button, Input, Loading, Switch, User, useTheme } from '@nextui-org/react'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { useTheme as useNextTheme } from 'next-themes'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react';
import HiddenBackdrop from '../../util/HiddenBackdrop';
import { useAppContext } from '../../../context/state';
import { RiFolderUserFill } from 'react-icons/ri';
import { GiHomeGarage } from 'react-icons/gi';
import { BsBuilding } from 'react-icons/bi';
import { MdMedicalServices } from 'react-icons/md';
import LineIcon from '../../util/LineIcon';
import UserAvatar from '../../user/Avatar';
import ContactCard from '../../contact/ContactCard';
import { BsBox,BsChevronDown,BsChevronUp } from 'react-icons/bs';
import { FaReceipt } from 'react-icons/fa';
import PolicyCard from '../../policy/PolicyCard';
import ActivityCard from '../../activity/ActivityCard';
import { reverseList } from '../../../utils/utils';
import TagBasic from '../tag/TagBasic';


const ClientDrawer = () => {
    const {state, setState} = useAppContext();
    const { isDark, type } = useTheme();
    const [client, setClient] = useState(null)
    const [activity, setActivity] = useState([])
    const [policies, setPolicies] = useState([])
    const [loading, setLoading] = useState(null)
    const { data: session } = useSession();
    const [tab, setTab] = useState(1)
    const [showMore1, setShowMore1] = useState(false)
    
    useEffect( () => {
        const clientId = state.drawer.client.clientId
        const fetchClient = async () => {
            const clientInfo = await fetch(`/api/clients/${clientId}?onlyInfo=true`, {
                method: 'GET'
            }).then((res) => res.json())
            .then((clientData) => {
                setClient(clientData);
            })
        }
        const fetchActivity = async () => {
            const clientActivity = await fetch(`/api/clients/${clientId}/activity?limit=8`, {
                method: 'GET'
            }).then((res) => res.json())
            .then((activityData) => {
                const format = activityData
                setActivity(format);
            })
        }
        const fetchPolicies = async () => {
            const clientActivity = await fetch(`/api/clients/${clientId}/policies?active=true`, {
                method: 'GET'
            }).then((res) => res.json())
            .then((policiesData) => {
                const format = policiesData
                setPolicies(format);
            })
        }
        fetchClient();
        fetchActivity();
        fetchPolicies();
        return () => {
            closeDrawer()
        }
    },[])

    // useEffect( () => {
    //     if (activity.length < 1) {
    //         setShowMore1(true)
    //     }
    // },[activity])

    const triggerTab = (t) => {
        setTab(t)
    }

    const toggleShowMore1 = () => {
        setShowMore1(!showMore1)
    }

    const getPolicies = () => {
        if (showMore1){
            return policies
        }
        return policies.slice(0,4)
    }

    const closeDrawer = () => {
        const setDefault = {isOpen:false,clientId:null}
        setState({...state,drawer:{...state.drawer, client:setDefault}})
    }
    const iconBg = () => {
        return client?.line === 'Commercial Lines' ? `bg-color-primary`: client?.line === 'Personal Lines' ? `bg-color-error`: client?.line === 'Benefits' ? `bg-color-success` : ''
    }

    return (        
        <div className={`flex w-full h-full fixed top-0 left-0 z-[999999]`}>
            <div className={`flex fixed right-0 h-full flex-col w-[700px] ${type}-shadow panel-theme-${type}`}>
                {!client ? 
                    <div className="flex h-full w-full flex-1 justify-center items-center">
                        <Loading type="points" size="xl" color="secondary" textColor="primary"/>
                    </div> :
                    <div className="flex h-full flex-1 py-4">
                        <div className={`flex flex-col w-full`}>
                            <div className={`flex relative w-full pb-4 px-2 mb-2`}>
                                <div className={`flex items-center text-5xl mr-4 px-2 rounded text-white`}>
                                    <LineIcon iconSize={30} size="lg" line={client?.line} />
                                </div>
                                <div className="flex flex-col pt-2 w-full">
                                    <h3>{client?.client_name}</h3>
                                    <div className="flex items-center w-full">
                                        <div className={`flex flex-1 flex-wrap w-full space-x-2`}>
                                            {
                                                client?.tags?.map( x => {
                                                    return <TagBasic key={x.id} text={x.name} color={x.color} />
                                                })
                                            }
                                        </div>
                                    </div>                                    
                                </div>
                                <div className={`bottom-border-flair pink-to-blue-gradient-1`} />
                            </div>
                            <div className={`mt-2 flex flex-col w-full overflow-auto h-[82vh]`}>
                                <div className="flex flex-col w-full px-4">
                                    <h4 className={`mb-2`}>
                                        Reps
                                    </h4>
                                    <div className={`flex flex-wrap w-full space-y-2`}>
                                        {client?.users.map( u => (
                                            <div className="flex" key={u.id}>
                                                <User 
                                                    src={u.image_file}
                                                    name={u.name}
                                                >
                                                    {u.email}
                                                </User>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className={`flex flex-col md:flex-row w-full py-2 px-4`}>
                                    <div className={`flex flex-col w-full `}>
                                        <h4 className={`mb-2`}>
                                            Address
                                        </h4>
                                        <div className="flex flex-col px-2">
                                            <h6>{client?.client_name}</h6>
                                            <h6>{client?.address}</h6>
                                            <div className="flex items-center space-x-1">
                                                <h6>{client?.city}{client?.city ? `,`:null}</h6>
                                                <h6>{client?.state}</h6>
                                                <h6>{client?.zipcode}</h6>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                                <div className={`flex flex-col w-full mb-4 px-4`}>
                                    <h4>
                                        Contacts
                                    </h4>
                                    <div className={`flex flex-wrap w-full border-b pb-4 ${isDark? `border-slate-800`:`border-slate-200`}`}>
                                        {client?.contacts.map( c => (
                                            <ContactCard key={c.id} contact={c}  />
                                        ))}
                                    </div>
                                </div>
                                <div className={`flex flex-col w-full`}>
                                    <div className={`flex items-center justify-center w-full space-x-3 mb-3`}>
                                        <div className={`flex items-center space-x-2 cursor-pointer text-xs tracking-widest font-normal hover:bg-sky-500/20 transition rounded-lg px-2 py-1 duration-100 ${tab === 1 ? `text-sky-500 bg-sky-400/20 ${type}-shadow`:'opacity-60'}`} onClick={() => triggerTab(1)}>
                                            <div><BsBox /></div>
                                            <div>Policies</div>
                                        </div>
                                        <div className={`flex items-center space-x-2 cursor-pointer text-xs tracking-widest font-normal hover:bg-sky-500/20 transition rounded-lg px-2 py-1 duration-100 ${tab === 2 ? `text-sky-500 bg-sky-400/20 ${type}-shadow`:'opacity-60'}`} onClick={() => triggerTab(2)}>
                                            <div><FaReceipt /></div>
                                            <div>Deals</div>
                                        </div>
                                    </div>
                                    { tab == 1 ? 
                                        <div className={`rounded relative flex flex-col z-10 w-full`}>
                                            <div className={`flex flex-col px-4 py-1 w-full transition-all duration-1000 ease-out ${!showMore1?`max-h-90`:`h-full`} overflow-hidden`}>
                                                {getPolicies().map( u => (
                                                    <PolicyCard key={u.id} policy={u} />
                                                ))}
                                            </div>
                                            {
                                                policies.length > 4 && activity.length > 0 ?
                                                    <div className="absolute bottom-[-30px] z-20 flex items-center w-full justify-center">
                                                        <Button onClick={() => toggleShowMore1()} auto size="xs" color="gradient" icon={!showMore1 ? <BsChevronDown/> : <BsChevronUp/>}></Button>
                                                    </div>
                                                :null
                                            }
                                            
                                        </div>
                                    : 
                                        tab == 2 ? 
                                        <div className={`rounded relative flex flex-col z-10 w-full`}>
                                            <div className={`flex flex-col w-full px-1 py-4 overflow-hidden ${showMore1?``:`max-h-[250px]`} `}>
                                                
                                            </div>
                                            {
                                                client?.deals?.length > 5 ?
                                                    <div className="absolute bottom-[-30px] z-20 flex items-center w-full justify-center">
                                                        <Button onClick={() => toggleShowMore1()} auto size="xs" color="gradient" icon={!showMore1 ? <BsChevronDown/> : <BsChevronUp/>}></Button>
                                                    </div>
                                                :null
                                            }
                                            
                                        </div>
                                    : 
                                    null 
                                    }
                                </div>
                                <div className={`${ activity.length < 1 ? 'hidden' : 'flex' } flex-col w-full mt-4 px-4 h-full`}>
                                    <h4>
                                        Recent Activity
                                    </h4>
                                    <div className={`rounded flex flex-col w-full h-full`}>
                                        {activity?.map( u => (
                                            <ActivityCard key={u.id} activity={u} hideClient />
                                        ))}
                                    </div>
                                </div>
                            </div>                    
                        </div>
                    </div>
                }
                {!client ? 
                    null :
                    <div className="flex justify-end w-full pt-1 pb-4 px-2">
                        <Link href={`/clients/${state.drawer.client.clientId}`}>
                            <a className="w-full">
                            <Button shadow color="gradient" className="w-full">
                                View More
                            </Button>
                            </a>
                        </Link>
                    </div>
                }
            </div>
            {state.drawer.client.isOpen?<HiddenBackdrop onClick={() => closeDrawer()} />:null}   
        </div>
    )
}

export default ClientDrawer