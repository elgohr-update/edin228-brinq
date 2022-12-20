import {
  Table,
  useTheme,
  Input,
  useCollator,
  Button,
  Modal,
  Tooltip,
  Checkbox,
  Image,
} from '@nextui-org/react'
import React, { useEffect, useRef, useState } from 'react'
import {
  getSearch,
  getIcon,
  sortByProperty,
  useNextApi,
} from '../../utils/utils'
import UserAvatar from '../user/Avatar'
import BrinqSelect from '../ui/select/BrinqSelect'
import BrinqInput from '../ui/input/BrinqInput'
import ImageUploader from '../files/UserImageUploader'

const UserProfilePicture = ({ user = null, newUser=false, callback }) => {
  const [imageSrc, setImageSrc] = useState(null)

  useEffect(() => {
    const handleUpdate = async () => {
      setImageSrc(user.image_file)
    }
    handleUpdate()
    return () => {}
  }, [user])

  const onSave = (e) => {
    setImageSrc(e)
    callback(e)
  }
  return (
    <div className="flex items-center justify-center w-full mb-2 overflow-hidden rounded-lg">
      <ImageUploader user={user} newUser={newUser} showLargeButton onSave={(e) => onSave(e)}>
        {imageSrc?.length > 0 ? (
          <Image
            showSkeleton
            maxDelay={10000}
            width={200}
            height={200}
            src={imageSrc}
            alt="Default Image"
            objectFit="cover"
            className="rounded-lg"
          />
        ) : (
          <div className="flex h-[200px] w-[200px] items-center justify-center rounded-lg bg-zinc-900">
            <div className="flex flex-col items-center justify-center">
              <div className="text-2xl ">{getIcon('imagePlus')}</div>
              <div className="text-xs tracking-widest uppercase">
                Profile Picture
              </div>
            </div>
          </div>
        )}
      </ImageUploader>
    </div>
  )
}

