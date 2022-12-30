import { Button, Loading, useTheme } from '@nextui-org/react'
import next from 'next'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import BrinqInput from '../components/ui/input/BrinqInput'
import WebLayout from '../layouts/WebLayout'
import { getIcon, useNextApi } from '../utils/utils'

const TabSteps = ({ tab = null, tabMax = null }) => {
  const steps = ['SETUP', 'WSAPI', 'ADMIN', 'USERS', 'SUMMARY']

  const checkStep = (indx) => {
    const check = tab > indx ? true : false
    return check
  }

  const isStep = (indx) => {
    const check = tab == indx ? true : false
    return check
  }

  return (
    <div className="flex w-full justify-evenly">
      {steps.map((x, i) => (
        <div key={i} className="relative w-full">
          <div className="flex flex-col items-center">
            {checkStep(i) ? (
              <div className="text-emerald-500">{getIcon('circleCheck')}</div>
            ) : (
              <div className={`${isStep(i) ? 'text-emerald-500' : ''}`}>
                {getIcon('circle')}
              </div>
            )}
            <h6>{x}</h6>
          </div>
          {i != 0 ? (
            <div className="absolute right-[60%] top-[20%] h-[2px] w-[80%] ">
              <div
                className={`h-[2px] w-full rounded-lg ${
                  checkStep(i - 1) ? 'bg-emerald-500' : 'bg-zinc-600'
                }`}
              ></div>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

const Introduction = () => {
  return (
    <div className={`flex h-full w-full flex-col`}>
      <div className="flex justify-center w-full py-6 text-xl font-bold text-center uppercase tacking-widest">
        Before We Begin
      </div>
      <div
        className={`flex h-full w-full flex-col items-center rounded-lg p-4 pb-8`}
      >
        <div className="text-center">
          Before we begin, there is some setup involved.
        </div>
        <div className="items-center justify-center py-6 text-center">
          Please follow{' '}
          <span className="text-sky-500">
            <a href="/wsapi-setup" target="_blank">
              these instructions
            </a>
          </span>{' '}
          to create Vertafore WSAPI login credentials before continuing further.
        </div>
        <div className="text-center">
          These login credentials make this setup process 10x easier for you and
          us. It lets us pull your Agency's information and user information to
          save the time of manually filling this information in.
        </div>
        <div className="py-6 text-center">
          Whether you choose to sign up with BRINQ today or not,{' '}
          <span className="font-bold text-rose-500">
            nothing is saved to our system
          </span>{' '}
          until you submit your registration.
          <span className="font-bold text-rose-500">
            {' '}
            Everything you see in the following steps will only exist in your
            browser until submission!
          </span>
        </div>
        <div className="pb-8 text-center">
          Once you have followed the instructions to setup WSAPI in AMS360,
          please proceed to the next step.
        </div>
      </div>
    </div>
  )
}

const WsapiLogin = ({ nextCallback = null, dataCallback = null }) => {
  const { type, isDark } = useTheme()
  const [credentials, setCredentials] = useState({})
  const [succesfulLogin, setSuccesfulLogin] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    nextCallback(true)
    setSuccesfulLogin(false)
    setCredentials({})

    return () => {}
  }, [])

  const updateCredentials = (e, field) => {
    const temp = { ...credentials }
    temp[field] = e
    setCredentials(temp)
  }

  const checkCredentials = async () => {
    setLoading(true)
    const bundle = JSON.stringify(credentials)
    const res = await useNextApi(
      'POST',
      '/api/ams360/register/wsapi-credentials',
      bundle
    )
    if (res) {
      const temp = { ...credentials, token: res }
      dataCallback(temp)
      setLoading(false)
      setSuccesfulLogin(true)
      nextCallback(false)
    }
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex justify-center w-full py-6 text-xl font-bold text-center uppercase tacking-widest">
        WSAPI Credentials
      </div>
      <div className="items-center justify-center py-6 text-center">
        Please follow{' '}
        <span className="text-sky-500">
          <a href="/wsapi-setup" target="_blank">
            these instructions
          </a>
        </span>{' '}
        to create Vertafore WSAPI login credentials.
      </div>
      <div
        className={`flex w-full flex-col py-4 panel-theme-${type} ${type}-shadow rounded-lg`}
      >
        <BrinqInput
          title="Agency No."
          placeholder="Agency No."
          labelLeft={getIcon('caretRight')}
          color="orange"
          callBack={(e) => updateCredentials(e, 'agencyNo')}
        />
        <BrinqInput
          title="Username"
          placeholder="Username"
          labelLeft={getIcon('caretRight')}
          callBack={(e) => updateCredentials(e, 'username')}
        />
        <BrinqInput
          title="Password"
          placeholder="Password"
          labelLeft={getIcon('caretRight')}
          color="red"
          callBack={(e) => updateCredentials(e, 'password')}
        />
        <div className="flex items-center justify-center w-full py-6">
          <Button
            aria-label="test"
            onClick={checkCredentials}
            disabled={loading}
            flat
          >
            {loading ? (
              <Loading type="points-opacity" color="currentColor" size="md" />
            ) : (
              'Test WSAPI Login'
            )}
          </Button>
        </div>
      </div>
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-center w-full py-6">
          <div
            className={`h-[30px] w-[30px] rounded-full ${
              succesfulLogin ? 'green-gradient-1' : 'pink-gradient-1'
            }`}
          ></div>
          <div className="px-4 font-bold">
            {succesfulLogin ? 'Connected' : 'Not Connected'}
          </div>
        </div>
      </div>
    </div>
  )
}

const AgencyInfo = ({ agencyInformation = null, dataCallback = null }) => {
  const [data, setData] = useState(null)
  useEffect(() => {
    setData(agencyInformation)
    return () => {}
  }, [])

  const updateData = (e, field) => {
    const temp = { ...data }
    temp[field] = e
    setData(temp)
    dataCallback(temp)
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex justify-center w-full py-6 text-xl font-bold text-center uppercase tacking-widest">
        Agency Information
      </div>
      <div className="items-center justify-center py-6 text-center">
        Please make sure this info is correct.
      </div>
      <div className="flex flex-col w-full">
        <BrinqInput
          title="Agency Name"
          labelLeft="#"
          color="orange"
          initialValue={data?.AgencyName}
          callBack={(e) => updateData(e, 'AgencyName')}
        />
        <BrinqInput
          title="Agency Email"
          labelLeft="@"
          initialValue={data?.Email}
          callBack={(e) => updateData(e, 'Email')}
        />
        <div className="flex flex-col w-full space-y-2">
          <BrinqInput
            title="Agency Address"
            labelLeft={getIcon('location')}
            color="pink"
            initialValue={data?.Address}
            callBack={(e) => updateData(e, 'Address')}
          />
          <BrinqInput
            placeholder={'Address2'}
            color="pink"
            labelLeft={getIcon('location')}
            initialValue={data?.Address2}
            callBack={(e) => updateData(e, 'Address2')}
          />
          <div className="flex flex-col lg:flex-row lg:gap-1">
            <BrinqInput
              title={'City'}
              color="pink"
              labelLeft={getIcon('location')}
              initialValue={data?.City}
              callBack={(e) => updateData(e, 'City')}
            />
            <BrinqInput
              title={'State'}
              color="pink"
              labelLeft={getIcon('location')}
              initialValue={data?.State}
              callBack={(e) => updateData(e, 'State')}
            />
            <BrinqInput
              title={'ZipCode'}
              color="pink"
              labelLeft={getIcon('location')}
              initialValue={data?.ZipCode}
              callBack={(e) => updateData(e, 'ZipCode')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Register() {
  const { type, isDark } = useTheme()
  const [tab, setTab] = useState(0)
  const [tabMax, setTabMax] = useState(6)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [wsapiCredentials, setWsapiCredentials] = useState(null)
  const [agencyInformation, setAgencyInformation] = useState(null)
  const [agencyEmployees, setAgencyEmployees] = useState(null)
  const [users, setUsers] = useState(null)

  const nextButtonSetDisabled = (e) => {
    setNextDisabled(e)
  }

  const tabButton = (dir) => {
    if (dir == 'back') {
      setNextDisabled(false)
      setTab(tab > 0 ? tab - 1 : 0)
    } else {
      setTab(tab != tabMax ? tab + 1 : tabMax)
    }
  }

  const updateCredentials = async (e) => {
    setWsapiCredentials(e)
    const token = JSON.stringify({ token: e.token })
    const agency = await useNextApi(
      'POST',
      '/api/ams360/register/agency-info',
      token
    )
    if (agency) {
      setAgencyInformation(agency)
    }
    const employees = await useNextApi(
      'POST',
      '/api/ams360/register/agency-employees',
      token
    )
    if (employees) {
      const filterForActive = employees.filter(
        (x) => x.__values__.EmployeeStatus == 'A'
      )
      const formatted = filterForActive.map((x) => {
        return { ...x.__values__ }
      })
      setAgencyEmployees(formatted)
    }
  }

  const updateAgency = (e) => {
    setAgencyInformation(e)
  }

  return (
    <main className="flex w-full h-full">
      <div className="flex flex-col w-full h-full p-4 space-y-4 lg:gap-2 lg:space-y-0">
        <TabSteps tab={tab} tabMax={tabMax} />
        <div className={`flex h-[72vh] w-full overflow-y-auto rounded-lg p-4`}>
          {tab == 0 ? (
            <Introduction />
          ) : tab == 1 ? (
            <WsapiLogin
              nextCallback={nextButtonSetDisabled}
              dataCallback={updateCredentials}
            />
          ) : tab == 2 ? (
            <div>2</div>
          ) : tab == 3 ? (
            <div>3</div>
          ) : tab == 4 ? (
            <div>4</div>
          ) : tab == 5 ? (
            <div>5</div>
          ) : null}
        </div>
        <div
          className={`flex w-full justify-between space-x-2  rounded-lg py-2 px-4 lg:gap-2 lg:space-x-0`}
        >
          {tab != 0 ? (
            <div className="w-full">
              <Button
                onClick={() => tabButton('back')}
                className="w-full"
                color="error"
                auto
                flat
              >
                Back
              </Button>
            </div>
          ) : null}
          <div className="w-full">
            {tab != tabMax ? (
              <Button
                onClick={() => tabButton('next')}
                className="w-full"
                auto
                flat
                disabled={nextDisabled}
              >
                Next
              </Button>
            ) : (
              <Button className="w-full" auto color="gradient">
                Create
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

Register.getLayout = function getLayout(page) {
  return <WebLayout>{page}</WebLayout>
}
