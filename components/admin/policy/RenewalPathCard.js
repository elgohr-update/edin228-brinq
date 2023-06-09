import {
  Button,
  Checkbox,
  Loading,
  Modal,
  Switch,
  Tooltip,
  useTheme,
} from '@nextui-org/react'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useReloadContext } from '../../../context/state'
import { getIcon, sortByProperty, useNextApi } from '../../../utils/utils'
import BrinqInput from '../../ui/input/BrinqInput'
import BrinqSelect from '../../ui/select/BrinqSelect'

function RenewalPathCard({ path, task, indx }) {
  const { type } = useTheme()
  const [showModal, setShowModal] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [loading, setLoading] = useState(false)
  const { reload, setReload } = useReloadContext()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    setEditTask({ ...task })
  }, [task])

  const closeModal = () => {
    setShowModal(false)
    setLoading(false)
    setShowDeleteModal(false)
  }

  const changeTask = (e, field) => {
    const newTask = { ...editTask }
    newTask[field] = e
    setEditTask({
      ...newTask,
    })
  }

  const assignmentOptions = [
    {
      id: 1,
      value: 'am',
      label: 'Account Manager',
    },
    {
      id: 1,
      value: 'ae',
      label: 'Producer',
    },
  ]

  const submit = async () => {
    const res = await useNextApi(
      'PUT',
      `/api/paths/template/${editTask.id}`,
      JSON.stringify(editTask)
    )
    if (res) {
      closeModal()
      setReload({
        ...reload,
        paths: true,
      })
    }
  }

  const remove = async () => {
    setLoading(true)
    const res = await useNextApi('DELETE', `/api/paths/template/${editTask.id}`)
    if (res) {
      closeModal()
      setReload({
        ...reload,
        paths: true,
      })
    }
  }

  return (
    <>
      <div
        className={`${
          task.archived ? 'opacity-60' : ''
        } items-between flex min-w-[200px] flex-col rounded-lg panel-theme-${type} ${type}-shadow p-4`}
        onClick={() => setShowModal(!showModal)}
      >
        <div className="flex w-full">
          <div className="flex w-full pb-4 text-xs font-bold">{task.title}</div>
          <div className="mt-[-10px] mr-[-10px]">
            <div
              className={`${
                !task.archived ? 'bg-emerald-500' : 'bg-red-500'
              } h-[15px] w-[15px] ${type}-shadow rounded-full border-[1px]`}
            ></div>
          </div>
        </div>
        <div className="flex items-end justify-between w-full h-full">
          <div className="flex flex-col">
            <h4>{task.daysDue <= 0 ? 'Days Before' : 'Days After'}</h4>
            <div className="text-xs font-bold">{Math.abs(task.daysDue)}</div>
          </div>
        </div>
      </div>
      <div className="flex items-center h-full">
        {path.base_tasks.length == indx + 1 ? (
          <div
            className={`flex h-[10px] w-[30px] items-center justify-center rounded-r-full text-5xl text-red-500 ${type}-shadow `}
          >
            {getIcon('stopSign')}
          </div>
        ) : sortByProperty(path.base_tasks, 'daysDue', false)[
            indx + 1 != path.base_tasks.length ? indx + 1 : 0
          ]['daysDue'] >= 0 && task.daysDue <= 0 ? (
          <div
            className={`flex h-[10px] w-[30px] items-center justify-center rounded-r-full text-5xl text-violet-500 ${type}-shadow `}
          >
            {getIcon('renewalCircle')}
          </div>
        ) : (
          <div
            className={`flex h-[10px] w-[30px] items-center justify-center rounded-r-full text-5xl text-sky-500 ${type}-shadow `}
          >
            {getIcon('arrowRight')}
          </div>
        )}
      </div>

      <Modal
        closeButton
        noPadding
        scroll
        width={'600px'}
        className={'flex w-full items-center justify-center'}
        aria-labelledby="modal-title"
        open={showModal}
        onClose={() => closeModal()}
      >
        <Modal.Body className="flex flex-col w-full">
          <div className="flex flex-col w-full h-full gap-4 p-4 overflow-x-hidden">
            <div className="flex items-center w-full gap-4">
              <BrinqInput
                title="Task Title"
                color="blue"
                placeholder="Task Title"
                callBack={(e) => changeTask(e, 'title')}
                underlined={false}
                borderd={true}
                disabled={false}
                clearable={false}
                initialValue={editTask?.title}
              />
              <div className="flex flex-col items-end justify-end">
                <h6 className="mb-2">Active</h6>
                <Switch
                  checked={!editTask?.archived}
                  color="success"
                  size="xs"
                  onChange={(e) => changeTask(!e.target.checked, 'archived')}
                />
              </div>
            </div>
            <BrinqInput
              title="Days Due Before/After Renewal"
              color="red"
              placeholder="Days Due Before/After Renewal"
              callBack={(e) => changeTask(e, 'daysDue')}
              inputType="number"
              underlined={false}
              borderd={true}
              disabled={false}
              clearable={false}
              initialValue={editTask?.daysDue}
            />
          </div>
        </Modal.Body>
        <Modal.Footer
          autoMargin={false}
          className="flex items-center w-full p-4"
        >
          <div className="flex flex-col w-full">
            <div className="flex items-center w-full gap-2">
              <div className="w-full">
                <Button
                  disabled={loading}
                  auto
                  color="gradient"
                  className="w-full"
                  onClick={() => submit()}
                >
                  {loading ? (
                    <Loading
                      type="points-opacity"
                      color="currentColor"
                      size="md"
                    />
                  ) : (
                    <div>Submit</div>
                  )}
                </Button>
              </div>
              <div>
                <Button
                  disabled={loading}
                  auto
                  color="warning"
                  className="w-full"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <div>Delete</div>
                </Button>
                <Modal
                  closeButton
                  noPadding
                  scroll
                  className={'flex w-full items-center justify-center'}
                  aria-labelledby="modal-title"
                  open={showDeleteModal}
                  onClose={() => setShowDeleteModal(false)}
                >
                  <Modal.Body>Are you sure?</Modal.Body>
                  <Modal.Footer
                    autoMargin={false}
                    className="flex items-center w-full p-4"
                  >
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-center w-full gap-2">
                        <div>
                          <Button
                            disabled={loading}
                            auto
                            color="secondary"
                            className="w-full"
                            onClick={() => remove()}
                            size={'xs'}
                          >
                            <div>Delete</div>
                          </Button>
                        </div>
                        <div>
                          <Button
                            disabled={loading}
                            auto
                            color="error"
                            className="w-full"
                            onClick={() => setShowDeleteModal(false)}
                            size={'xs'}
                          >
                            <div>Cancel</div>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Modal.Footer>
                </Modal>
              </div>
              <div>
                <Button
                  disabled={loading}
                  auto
                  color="error"
                  className="w-full"
                  onClick={() => closeModal()}
                >
                  <div>Cancel</div>
                </Button>
              </div>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default RenewalPathCard