export default function UsersTable({ data = null, callback = null }) {
  const [pageSize, setPageSize] = useState(20)
  const [rows, setRows] = useState(data)
  const [tableData, setTableData] = useState(data)
  const [sortDescriptor, setSortDescriptor] = useState('ascending')
  const [selectedUser, setSelectedUser] = useState(null)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    producer: false,
    account_manager: false,
    support: false,
    dept: 'Commercial Lines',
    is_active: false,
    ams360_user: true,
    owner: false,
    admin: false,
    image_file: '',
    ams360_employee_code: '',
    ams360_employee_codes: [],
    password: '',
  })
  const [showEditUserModal, setShowEditUserModal] = useState(false)
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false)
  const [showNewUserModal, setShowNewUserModal] = useState(false)
  const [AMSEmployeeList, setAMSEmployeeList] = useState(null)

  const runOnce = useRef(true)
  const pageSizeOptions = [
    { id: 15, value: '15' },
    { id: 20, value: '20' },
    { id: 25, value: '25' },
    { id: 30, value: '30' },
    { id: 35, value: '35' },
    { id: 40, value: '40' },
    { id: 45, value: '45' },
    { id: 50, value: '50' },
  ]

  useEffect(() => {
    const handleUpdate = async () => {
      const sortByActive = sortByProperty(data, 'is_active')
      setRows(sortByActive)
      setTableData(sortByActive)
      const res = await useNextApi('GET', `/api/ams360/employee`)
      const addFullName = res.map((x) => ({
        ...x,
        fullName: x.FirstName + ' ' + x.LastName,
      }))
      setAMSEmployeeList(addFullName)
      runOnce.current = false
    }
    if (runOnce.current && data) {
      handleUpdate()
      runOnce.current = true
    }
    return () => {}
  }, [data])

  const searchTable = (val) => {
    if (val.length > 1) {
      const filtered = getSearch(rows, val)
      setTableData(filtered)
    } else {
      setTableData(rows)
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'name',
      centerColumnHeader: false,
    },
    {
      key: 'dept',
      label: 'dept',
      centerColumnHeader: false,
    },
    {
      key: 'owner',
      label: 'role',
      centerColumnHeader: false,
    },
    {
      key: 'is_active',
      label: 'status',
      centerColumnHeader: false,
    },
    {
      key: 'actions',
      label: 'actions',
      centerColumnHeader: true,
    },
  ]

  const renderCell = (item, columnKey) => {
    const cellValue = item[columnKey]
    switch (columnKey) {
      case 'name':
        return (
          <div
            className={`${
              item.is_active ? '' : 'opacity-50'
            } flex w-[200px] items-center`}
          >
            <UserAvatar
              tooltip={true}
              tooltipPlacement="topEnd"
              isUser={true}
              passUser={item}
              isGrouped={true}
              squared={true}
              size={`sm`}
              userWithName
              userEmail
            />
          </div>
        )
      case 'owner':
        return (
          <div
            className={`${
              item.is_active ? '' : 'opacity-50'
            } flex flex-wrap items-center space-y-2 lg:gap-2 lg:space-y-0`}
          >
            {item.admin ? (
              <div className="flex min-w-[65px] items-center justify-center rounded-md bg-red-500/20 px-2 text-[0.55rem] font-bold uppercase tracking-widest text-red-500">
                admin
              </div>
            ) : (
              ''
            )}
            {item.owner ? (
              <div className="flex min-w-[65px] items-center justify-center rounded-md bg-purple-500/20 px-2 text-[0.55rem] font-bold uppercase tracking-widest text-purple-500">
                owner
              </div>
            ) : (
              ''
            )}
            {item.producer ? (
              <div className="flex min-w-[65px] items-center justify-center rounded-md bg-orange-500/20 px-2 text-[0.55rem] font-bold uppercase tracking-widest text-orange-500">
                producer
              </div>
            ) : (
              ''
            )}
            {item.account_manager ? (
              <div className="flex min-w-[65px] items-center justify-center rounded-md bg-sky-500/20 px-2 text-[0.55rem] font-bold uppercase tracking-widest text-sky-500">
                account manager
              </div>
            ) : (
              ''
            )}
            {item.support ? (
              <div className="flex min-w-[65px] items-center justify-center rounded-md bg-yellow-500/20 px-2 text-[0.55rem] font-bold uppercase tracking-widest text-yellow-500">
                support
              </div>
            ) : (
              ''
            )}
          </div>
        )
      case 'is_active':
        return (
          <div
            className={`${
              item.is_active ? '' : 'opacity-50'
            } flex items-center`}
          >
            {cellValue ? (
              <div className="flex w-[65px] items-center justify-center rounded-md bg-emerald-500/20 text-[0.65rem] font-bold tracking-widest text-emerald-500">
                ACTIVE
              </div>
            ) : (
              <div className="flex w-[65px] items-center justify-center rounded-md bg-rose-500/20 text-[0.65rem] font-bold tracking-widest text-rose-500">
                INACTIVE
              </div>
            )}
          </div>
        )
      case 'actions':
        return (
          <div
            className={`${
              item.is_active ? '' : 'opacity-50'
            } flex items-center justify-center space-x-2`}
          >
            <Tooltip content={'Edit'}>
              <Button
                auto
                ghost
                size="xs"
                onClick={() => openEditUserModal(item)}
              >
                {getIcon('edit')}
              </Button>
            </Tooltip>
            <Tooltip content={'Delete'}>
              <Button
                auto
                ghost
                color="error"
                size="xs"
                onClick={() => openDeleteUserModal(item)}
              >
                {getIcon('trash')}
              </Button>
            </Tooltip>
          </div>
        )
      default:
        return (
          <div className={`${item.is_active ? '' : 'opacity-50'} text-xs`}>
            {cellValue}
          </div>
        )
    }
  }

  const collator = useCollator({ numeric: true })

  async function sort(sortDescriptor) {
    setSortDescriptor(sortDescriptor)
    const sorted = tableData?.sort((a, b) => {
      let first = a[sortDescriptor.column]
      let second = b[sortDescriptor.column]
      let cmp = collator.compare(first, second)
      if (sortDescriptor.direction === 'descending') {
        cmp *= -1
      }
      return cmp
    })
  }

  const forceSort = (data) => {
    const sorted = data.sort((a, b) => {
      let first = a[sortDescriptor.column]
      let second = b[sortDescriptor.column]
      let cmp = collator.compare(first, second)
      if (sortDescriptor.direction === 'descending') {
        cmp *= -1
      }
      return cmp
    })
    return sorted
  }

  const pageSizeSet = (e) => {
    setPageSize(e)
  }
  const openEditUserModal = (user) => {
    const tempUser = {
      ...user,
      password: null,
      ams360_employee_codes: user.ams360employees.map((x) => x.EmployeeCode),
    }
    setSelectedUser(tempUser)
    setShowEditUserModal(true)
  }
  const openNewUserModal = () => {
    setShowNewUserModal(true)
  }
  const openDeleteUserModal = (user) => {
    const tempUser = { ...user }
    setSelectedUser(tempUser)
    setShowDeleteUserModal(true)
  }
  const deleteUser = async () => {
    const res = await useNextApi('DELETE', `/api/users/${selectedUser.id}/`)
    if (res) {
      callback()
      setShowDeleteUserModal(false)
    }
  }
  const editUser = async () => {
    const bundle = {
      id: selectedUser.id,
      name: selectedUser.name,
      email: selectedUser.email,
      producer: selectedUser.producer,
      account_manager: selectedUser.account_manager,
      support: selectedUser.support,
      dept: selectedUser.dept,
      is_active: selectedUser.is_active,
      ams360_user: selectedUser.ams360_user,
      owner: selectedUser.owner,
      admin: selectedUser.admin,
      image_file: selectedUser.image_file,
      ams360_employee_code: selectedUser.ams360_employee_code,
      ams360_employee_codes: selectedUser.ams360_employee_codes,
      password: selectedUser.password,
    }
    const res = await useNextApi(
      'PUT',
      `/api/users/${selectedUser.id}/`,
      JSON.stringify(bundle)
    )
    if (res) {
      callback()
      setShowEditUserModal(false)
    }
  }

  const createNewUser = async () => {
    const bundle = { ...newUser }
    const res = await useNextApi('POST', `/api/users/`, JSON.stringify(bundle))
    if (res) {
      callback()
      setShowNewUserModal(false)
    }
  }

  const editUserField = (val, field) => {
    const temp = { ...selectedUser }
    temp[field] = val
    setSelectedUser(temp)
  }
  const editNewUserField = (val, field) => {
    const temp = { ...newUser }
    temp[field] = val
    setNewUser(temp)
  }

  const importFromAMS = (val) => {
    const emp = AMSEmployeeList.find((x) => x.EmployeeCode == val)
    const temp = { ...newUser }
    temp.name = emp.fullName
    temp.email = emp.Email
    temp.account_manager = emp.Representative
    temp.producer = emp.Executive
    temp.is_active = true
    temp.ams360_employee_code = emp.EmployeeCode
    temp.ams360_employee_codes = [emp.EmployeeCode]
    setNewUser(temp)
  }

  return (
    <div className="flex flex-col w-full h-full md:flex-row">
      <div className="flex flex-col w-full h-full md:px-2">
        <div className="flex flex-col items-center justify-between w-full py-4 space-y-2 lg:h-16 lg:flex-row lg:space-y-0">
          <div className="flex w-full">
            <div className="flex items-center w-full pr-2">
              <Input
                className={`z-10`}
                type="search"
                aria-label="Table Search Bar"
                size="sm"
                fullWidth
                underlined
                placeholder="Search"
                labelLeft={getIcon('search')}
                onChange={(e) => searchTable(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-end">
              <div>
                <Tooltip content={'Create New User'}>
                  <Button
                    color="gradient"
                    size="sm"
                    auto
                    onClick={openNewUserModal}
                  >
                    {getIcon('plus')}
                  </Button>
                </Tooltip>
              </div>
              <div>
                <BrinqSelect
                  fullWidth={false}
                  callBack={pageSizeSet}
                  initialValue={pageSize}
                  initialOptions={pageSizeOptions}
                  labelField={'value'}
                  clearable={false}
                />
              </div>
            </div>
          </div>
        </div>
        {data ? (
          <Table
            hoverable={true}
            compact
            sticked
            bordered={false}
            animated="true"
            shadow={false}
            lined={true}
            aria-label="Renewals Table"
            sortDescriptor={sortDescriptor}
            onSortChange={(s) => sort(s)}
            css={{
              height: '100%',
              minWidth: '100%',
              borderWidth: '0px',
            }}
          >
            <Table.Header columns={columns}>
              {(column) => (
                <Table.Column key={column.key} allowsSorting>
                  <div
                    className={`${
                      column.centerColumnHeader ? 'justify-center' : ''
                    } table-column-header flex items-center px-1 text-xs`}
                  >
                    {column.label}
                  </div>
                </Table.Column>
              )}
            </Table.Header>
            <Table.Body items={tableData}>
              {(item) => (
                <Table.Row>
                  {(columnKey) => (
                    <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
                  )}
                </Table.Row>
              )}
            </Table.Body>
            {tableData?.length > pageSize ? (
              <Table.Pagination
                shadow
                align="start"
                noMargin
                total={Math.ceil(Number(tableData?.length / pageSize))}
                rowsPerPage={pageSize}
              />
            ) : null}
          </Table>
        ) : null}
        <Modal
          closeButton
          noPadding
          scroll
          className={'flex w-full items-center justify-center'}
          aria-labelledby="modal-title"
          open={showDeleteUserModal}
          onClose={() => setShowDeleteUserModal(false)}
        >
          <Modal.Header className="flex flex-col w-full px-4 mb-4">
            <div>Are you sure you want to delete this user?</div>
          </Modal.Header>
          <Modal.Body className="flex flex-col items-center w-full px-4 py-8">
            <div>
              <UserAvatar
                tooltip={true}
                tooltipPlacement="topEnd"
                isUser={true}
                passUser={selectedUser}
                isGrouped={true}
                squared={true}
                size={`sm`}
                userWithName
              />
            </div>
          </Modal.Body>
          <Modal.Footer
            autoMargin={false}
            className="flex items-center justify-center w-full p-4"
          >
            <div className="flex items-center w-full space-x-2">
              <Button auto flat onClick={() => deleteUser()}>
                Yes
              </Button>
              <div className="flex w-full">
                <Button
                  auto
                  flat
                  color="error"
                  className="w-full"
                  onClick={() => setShowDeleteUserModal(false)}
                >
                  No
                </Button>
              </div>
            </div>
          </Modal.Footer>
        </Modal>
        <Modal
          closeButton
          noPadding
          scroll
          className={'flex w-full items-center justify-center'}
          aria-labelledby="modal-title"
          open={showEditUserModal}
          onClose={() => setShowEditUserModal(false)}
        >
          <Modal.Header className="flex flex-col w-full px-4 mb-4">
            <div>Edit User</div>
          </Modal.Header>
          <Modal.Body className="flex flex-col items-center w-full px-4">
            {selectedUser ? (
              <div className="w-full">
                <UserProfilePicture
                  user={selectedUser}
                  callback={(e) => editUserField(e, 'image_file')}
                />
                <BrinqInput
                  title={'Name'}
                  placeholder={'Name'}
                  initialValue={selectedUser?.name}
                  callBack={(e) => editUserField(e, 'name')}
                />
                <BrinqInput
                  color="yellow"
                  title={'Email'}
                  placeholder={'Email'}
                  initialValue={selectedUser?.email}
                  callBack={(e) => editUserField(e, 'email')}
                />
                <BrinqInput
                  color="red"
                  title={'Reset Password'}
                  placeholder={'Reset Password'}
                  inputType={'password'}
                  callBack={(e) => editUserField(e, 'password')}
                />
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
                  initialValue={selectedUser?.dept}
                  callBack={(e) => editUserField(e, 'dept')}
                  multiple={false}
                  clearable={false}
                  fastCallback={false}
                  filterable
                />
                <BrinqSelect
                  title={'AMS360 Employee Code'}
                  placeholder={'AMS360 Employee Code'}
                  color="orange"
                  initialOptions={AMSEmployeeList}
                  labelField={'fullName'}
                  valueField={'EmployeeCode'}
                  keyField={'EmployeeCode'}
                  initialValue={selectedUser?.ams360_employee_code}
                  callBack={(e) => editUserField(e, 'ams360_employee_code')}
                  multiple={false}
                  clearable={false}
                  fastCallback={false}
                  filterable
                />
                <BrinqSelect
                  title={'Extra AMS360 Employee Codes'}
                  placeholder={'Extra AMS360 Employee Codes'}
                  color="orange"
                  initialOptions={AMSEmployeeList}
                  labelField={'fullName'}
                  valueField={'EmployeeCode'}
                  keyField={'EmployeeCode'}
                  initialValue={selectedUser.ams360_employee_codes}
                  callBack={(e) => editUserField(e, 'ams360_employee_codes')}
                  multiple={true}
                  clearable={true}
                  filterable
                />
                <div className="flex flex-col w-full p-4 space-y-2">
                  <Checkbox
                    color="error"
                    defaultSelected={selectedUser.admin}
                    isSelected={selectedUser.admin}
                    onChange={(e) => editUserField(e, 'admin')}
                    size="xs"
                  >
                    <div className="text-xs tracking-widest">Admin</div>
                  </Checkbox>
                  <Checkbox
                    color="secondary"
                    defaultSelected={selectedUser.owner}
                    isSelected={selectedUser.owner}
                    onChange={(e) => editUserField(e, 'owner')}
                    size="xs"
                  >
                    <div className="text-xs tracking-widest">Owner</div>
                  </Checkbox>
                  <Checkbox
                    color="warning"
                    defaultSelected={selectedUser.producer}
                    isSelected={selectedUser.producer}
                    onChange={(e) => editUserField(e, 'producer')}
                    size="xs"
                  >
                    <div className="text-xs tracking-widest">Producer</div>
                  </Checkbox>
                  <Checkbox
                    color="primary"
                    defaultSelected={selectedUser.account_manager}
                    isSelected={selectedUser.account_manager}
                    onChange={(e) => editUserField(e, 'account_manager')}
                    size="xs"
                  >
                    <div className="text-xs tracking-widest">
                      Account Manager
                    </div>
                  </Checkbox>
                  <Checkbox
                    color="success"
                    defaultSelected={selectedUser.support}
                    isSelected={selectedUser.support}
                    onChange={(e) => editUserField(e, 'support')}
                    size="xs"
                  >
                    <div className="text-xs tracking-widest">Support</div>
                  </Checkbox>
                  <div className="py-8">
                    <Checkbox
                      color="success"
                      defaultSelected={selectedUser.is_active}
                      isSelected={selectedUser.is_active}
                      onChange={(e) => editUserField(e, 'is_active')}
                      size="xs"
                    >
                      <div className="text-xs tracking-widest">Active</div>
                    </Checkbox>
                  </div>
                </div>
              </div>
            ) : null}
          </Modal.Body>
          <Modal.Footer
            autoMargin={false}
            className="flex items-center w-full p-4"
          >
            <div className="flex items-center w-full space-x-2">
              <div className="flex w-full">
                <Button
                  className="w-full"
                  color="gradient"
                  size="xs"
                  onClick={() => editUser()}
                >
                  Save
                </Button>
              </div>
              <Button
                auto
                flat
                color="error"
                size="xs"
                onClick={() => setShowEditUserModal(false)}
              >
                Cancel
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
        <Modal
          closeButton
          noPadding
          scroll
          className={'flex w-full items-center justify-center'}
          aria-labelledby="modal-title"
          open={showNewUserModal}
          onClose={() => setShowNewUserModal(false)}
        >
          <Modal.Header className="flex flex-col w-full px-4 mb-4">
            <div>New User</div>
          </Modal.Header>
          <Modal.Body className="flex flex-col items-center w-full px-4">
            {newUser ? (
              <div className="w-full">
                <UserProfilePicture
                  user={newUser}
                  newUser={true}
                  callback={(e) => editNewUserField(e, 'image_file')}
                />
                <BrinqSelect
                  title={'Import from AMS360'}
                  placeholder={'Import from AMS360'}
                  color="orange"
                  initialOptions={AMSEmployeeList}
                  labelField={'fullName'}
                  valueField={'EmployeeCode'}
                  keyField={'EmployeeCode'}
                  initialValue={null}
                  callBack={(e) => importFromAMS(e)}
                  multiple={false}
                  clearable={false}
                  fastCallback={false}
                  filterable
                />
                <div className="relative flex items-center justify-center w-full my-4">
                  <div className="search-border-flair pink-to-blue-gradient-1 !relative z-30 flex w-[80%] justify-center" />
                </div>
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
                <BrinqInput
                  color="red"
                  title={'Password'}
                  placeholder={'Password'}
                  inputType={'password'}
                  callBack={(e) => editNewUserField(e, 'password')}
                />
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
                  title={'AMS360 Employee Code'}
                  placeholder={'AMS360 Employee Code'}
                  color="orange"
                  initialOptions={AMSEmployeeList}
                  labelField={'fullName'}
                  valueField={'EmployeeCode'}
                  keyField={'EmployeeCode'}
                  initialValue={newUser?.ams360_employee_code}
                  callBack={(e) => editNewUserField(e, 'ams360_employee_code')}
                  multiple={false}
                  clearable={false}
                  fastCallback={false}
                  filterable
                />
                <BrinqSelect
                  title={'Extra AMS360 Employee Codes'}
                  placeholder={'Extra AMS360 Employee Codes'}
                  color="orange"
                  initialOptions={AMSEmployeeList}
                  labelField={'fullName'}
                  valueField={'EmployeeCode'}
                  keyField={'EmployeeCode'}
                  initialValue={newUser.ams360_employee_codes}
                  callBack={(e) => editNewUserField(e, 'ams360_employee_codes')}
                  multiple={true}
                  clearable={true}
                  filterable
                />
                <div className="flex flex-col w-full p-4 space-y-2">
                  <Checkbox
                    color="error"
                    defaultSelected={newUser.admin}
                    isSelected={newUser.admin}
                    onChange={(e) => editNewUserField(e, 'admin')}
                    size="xs"
                  >
                    <div className="text-xs tracking-widest">Admin</div>
                  </Checkbox>
                  <Checkbox
                    color="secondary"
                    defaultSelected={newUser.owner}
                    isSelected={newUser.owner}
                    onChange={(e) => editNewUserField(e, 'owner')}
                    size="xs"
                  >
                    <div className="text-xs tracking-widest">Owner</div>
                  </Checkbox>
                  <Checkbox
                    color="warning"
                    defaultSelected={newUser.producer}
                    isSelected={newUser.producer}
                    onChange={(e) => editNewUserField(e, 'producer')}
                    size="xs"
                  >
                    <div className="text-xs tracking-widest">Producer</div>
                  </Checkbox>
                  <Checkbox
                    color="primary"
                    defaultSelected={newUser.account_manager}
                    isSelected={newUser.account_manager}
                    onChange={(e) => editNewUserField(e, 'account_manager')}
                    size="xs"
                  >
                    <div className="text-xs tracking-widest">
                      Account Manager
                    </div>
                  </Checkbox>
                  <Checkbox
                    color="success"
                    defaultSelected={newUser.support}
                    isSelected={newUser.support}
                    onChange={(e) => editNewUserField(e, 'support')}
                    size="xs"
                  >
                    <div className="text-xs tracking-widest">Support</div>
                  </Checkbox>
                  <div className="py-8">
                    <Checkbox
                      color="success"
                      defaultSelected={newUser.is_active}
                      isSelected={newUser.is_active}
                      onChange={(e) => editNewUserField(e, 'is_active')}
                      size="xs"
                    >
                      <div className="text-xs tracking-widest">Active</div>
                    </Checkbox>
                  </div>
                </div>
              </div>
            ) : null}
          </Modal.Body>
          <Modal.Footer
            autoMargin={false}
            className="flex items-center w-full p-4"
          >
            <div className="flex items-center w-full space-x-2">
              <div className="flex w-full">
                <Button
                  className="w-full"
                  color="gradient"
                  size="xs"
                  onClick={() => createNewUser()}
                >
                  Create
                </Button>
              </div>
              <Button
                auto
                flat
                color="error"
                size="xs"
                onClick={() => setShowNewUserModal(false)}
              >
                Cancel
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  )
}
