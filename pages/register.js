import {
  Button,
  Checkbox,
  Loading,
  useTheme,
  Modal,
  Text,
} from '@nextui-org/react'
import next from 'next'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import BrinqInput from '../components/ui/input/BrinqInput'
import BrinqSelect from '../components/ui/select/BrinqSelect'
import WebLayout from '../layouts/WebLayout'
import {
  getIcon,
  isEmail,
  isValidPassword,
  generatePassword,
  useNextApi,
  findSimilarEmployees,
  sortByProperty,
  countPropertyFromArray,
} from '../utils/utils'
import uuid from 'react-uuid'

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

const WsapiLogin = ({
  nextCallback = null,
  dataCallback = null,
  agencyEmployees = null,
}) => {
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
      <div className="flex flex-col items-center w-full">
        <div className="flex items-center w-full py-6">
          <div
            className={`h-[30px] w-[30px] rounded-full ${
              succesfulLogin ? 'green-gradient-1' : 'pink-gradient-1'
            }`}
          ></div>
          <div className="px-4 font-bold">
            {succesfulLogin ? 'Connected' : 'Not Connected'}
          </div>
        </div>
        <div className="flex items-center w-full py-6">
          <div
            className={`h-[30px] w-[30px] rounded-full ${
              agencyEmployees ? 'green-gradient-1' : 'pink-gradient-1'
            }`}
          ></div>
          <div className={`px-4 font-bold`}>Agency Information</div>
        </div>
      </div>
    </div>
  )
}

