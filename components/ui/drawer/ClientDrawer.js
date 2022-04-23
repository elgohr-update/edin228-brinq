import { Button, Loading, User, useTheme } from '@nextui-org/react'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import HiddenBackdrop from '../../util/HiddenBackdrop';
import { useAppContext } from '../../../context/state';
import { BsBox,BsChevronDown,BsChevronUp } from 'react-icons/bs';
import { FaReceipt } from 'react-icons/fa';
import PolicyCard from '../../policy/PolicyCard';
import { sumFromArrayOfObjects } from '../../../utils/utils';
import SummaryCard from '../card/SummaryCard';
import { AiFillDollarCircle,AiOutlineClose } from 'react-icons/ai';
import ClientHeader from '../../client/ClientTitle';
import ClientActivity from '../../client/ClientActivity';
import ClientContacts from '../../client/ClientContacts';
import ClientInfo from '../../client/ClientInfo';
import { useRouter } from 'next/router';


const ClientDrawer = () => {
    const {state, setState} = useAppContext();
    const router = useRouter()
    const { month, year } = router.query
    const { type } = useTheme();
    const [client, setClient] = useState(null)
    const [activity, setActivity] = useState([])
    const [policies, setPolicies] = useState([])
    const [tab, setTab] = useState(1)
    const [showMore1, setShowMore1] = useState(false)
    
    useEffect( () => {
        const clientId = state.drawer.client.clientId
        const fetchClient = async () => {
            const clientInfo = await fetch(`/api/clients/${clientId}?onlyInfo=true`, {
                method: 'GET'
            })
            .then((clientData) => {
                setClient(clientData);
            })
        }
        const fetchActivity = async () => {
            const clientActivity = await fetch(`/api/clients/${clientId}/activity?limit=8`, {
                method: 'GET'
            })
            .then((activityData) => {
                setActivity(activityData);
            })
        }
        const fetchPolicies = async () => {
            const queryUrl = state.drawer.client.isRenewal ? `?month=${month}&year=${year}` :`?active=true`
            const clientActivity = await fetch(`/api/clients/${clientId}/policies${queryUrl}`, {
                method: 'GET'
            })
            .then((policiesData) => {
                setPolicies(policiesData);
            })
        }
        fetchClient();
        fetchActivity();
        fetchPolicies();
        // return () => {
        //     closeDrawer()
        // }
    },[])
    
    useEffect(() => {
        router.events.on("routeChangeStart", () => {
            closeDrawer()
        });
    }, [router.events]);


    const premSum = () => {
        return sumFromArrayOfObjects(policies,'premium')
    }
    
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
        const setDefault = {
            isOpen:false,
            clientId:null,
            isRenewal:false,
            renewalMonth:null,
            renewalYear:null
        }
        setState({...state,drawer:{...state.drawer, client:setDefault}})
    }
    const iconBg = () => {
        return client?.line === 'Commercial Lines' ? `bg-color-primary`: client?.line === 'Personal Lines' ? `bg-color-error`: client?.line === 'Benefits' ? `bg-color-success` : ''
    }

    return (        
        <div className={`flex w-full h-full fixed top-0 left-0 z-[999999]`}>
            <div className={`flex fixed right-0 h-full flex-col w-full md:w-[800px] ${type}-shadow panel-theme-${type}`}>
                {!client ? 
                    <div className="flex h-full w-full flex-1 justify-center items-center">
                        <Loading type="points" size="xl" color="secondary" textColor="primary"/>
                    </div> :
                    <div className="flex h-full flex-1 py-4">
                        <div className={`flex flex-col w-full`}>
                            <div className={`flex relative w-full px-2 mb-2`}>
                                <div className="flex flex-col md:flex-row md:pt-2 w-full relative">
                                    <ClientHeader client={client} />
                                    <div className="flex items-center justify-center md:justify-end w-full pl-4 pr-8">
                                        <SummaryCard isIcon={false} autoWidth val={premSum()} color="teal" gradientColor="green-to-blue-2" icon={<AiFillDollarCircle />} title="Premium" money   />
                                        <SummaryCard isIcon={false} autoWidth val={policies.length} color="fuchsia" gradientColor="orange-to-red-2" title="Policies" icon={<BsBox />}  />
                                    </div>
                                    <div className="flex md:hidden absolute top-0 right-0" onClick={() => closeDrawer()}>
                                        <AiOutlineClose />
                                    </div>
                                </div>
                                <div className={`bottom-border-flair pink-to-blue-gradient-1`} />
                            </div>
                            <div className={`mt-2 flex flex-col w-full overflow-auto h-[78vh]`}>
                                <ClientInfo client={client} horizontal />
                                <ClientContacts client={client} />
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
                                    <h4>Recent Activity</h4>
                                    {client? <ClientActivity activity={activity} /> : null}
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