const Summary = ({ users, agencyInfo, paymentOption, dataCallback = null }) => {
  const { type, isDark } = useTheme()

  const updatePayment = (e) => {
    dataCallback(e)
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col items-center p-4">
        <Text
          h1
          size={30}
          css={{
            textGradient: '45deg, $yellow600 -20%, $red600 100%',
          }}
          weight="bold"
        >
          {agencyInfo.AgencyName}
        </Text>
      </div>
      <div className="px-4">
        Select pricing option and checkout to be redirected to payment.
      </div>
      <div className="flex flex-col w-full py-6 space-y-4">
        <div
          onClick={() => updatePayment('monthly')}
          className={`${
            paymentOption == 'monthly' ? 'border-[1px] border-sky-500' : ''
          } flex w-full cursor-pointer flex-col xl:flex-row xl:items-center  xl:justify-between panel-flat-${type} rounded-lg p-4 shadow`}
        >
          <div className={`flex items-center`}>
            <div className="mr-2">
              <Text
                h1
                size={30}
                css={{
                  textGradient: '45deg, $blue600 -20%, $pink600 50%',
                }}
                weight="bold"
              >
                {countPropertyFromArray(users, 'is_active', true)}
              </Text>
            </div>
            <div className="text-xs font-bold tracking-widest uppercase xl:text-xl">
              Licenses
            </div>
            <div className="mx-2 text-xs font-bold tracking-widest opacity-50">
              x
            </div>
            <div className="text-xs font-bold tracking-widest text-teal-500 uppercase xl:text-2xl">
              $20
            </div>
          </div>
          <div className={`flex items-center`}>
            <div className="flex xl:w-[300px]">
              <div className="flex justify-end w-full">
                <Text
                  h1
                  size={30}
                  css={{
                    textGradient: '45deg, $blue600 -20%, $green600 50%',
                  }}
                  weight="bold"
                >
                  ${countPropertyFromArray(users, 'is_active', true) * 20}
                </Text>
              </div>
            </div>
            <div className="mx-2 text-xs font-bold tracking-widest uppercase opacity-50">
              /
            </div>
            <div className="w-[60px] text-xs font-bold tracking-widest opacity-50">
              Month
            </div>
          </div>
        </div>
        <div
          onClick={() => updatePayment('annual')}
          className={`${
            paymentOption == 'annual' ? 'border-[1px] border-sky-500' : ''
          } flex w-full cursor-pointer flex-col xl:flex-row xl:items-center xl:justify-between panel-flat-${type} rounded-lg p-4 shadow`}
        >
          <div className={`flex items-center`}>
            <div className="mr-2">
              <Text
                h1
                size={30}
                css={{
                  textGradient: '45deg, $blue600 -20%, $pink600 50%',
                }}
                weight="bold"
              >
                {countPropertyFromArray(users, 'is_active', true)}
              </Text>
            </div>
            <div className="text-xs font-bold tracking-widest uppercase xl:text-xl">
              Licenses
            </div>
            <div className="mx-2 text-xs font-bold tracking-widest opacity-50">
              x
            </div>
            <div className="text-xs font-bold tracking-widest text-teal-500 uppercase xl:text-2xl">
              $20
            </div>
          </div>
          <div className={`relative flex items-center`}>
            <div className="absolute right-0 rounded-lg  border-[1px] border-rose-500 bg-rose-600/20 px-2 text-xs text-rose-500 xl:top-[-10px]">
              1 Month Free
            </div>
            <div className="justfiy-end flex xl:w-[300px]">
              <div className="flex justify-end w-full">
                <Text
                  h1
                  size={30}
                  css={{
                    textGradient: '45deg, $blue600 -20%, $green600 50%',
                  }}
                  weight="bold"
                >
                  ${countPropertyFromArray(users, 'is_active', true) * 220}
                </Text>
              </div>
            </div>
            <div className="mx-2 text-xs font-bold tracking-widest uppercase opacity-50">
              /
            </div>
            <div className="w-[60px] text-xs font-bold tracking-widest opacity-50">
              Year
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const UserCard = ({ user, agencyEmployeesRaw = null, dataCallback = null }) => {
  const { type, isDark } = useTheme()
  const [editModal, setEditModal] = useState(false)
  const [editUser, setEditUser] = useState(null)

  useEffect(() => {
    setEditUser(user)
  }, [user])

  const confirm = () => {
    const nameOk = editUser.name.length > 3
    const emailOk = isEmail(editUser.email)
    const passwordOk = isValidPassword(editUser.password)
    const deptOk = editUser.dept.length > 3
    if (nameOk && emailOk && passwordOk && deptOk) {
      dataCallback(editUser)
      setEditModal(false)
    }
  }

  const createRandomPassword = () => {
    const getPassword = generatePassword()
    editNewUserField(getPassword, 'password')
  }

  const editNewUserField = (val, field) => {
    const temp = { ...editUser }
    temp[field] = val
    setEditUser(temp)
  }

  return (
    <div className="flex flex-col w-full">
      <div
        onClick={() => setEditModal(true)}
        className={`relative flex w-full flex-col rounded-lg p-2 xl:flex-row xl:items-center xl:justify-start panel-theme-${type} ${type}-shadow`}
      >
        <div className="flex flex-col w-full mb-2 xl:flex-row xl:items-center xl:mb-0">
          <div className="xl:mr-2 flex mb-2 xl:w-[75px] xl:justify-end">
            {user.is_active ? (
              <div className="rounded-md border-[1px] border-emerald-500/20 bg-emerald-700/20 px-2 text-[8px] font-semibold tracking-widest text-emerald-500 shadow-md">
                ACTIVE
              </div>
            ) : (
              <div className="rounded-md border-[1px] border-rose-500/20 bg-rose-700/20 px-2 text-[8px] font-semibold tracking-widest text-rose-500 shadow-md">
                NOT ACTIVE
              </div>
            )}
          </div>
          <div className='flex flex-col xl:flex-row'>
            <div
              className={`panel-flat-${type} ${type}-shadow mr-2 flex h-[35px] w-[35px] items-center justify-center rounded-lg`}
            >
              {getIcon('user')}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center">
                <div className="text-xs font-bold">{user.name}</div>
              </div>
              <div className="text-sm opacity-50">{user.email}</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full space-y-2 xl:gap-2 xl:space-y-0">
          <div>
            <div className="text-[10px] opacity-50">Department</div>
            <div
              className={`flex w-full text-[10px] font-bold capitalize tracking-widest ${
                user.dept == 'Commercial Lines'
                  ? 'text-blue-500'
                  : user.dept == 'Personal Lines'
                  ? 'text-rose-500'
                  : user.dept == 'Benefits'
                  ? 'text-emerald-500'
                  : user.dept == 'Operations'
                  ? 'text-violet-500'
                  : ''
              }`}
            >
              {user.dept}
            </div>
          </div>
          <div>
            <div className="text-[10px] opacity-50">Permissions</div>
            <div className="flex flex-col space-y-2 xl:flex-row xl:gap-2 xl:space-y-0">
              <div
                className={`text-[10px] font-bold capitalize tracking-widest ${
                  user.owner ? ' text-violet-500' : 'opacity-50'
                }`}
              >
                owner
              </div>
              <div
                className={`text-[10px] font-bold capitalize tracking-widest ${
                  user.admin ? ' text-rose-500' : 'opacity-50'
                }`}
              >
                admin
              </div>
              <div
                className={`text-[10px] font-bold capitalize tracking-widest ${
                  user.producer ? ' text-sky-500' : 'opacity-50'
                }`}
              >
                producer
              </div>
              <div
                className={`text-[10px] font-bold capitalize tracking-widest ${
                  user.account_manager ? ' text-yellow-500' : 'opacity-50'
                }`}
              >
                Account Manager
              </div>
              <div
                className={`text-[10px] font-bold capitalize tracking-widest ${
                  user.support ? ' text-teal-500' : 'opacity-50'
                }`}
              >
                support
              </div>
            </div>
          </div>
        </div>
      </div>
      {agencyEmployeesRaw ? (
        <Modal
          closeButton
          noPadding
          scroll
          className={'flex w-full items-center justify-center'}
          aria-labelledby="modal-title"
          open={editModal}
          onClose={() => setEditModal(false)}
        >
          <Modal.Header className="flex flex-col w-full px-4 mb-4">
            <div>Edit User</div>
          </Modal.Header>
          <Modal.Body className="flex flex-col items-center w-full px-4">
            {editModal ? (
              <div className="flex w-full">
                <div className={`flex w-full flex-col py-4`}>
                  <div className="flex flex-col w-full">
                    <div>
                      <BrinqInput
                        title={'Name'}
                        placeholder={'Name'}
                        initialValue={editUser?.name}
                        callBack={(e) => editNewUserField(e, 'name')}
                      />
                      <BrinqInput
                        color="yellow"
                        title={'Email'}
                        placeholder={'Email'}
                        initialValue={editUser?.email}
                        callBack={(e) => editNewUserField(e, 'email')}
                      />
                      <div className="relative">
                        <BrinqInput
                          color="red"
                          title={'Password'}
                          placeholder={'Password'}
                          initialValue={editUser?.password}
                          callBack={(e) => editNewUserField(e, 'password')}
                          tooltip={true}
                          tooltipContent={
                            <div className="block">
                              <div>Must be at least 6 characters in length</div>
                              <div>Maximum length allowed is 30 characters</div>
                              <div>Passwords are case sensitive</div>
                              <div>Must be alphanumeric characters only</div>
                              <div>
                                Must include at least one numeric character
                              </div>
                              <div>
                                Must include at least one upper-case character
                              </div>
                              <div>
                                Must include at least one lowercase character
                              </div>
                            </div>
                          }
                        />
                        <div
                          className="absolute top-[10px] right-[20px] cursor-pointer text-xs transition duration-100 ease-out hover:text-sky-500"
                          onClick={createRandomPassword}
                        >
                          Generate random password
                        </div>
                      </div>

                      <BrinqSelect
                        title={'Department'}
                        placeholder={'Department'}
                        color="indigo"
                        initialOptions={[
                          { value: 'Personal Lines' },
                          { value: 'Commercial Lines' },
                          { value: 'Benefits' },
                          { value: 'Operations' },
                        ]}
                        labelField={'value'}
                        valueField={'value'}
                        keyField={'value'}
                        initialValue={editUser?.dept}
                        callBack={(e) => editNewUserField(e, 'dept')}
                        multiple={false}
                        clearable={false}
                        fastCallback={false}
                        filterable
                      />
                      {agencyEmployeesRaw ? (
                        <BrinqSelect
                          title={'AMS360 Employee Codes'}
                          placeholder={'AMS360 Employee Codes'}
                          color="orange"
                          initialOptions={agencyEmployeesRaw}
                          labelField={'fullName'}
                          valueField={'EmployeeCode'}
                          keyField={'EmployeeCode'}
                          initialValue={editUser?.ams360_employee_codes}
                          callBack={(e) =>
                            editNewUserField(e, 'ams360_employee_codes')
                          }
                          multiple={true}
                          clearable={true}
                          filterable
                          tooltip={true}
                          tooltipContent={`These codes are used to link your AMS360 User accounts to Brinq User accounts.`}
                        />
                      ) : null}
                    </div>
                    <div className="flex flex-col w-full p-4 space-y-2">
                      <Checkbox
                        color="error"
                        defaultSelected={editUser?.admin}
                        isSelected={editUser?.admin}
                        onChange={(e) => editNewUserField(e, 'admin')}
                        size="xs"
                      >
                        <div className="text-xs tracking-widest">Admin</div>
                      </Checkbox>
                      <Checkbox
                        color="secondary"
                        defaultSelected={editUser?.owner}
                        isSelected={editUser?.owner}
                        onChange={(e) => editNewUserField(e, 'owner')}
                        size="xs"
                      >
                        <div className="text-xs tracking-widest">Owner</div>
                      </Checkbox>
                      <Checkbox
                        color="warning"
                        defaultSelected={editUser?.producer}
                        isSelected={editUser?.producer}
                        onChange={(e) => editNewUserField(e, 'producer')}
                        size="xs"
                      >
                        <div className="text-xs tracking-widest">Producer</div>
                      </Checkbox>
                      <Checkbox
                        color="primary"
                        defaultSelected={editUser?.account_manager}
                        isSelected={editUser?.account_manager}
                        onChange={(e) => editNewUserField(e, 'account_manager')}
                        size="xs"
                      >
                        <div className="text-xs tracking-widest">
                          Account Manager
                        </div>
                      </Checkbox>
                      <Checkbox
                        color="success"
                        defaultSelected={editUser?.support}
                        isSelected={editUser?.support}
                        onChange={(e) => editNewUserField(e, 'support')}
                        size="xs"
                      >
                        <div className="text-xs tracking-widest">Support</div>
                      </Checkbox>
                    </div>
                    <div className="flex w-full px-4 py-6">
                      <Checkbox
                        color="success"
                        defaultSelected={editUser?.is_active}
                        isSelected={editUser?.is_active}
                        onChange={(e) => editNewUserField(e, 'is_active')}
                        size="xs"
                      >
                        <div className="text-xs tracking-widest">
                          Active User
                        </div>
                      </Checkbox>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </Modal.Body>
          <Modal.Footer
            autoMargin={false}
            className="flex items-center w-full p-4"
          >
            <div
              className={`flex w-full justify-end space-x-2  rounded-lg py-2 px-4 xl:gap-2 xl:space-x-0`}
            >
              <div>
                <Button
                  size="xs"
                  onClick={() => setEditModal(false)}
                  color="error"
                  auto
                  ghost
                >
                  Cancel
                </Button>
              </div>
              <div>
                <Button size="xs" onClick={confirm} auto color="gradient">
                  Confirm
                </Button>
              </div>
            </div>
          </Modal.Footer>
        </Modal>
      ) : null}
    </div>
  )
}

const AdminSetup = ({
  users = null,
  agencyEmployees = null,
  agencyEmployeesRaw = null,
  nextCallback = null,
  dataCallback = null,
}) => {
  const { type, isDark } = useTheme()
  const [newUser, setNewUser] = useState(null)
  const [confirmed, setConfirmed] = useState(false)
  const [importDisabled, setImportDisabled] = useState(false)

  const removeAndReset = (user) => {
    dataCallback(user, 'delete')
    cancel()
  }

  const cancel = () => {
    setNewUser(null)
    nextCallback(true)
    setImportDisabled(false)
    setConfirmed(false)
  }

  const confirm = () => {
    const nameOk = newUser.name.length > 3
    const emailOk = isEmail(newUser.email)
    const passwordOk = isValidPassword(newUser.password)
    const deptOk = newUser.dept.length > 3
    if (nameOk && emailOk && passwordOk && deptOk) {
      dataCallback(newUser, 'add')
      setConfirmed(true)
      nextCallback(false)
    }
  }

  const editUser = (e) => {
    dataCallback(e, 'edit')
  }

  const createRandomPassword = () => {
    const getPassword = generatePassword()
    editNewUserField(getPassword, 'password')
  }

  const editNewUserField = (val, field) => {
    const temp = { ...newUser }
    temp[field] = val
    setNewUser(temp)
  }

  const importFromAMS = (val) => {
    const emp = agencyEmployees.find((x) => x.EmployeeCode == val)
    const temp = { ...newUser }
    temp.name = emp.fullName
    temp.email = emp.Email
    temp.account_manager = emp.Representative
    temp.producer = emp.Executive
    temp.dept = 'Commercial Lines'
    temp.is_active = true
    temp.admin = true
    temp.owner = true
    temp.ams360_employee_code = emp.EmployeeCode
    temp.ams360_employee_codes = findSimilarEmployees(emp, agencyEmployees)
    setNewUser(temp)
    setImportDisabled(true)
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col py-6 font-semibold text-center">
        <div>
          Setup the first user account that will have Owner and Admin
          permissions.
        </div>
        <div>This should be the person currently setting this up.</div>
      </div>
      <BrinqSelect
        title={'Import from AMS360'}
        placeholder={'Import from AMS360'}
        color="orange"
        initialOptions={agencyEmployees}
        labelField={'fullName'}
        valueField={'EmployeeCode'}
        keyField={'EmployeeCode'}
        initialValue={null}
        callBack={(e) => importFromAMS(e)}
        multiple={false}
        clearable={false}
        fastCallback={false}
        disabled={importDisabled}
        filterable
      />
      <div className="flex flex-col w-full p-4 space-y-2">
        {users.map((user) => (
          <div key={user.EmployeeCode} className="relative flex w-full">
            <UserCard
              user={user}
              agencyEmployeesRaw={agencyEmployeesRaw}
              dataCallback={editUser}
            />
            <div
              className="absolute top-[-5px] right-[-5px] cursor-pointer text-rose-500"
              onClick={() => removeAndReset(user)}
            >
              {getIcon('circleX')}
            </div>
          </div>
        ))}
      </div>
      <Modal
        noPadding
        scroll
        className={'flex w-full items-center justify-center'}
        aria-labelledby="modal-title"
        open={newUser && !confirmed}
      >
        <Modal.Header className="flex flex-col w-full px-4 mb-4">
          <div>Add User</div>
        </Modal.Header>
        <Modal.Body className="flex flex-col items-center w-full px-4">
          {newUser && !confirmed ? (
            <div className="flex w-full">
              <div className={`flex w-full flex-col py-4`}>
                <div className="flex flex-col w-full">
                  <div>
                    <BrinqInput
                      title={'Name'}
                      placeholder={'Name'}
                      initialValue={newUser?.name}
                      callBack={(e) => editNewUserField(e, 'name')}
                    />
                    <BrinqInput
                      color="yellow"
                      title={'Email'}
                      placeholder={'Email'}
                      initialValue={newUser?.email}
                      callBack={(e) => editNewUserField(e, 'email')}
                    />
                    <div className="relative">
                      <BrinqInput
                        color="red"
                        title={'Password'}
                        placeholder={'Password'}
                        initialValue={newUser?.password}
                        callBack={(e) => editNewUserField(e, 'password')}
                        tooltip={true}
                        tooltipContent={
                          <div className="block">
                            <div>Must be at least 6 characters in length</div>
                            <div>Maximum length allowed is 30 characters</div>
                            <div>Passwords are case sensitive</div>
                            <div>Must be alphanumeric characters only</div>
                            <div>
                              Must include at least one numeric character
                            </div>
                            <div>
                              Must include at least one upper-case character
                            </div>
                            <div>
                              Must include at least one lowercase character
                            </div>
                          </div>
                        }
                      />
                      <div
                        className="absolute top-[10px] right-[20px] cursor-pointer text-xs transition duration-100 ease-out hover:text-sky-500"
                        onClick={createRandomPassword}
                      >
                        Generate random password
                      </div>
                    </div>

                    <BrinqSelect
                      title={'Department'}
                      placeholder={'Department'}
                      color="indigo"
                      initialOptions={[
                        { value: 'Personal Lines' },
                        { value: 'Commercial Lines' },
                        { value: 'Benefits' },
                        { value: 'Operations' },
                      ]}
                      labelField={'value'}
                      valueField={'value'}
                      keyField={'value'}
                      initialValue={newUser?.dept}
                      callBack={(e) => editNewUserField(e, 'dept')}
                      multiple={false}
                      clearable={false}
                      fastCallback={false}
                      filterable
                    />
                    <BrinqSelect
                      title={'AMS360 Employee Codes'}
                      placeholder={'AMS360 Employee Codes'}
                      color="orange"
                      initialOptions={agencyEmployees}
                      labelField={'fullName'}
                      valueField={'EmployeeCode'}
                      keyField={'EmployeeCode'}
                      initialValue={newUser?.ams360_employee_codes}
                      callBack={(e) =>
                        editNewUserField(e, 'ams360_employee_codes')
                      }
                      multiple={true}
                      clearable={true}
                      filterable
                      tooltip={true}
                      tooltipContent={`These codes are used to link your AMS360 User accounts to Brinq User accounts.`}
                    />
                  </div>
                  <div className="flex flex-col w-full p-4 space-y-2">
                    <Checkbox
                      color="warning"
                      defaultSelected={newUser?.producer}
                      isSelected={newUser?.producer}
                      onChange={(e) => editNewUserField(e, 'producer')}
                      size="xs"
                    >
                      <div className="text-xs tracking-widest">Producer</div>
                    </Checkbox>
                    <Checkbox
                      color="primary"
                      defaultSelected={newUser?.account_manager}
                      isSelected={newUser?.account_manager}
                      onChange={(e) => editNewUserField(e, 'account_manager')}
                      size="xs"
                    >
                      <div className="text-xs tracking-widest">
                        Account Manager
                      </div>
                    </Checkbox>
                    <Checkbox
                      color="success"
                      defaultSelected={newUser?.support}
                      isSelected={newUser?.support}
                      onChange={(e) => editNewUserField(e, 'support')}
                      size="xs"
                    >
                      <div className="text-xs tracking-widest">Support</div>
                    </Checkbox>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer
          autoMargin={false}
          className="flex items-center w-full p-4"
        >
          <div
            className={`flex w-full justify-end space-x-2  rounded-lg py-2 px-4 xl:gap-2 xl:space-x-0`}
          >
            <div>
              <Button
                size="xs"
                onClick={() => cancel()}
                color="error"
                auto
                ghost
              >
                Cancel
              </Button>
            </div>
            <div>
              <Button onClick={() => confirm()} size="xs" auto color="gradient">
                Confirm
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

const UsersSetup = ({
  users = null,
  agencyEmployees = null,
  agencyEmployeesRaw = null,
  nextCallback = null,
  dataCallback = null,
  importAllCallback = null,
}) => {
  const { type, isDark } = useTheme()
  const [newUser, setNewUser] = useState(null)
  const [importDisabled, setImportDisabled] = useState(false)

  const removeAndReset = (user) => {
    dataCallback(user, 'delete')
    setNewUser(null)
  }

  const reset = () => {
    setNewUser(null)
    setImportDisabled(false)
  }

  const confirm = () => {
    const nameOk = newUser.name.length > 3
    const emailOk = isEmail(newUser.email)
    const passwordOk = isValidPassword(newUser.password)
    const deptOk = newUser.dept.length > 3
    if (nameOk && emailOk && passwordOk && deptOk) {
      dataCallback(newUser, 'add')
      setNewUser(null)
      setImportDisabled(false)
    }
  }

  const editUser = (e) => {
    dataCallback(e, 'edit')
  }

  const createRandomPassword = () => {
    const getPassword = generatePassword()
    editNewUserField(getPassword, 'password')
  }

  const editNewUserField = (val, field) => {
    const temp = { ...newUser }
    temp[field] = val
    setNewUser(temp)
  }

  const importFromAMS = (val) => {
    const emp = agencyEmployees.find((x) => x.EmployeeCode == val)
    const temp = { ...newUser }
    temp.name = emp.fullName
    temp.email = emp.Email
    temp.account_manager = emp.Representative
    temp.producer = emp.Executive
    temp.password = generatePassword()
    temp.dept = 'Commercial Lines'
    temp.is_active = true
    temp.admin = false
    temp.owner = false
    temp.ams360_employee_code = emp.EmployeeCode
    temp.ams360_employee_codes = findSimilarEmployees(emp, agencyEmployees)
    setNewUser(temp)
    setImportDisabled(true)
  }

  const importAll = () => {
    importAllCallback()
  }

  return (
    <div className="flex flex-col w-full">
      <div className="block py-6 space-y-2 text-xs font-semibold text-center">
        <div>Add any additional users.</div>
        <div>
          It's important to create user accounts for each employee of your
          agency, whether they're set to Acive or not.{' '}
          <span className="text-rose-500">
            You will not be billed for any inactive users, they will however not
            be able to use the system.{' '}
          </span>
          Creating their user accounts lets Brinq identify which Clients and
          Policies belong to which employee.
        </div>
        <div>
          <span className="text-rose-500">
            After importing, be sure to go over each user to adjust permissions.{' '}
          </span>
          Things like Department, cannot be pulled from AMS360, so please adjust
          those accordingly. Passwords are defaulted to random words on import,
          but you can manually set them now for each user as well.
        </div>
      </div>
      <BrinqSelect
        title={'Import from AMS360'}
        placeholder={'Import from AMS360'}
        color="orange"
        initialOptions={agencyEmployees}
        labelField={'fullName'}
        valueField={'EmployeeCode'}
        keyField={'EmployeeCode'}
        initialValue={null}
        callBack={(e) => importFromAMS(e)}
        multiple={false}
        clearable={false}
        fastCallback={false}
        disabled={importDisabled}
        filterable
      />
      <div className="flex items-center justify-center w-full py-2">
        <Button size="xs" onClick={importAll} color="error" auto flat>
          Import All
        </Button>
      </div>
      <div className="flex flex-col w-full p-4 space-y-2">
        {users.map((user) => (
          <div key={user.EmployeeCode} className="relative flex w-full">
            <UserCard
              user={user}
              agencyEmployeesRaw={agencyEmployeesRaw}
              dataCallback={editUser}
            />
            <div
              className="absolute top-[-5px] right-[-5px] cursor-pointer text-rose-500"
              onClick={() => removeAndReset(user)}
            >
              {getIcon('circleX')}
            </div>
          </div>
        ))}
      </div>
      <Modal
        closeButton
        noPadding
        scroll
        className={'flex w-full items-center justify-center'}
        aria-labelledby="modal-title"
        open={newUser && importDisabled}
        onClose={reset}
      >
        <Modal.Header className="flex flex-col w-full px-4 mb-4">
          <div>Add User</div>
        </Modal.Header>
        <Modal.Body className="flex flex-col items-center w-full px-4">
          {newUser && importDisabled ? (
            <div className="flex w-full">
              <div className={`flex w-full flex-col py-4`}>
                <div className="flex flex-col w-full">
                  <div>
                    <BrinqInput
                      title={'Name'}
                      placeholder={'Name'}
                      initialValue={newUser?.name}
                      callBack={(e) => editNewUserField(e, 'name')}
                    />
                    <BrinqInput
                      color="yellow"
                      title={'Email'}
                      placeholder={'Email'}
                      initialValue={newUser?.email}
                      callBack={(e) => editNewUserField(e, 'email')}
                    />
                    <div className="relative">
                      <BrinqInput
                        color="red"
                        title={'Password'}
                        placeholder={'Password'}
                        initialValue={newUser?.password}
                        callBack={(e) => editNewUserField(e, 'password')}
                        tooltip={true}
                        tooltipContent={
                          <div className="block">
                            <div>Must be at least 6 characters in length</div>
                            <div>Maximum length allowed is 30 characters</div>
                            <div>Passwords are case sensitive</div>
                            <div>Must be alphanumeric characters only</div>
                            <div>
                              Must include at least one numeric character
                            </div>
                            <div>
                              Must include at least one upper-case character
                            </div>
                            <div>
                              Must include at least one lowercase character
                            </div>
                          </div>
                        }
                      />
                      <div
                        className="absolute top-[10px] right-[20px] cursor-pointer text-xs transition duration-100 ease-out hover:text-sky-500"
                        onClick={createRandomPassword}
                      >
                        Generate random password
                      </div>
                    </div>

                    <BrinqSelect
                      title={'Department'}
                      placeholder={'Department'}
                      color="indigo"
                      initialOptions={[
                        { value: 'Personal Lines' },
                        { value: 'Commercial Lines' },
                        { value: 'Benefits' },
                        { value: 'Operations' },
                      ]}
                      labelField={'value'}
                      valueField={'value'}
                      keyField={'value'}
                      initialValue={newUser?.dept}
                      callBack={(e) => editNewUserField(e, 'dept')}
                      multiple={false}
                      clearable={false}
                      fastCallback={false}
                      filterable
                    />
                    <BrinqSelect
                      title={'AMS360 Employee Codes'}
                      placeholder={'AMS360 Employee Codes'}
                      color="orange"
                      initialOptions={agencyEmployees}
                      labelField={'fullName'}
                      valueField={'EmployeeCode'}
                      keyField={'EmployeeCode'}
                      initialValue={newUser?.ams360_employee_codes}
                      callBack={(e) =>
                        editNewUserField(e, 'ams360_employee_codes')
                      }
                      multiple={true}
                      clearable={true}
                      filterable
                      tooltip={true}
                      tooltipContent={`These codes are used to link your AMS360 User accounts to Brinq User accounts.`}
                    />
                  </div>
                  <div className="flex flex-col w-full p-4 space-y-2">
                    <Checkbox
                      color="error"
                      defaultSelected={newUser?.admin}
                      isSelected={newUser?.admin}
                      onChange={(e) => editNewUserField(e, 'admin')}
                      size="xs"
                    >
                      <div className="text-xs tracking-widest">Admin</div>
                    </Checkbox>
                    <Checkbox
                      color="secondary"
                      defaultSelected={newUser?.owner}
                      isSelected={newUser?.owner}
                      onChange={(e) => editNewUserField(e, 'owner')}
                      size="xs"
                    >
                      <div className="text-xs tracking-widest">Owner</div>
                    </Checkbox>
                    <Checkbox
                      color="warning"
                      defaultSelected={newUser?.producer}
                      isSelected={newUser?.producer}
                      onChange={(e) => editNewUserField(e, 'producer')}
                      size="xs"
                    >
                      <div className="text-xs tracking-widest">Producer</div>
                    </Checkbox>
                    <Checkbox
                      color="primary"
                      defaultSelected={newUser?.account_manager}
                      isSelected={newUser?.account_manager}
                      onChange={(e) => editNewUserField(e, 'account_manager')}
                      size="xs"
                    >
                      <div className="text-xs tracking-widest">
                        Account Manager
                      </div>
                    </Checkbox>
                    <Checkbox
                      color="success"
                      defaultSelected={newUser?.support}
                      isSelected={newUser?.support}
                      onChange={(e) => editNewUserField(e, 'support')}
                      size="xs"
                    >
                      <div className="text-xs tracking-widest">Support</div>
                    </Checkbox>
                  </div>
                  <div className="flex w-full px-4 py-6">
                    <Checkbox
                      color="success"
                      defaultSelected={newUser?.is_active}
                      isSelected={newUser?.is_active}
                      onChange={(e) => editNewUserField(e, 'is_active')}
                      size="xs"
                    >
                      <div className="text-xs tracking-widest">Active User</div>
                    </Checkbox>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer
          autoMargin={false}
          className="flex items-center w-full p-4"
        >
          <div
            className={`flex w-full justify-end space-x-2  rounded-lg py-2 px-4 xl:gap-2 xl:space-x-0`}
          >
            <div>
              <Button size="xs" onClick={reset} color="error" auto ghost>
                Cancel
              </Button>
            </div>
            <div>
              <Button onClick={confirm} size="xs" auto color="gradient">
                Confirm
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default function Register() {
  const { type, isDark } = useTheme()
  const [tab, setTab] = useState(0)
  const [tabMax, setTabMax] = useState(4)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [wsapiCredentials, setWsapiCredentials] = useState(null)
  const [agencyInfo, setAgencyInfo] = useState(null)
  const [agencyEmployeesRaw, setAgencyEmployeesRaw] = useState(null)
  const [agencyEmployees, setAgencyEmployees] = useState(null)
  const [users, setUsers] = useState([])
  const [paymentOption, setPaymentOption] = useState('monthly')

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

  const updateUsers = (data, status) => {
    const temp = [...users]
    if (status == 'add') {
      temp.push(data)
      const tempAE = [...agencyEmployees]
      const filteredTempAE = tempAE.filter(
        (item) => !data.ams360_employee_codes.includes(item.EmployeeCode)
      )
      setAgencyEmployees(filteredTempAE)
      const sorted = sortByProperty(temp, 'name', false)
      setUsers(sorted)
    } else if (status == 'delete') {
      const filtered = temp.filter(
        (x) => x.ams360_employee_code != data.ams360_employee_code
      )
      const tempAE = [...agencyEmployees]
      const itemsToAdd = data.ams360_employee_codes.map((id) =>
        agencyEmployeesRaw.find((item) => item.EmployeeCode === id)
      )
      tempAE = tempAE.concat(itemsToAdd)
      setAgencyEmployees(tempAE)
      const sorted = sortByProperty(filtered, 'name', false)
      setUsers(sorted)
    } else if (status == 'edit') {
      const filtered = temp.filter(
        (x) => x.ams360_employee_code != data.ams360_employee_code
      )
      filtered.push(data)
      const sorted = sortByProperty(filtered, 'name', false)
      setUsers(sorted)
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
      setAgencyInfo(agency)
    }
    const employees = await useNextApi(
      'POST',
      '/api/ams360/register/agency-employees',
      token
    )
    if (employees) {
      const filterForActive = employees.filter(
        (x) =>
          x.FirstName != null
      )
      const formatted = filterForActive.map((x) => {
        return { ...x }
      })
      const addFullName = formatted.map((x) => ({
        ...x,
        fullName: x.FirstName + ' ' + x.LastName,
      }))
      const sorted = sortByProperty(addFullName, 'LastName', false)
      setAgencyEmployeesRaw(sorted)
      setAgencyEmployees(sorted)
      setNextDisabled(false)
    }
  }

  const createUserObject = (val) => {
    const emp = agencyEmployees.find((x) => x.EmployeeCode == val)
    const temp = {}
    const codes = findSimilarEmployees(emp, agencyEmployees)
    temp.name = emp.fullName
    temp.email = emp.Email
    temp.account_manager = emp.Representative
    temp.producer = emp.Executive
    temp.password = generatePassword()
    temp.dept = 'Commercial Lines'
    temp.is_active = true
    temp.admin = false
    temp.owner = false
    temp.ams360_employee_code = emp.EmployeeCode
    temp.ams360_employee_codes = codes
    return { user: temp, codes: codes }
  }

  const importAll = () => {
    let usedCodes = []
    const newUsers = []
    const filterForActive = agencyEmployees.filter(
      (x) =>
        x.EmployeeStatus == 'A'
    )
    filterForActive.forEach((employee) => {
      if (!usedCodes.includes(employee.EmployeeCode)) {
        let newUserObject = createUserObject(employee.EmployeeCode)
        newUsers.push(newUserObject.user)
        usedCodes = [...usedCodes, ...newUserObject.codes]
      }
    })
    const tempUsers = [...users, ...newUsers]
    const sorted = sortByProperty(tempUsers, 'name', false)
    setUsers(sorted)
    const tempAE = [...agencyEmployees]
    const filteredTempAE = tempAE.filter(
      (item) => !usedCodes.includes(item.EmployeeCode)
    )
    setAgencyEmployees(filteredTempAE)
  }

  const updatePaymentOption = (e) => {
    setPaymentOption(e)
  }

  const submitForCheckout = () => {
    const bundle = JSON.stringify({
      wsapiCredentials,
      agencyInfo,
      users,
    })
    const checkoutId = `checkout-${uuid()}`
    window.localStorage.setItem(checkoutId, bundle)
    const cookie = window.localStorage.getItem(checkoutId)
    // window.localStorage.removeItem(checkoutId)
  }

  const submitForCreation = async () =>  {
    const isDisabled = true
    if (isDisabled){
      return
    }
    const bundle = JSON.stringify({
      wsapi: wsapiCredentials,
      users,
    })
    const res = await useNextApi('POST',`/api/register/create-agency`, bundle)
    if (res) {
      const clientsRes = await useNextApi('GET',`/api/register/${res.uid}/create-clients`)
      return 
    }
    return null
  }

  return (
    <main className="flex w-full h-full">
      <div className="flex flex-col w-full h-full p-4 space-y-4 xl:gap-2 xl:space-y-0">
        <TabSteps tab={tab} tabMax={tabMax} />
        <div className={`flex h-[72vh] w-full overflow-y-auto rounded-lg p-4`}>
          {tab == 0 ? (
            <Introduction />
          ) : tab == 1 ? (
            <WsapiLogin
              nextCallback={nextButtonSetDisabled}
              dataCallback={updateCredentials}
              agencyEmployees={agencyEmployees}
            />
          ) : tab == 2 ? (
            <AdminSetup
              users={users}
              agencyEmployees={agencyEmployees}
              agencyEmployeesRaw={agencyEmployeesRaw}
              dataCallback={updateUsers}
              nextCallback={nextButtonSetDisabled}
            />
          ) : tab == 3 ? (
            <UsersSetup
              users={users}
              agencyEmployees={agencyEmployees}
              agencyEmployeesRaw={agencyEmployeesRaw}
              dataCallback={updateUsers}
              nextCallback={nextButtonSetDisabled}
              importAllCallback={importAll}
            />
          ) : tab == 4 ? (
            <Summary
              agencyInfo={agencyInfo}
              users={users}
              paymentOption={paymentOption}
              dataCallback={updatePaymentOption}
            />
          ) : tab == 5 ? (
            <div>5</div>
          ) : null}
        </div>
        <div className="relative flex flex-col w-full">
          <div
            className={`flex w-full justify-between space-x-2  rounded-lg py-2 px-4 xl:gap-2 xl:space-x-0`}
          >
            {tab > 3 ? (
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
                <Button
                  onClick={submitForCreation}
                  className="w-full"
                  auto
                  color="gradient"
                >
                  Checkout
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

Register.getLayout = function getLayout(page) {
  return <WebLayout>{page}</WebLayout>
}
