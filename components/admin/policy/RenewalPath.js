import { Button, Loading, Modal, Switch, useTheme } from '@nextui-org/react'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useReloadContext } from '../../../context/state'
import { getIcon, sortByProperty, useNextApi } from '../../../utils/utils'
import BrinqInput from '../../ui/input/BrinqInput'
import LineIcon from '../../util/LineIcon'
import RenewalPathCard from './RenewalPathCard'

function RenewalPath({ path, allPaths = [] }) {
  const { type } = useTheme()
  const [pathData, setPathData] = useState(null)
  const [editName, setEditName] = useState(path.title)
  const [showEditName, setShowEditName] = useState(false)
  const [showInactive, setShowInactive] = useState(false)
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false)
  const [showRulesModal, setShowRulesModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    title: '',
    daysDue: '',
  })
  const [loading, setLoading] = useState(false)
  const { reload, setReload } = useReloadContext()

  useEffect(() => {
    setPathData(path)
    return () => {}
  }, [path])

  const filteredPath = () =>
    pathData && showInactive
      ? pathData?.base_tasks
      : pathData?.base_tasks.filter((x) => x.archived != true)

  const changePath = (e, field) => {
    const newPath = { ...pathData }
    newPath[field] = e
    setPathData({
      ...newPath,
    })
  }

  const cancelEditName = () => {
    setEditName(path.title)
    setShowEditName(false)
  }

  const changeDefault = async (e) => {
    if (allPaths.length > 1) {
      changePath(e, 'default_template')
      const bundle = {
        title: editName,
        default_template: e,
      }
      const res = await useNextApi(
        'PUT',
        `/api/paths/${path.id}`,
        JSON.stringify(bundle)
      )
      if (res) {
        setShowEditName(false)
      }
    }
  }

  const submitNewName = async () => {
    const bundle = {
      title: editName,
      default_template: pathData.default_template,
    }
    const res = await useNextApi(
      'PUT',
      `/api/paths/${path.id}`,
      JSON.stringify(bundle)
    )
    if (res) {
      setShowEditName(false)
    }
  }

  const changeTask = (e, field) => {
    const newTask = { ...newTemplate }
    newTask[field] = e
    setNewTemplate({
      ...newTask,
    })
  }

  const closeModal = () => {
    setShowNewTemplateModal(false)
    setLoading(false)
    setNewTemplate({
      title: '',
      daysDue: '',
    })
  }

  const submit = async () => {
    setLoading(true)
    const bundle = { pathId: path.id, ...newTemplate }
    const res = await useNextApi(
      'POST',
      `/api/paths/${path.id}/`,
      JSON.stringify(bundle)
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
    const res = await useNextApi('DELETE', `/api/paths/${path?.id}`)
    if (res) {
      closeModal()
      setReload({
        ...reload,
        paths: true,
      })
    }
  }

  return (
    <div
      className={`flex flex-col rounded-2xl p-4 panel-theme-${type} ${type}-shadow`}
    >
      <div className="flex items-center w-full gap-4">
        <div className="flex min-w-[200px] items-center pl-2">
          <div className="pr-2">
            <LineIcon iconSize={20} size="sm" line={path?.line} />
          </div>
          {!showEditName ? (
            <>
              <h6 className="flex items-center">{editName}</h6>
              <Button
                light
                size="xs"
                auto
                onClick={() => setShowEditName(!showEditName)}
              >
                <div className="flex items-center">{getIcon('edit')}</div>
              </Button>
            </>
          ) : (
            <>
              <BrinqInput
                color="lime"
                placeholder="Change Renewal Path Name"
                callBack={(e) => setEditName(e)}
                inputType="text"
                underlined={false}
                value={editName}
                initialValue={editName}
                borderd={true}
                disabled={false}
                clearable={false}
              />
              <Button
                light
                size="xs"
                color="success"
                auto
                onClick={() => submitNewName()}
              >
                <div className="flex items-center">
                  {getIcon('circleCheck')}
                </div>
              </Button>
              <Button
                light
                color="error"
                size="xs"
                auto
                onClick={() => cancelEditName()}
              >
                <div className="flex items-center">{getIcon('circleX')}</div>
              </Button>
            </>
          )}
        </div>
        <div className="flex items-center justify-end w-full gap-2">
          <div className="flex flex-col items-end justify-end">
            <Button
              flat
              color="warning"
              size="xs"
              disabled={allPaths.length <= 1}
              auto
              onClick={() => setShowRulesModal(true)}
            >
              <div className="flex items-center justify-center text-center">
                <div>Rules</div>
                <div className="flex items-center pl-2">
                  {getIcon('filter')}
                </div>
              </div>
            </Button>
          </div>
          <div className="flex flex-col items-end justify-end">
            <Button
              flat
              color="primary"
              size="xs"
              auto
              onClick={() => setShowNewTemplateModal(true)}
            >
              <div className="flex items-center justify-center text-center">
                <div>Create</div>
                <div className="flex items-center pl-2">{getIcon('plus')}</div>
              </div>
            </Button>
          </div>
          {path?.base_tasks.length < 1 ? (
            <div className="flex flex-col items-end justify-end">
              <Button
                flat
                color="error"
                size="xs"
                auto
                onClick={() => setShowDeleteModal(true)}
              >
                <div className="flex items-center justify-center text-center">
                  <div>Delete</div>
                  <div className="flex items-center pl-2">
                    {getIcon('trash')}
                  </div>
                </div>
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
          ) : null}

          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end justify-end">
              <h4>Default Path</h4>
              <Switch
                checked={pathData?.default_template}
                size="xs"
                disabled={allPaths.length <= 1}
                onChange={(e) =>
                  allPaths.length > 1 ? changeDefault(e.target.checked) : null
                }
              />
            </div>
            <div className="flex flex-col items-end justify-end">
              <h4>Show Inactive</h4>
              <Switch
                checked={showInactive}
                size="xs"
                onChange={(e) => setShowInactive(e.target.checked)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full max-w-[86vw] gap-4 overflow-x-auto px-2 py-4 xl:max-w-[93vw]">
        {sortByProperty(filteredPath(), 'daysDue', false).map((task, indx) => (
          <RenewalPathCard key={task.id} indx={indx} path={path} task={task} />
        ))}
      </div>
      <Modal
        closeButton
        noPadding
        scroll
        width={'600px'}
        className={'flex w-full items-center justify-center'}
        aria-labelledby="modal-title"
        open={showNewTemplateModal}
        onClose={() => closeModal()}
      >
        <Modal.Body className="flex flex-col w-full">
          <div className="flex flex-col w-full h-full gap-4 p-4 overflow-x-hidden">
            <BrinqInput
              title="Task Title"
              color="blue"
              placeholder="Task Title"
              callBack={(e) => changeTask(e, 'title')}
              underlined={false}
              borderd={true}
              disabled={false}
              clearable={false}
              initialValue={newTemplate?.title}
            />
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
              initialValue={newTemplate?.daysDue}
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
                    <div>Create</div>
                  )}
                </Button>
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
    </div>
  )
}

export default RenewalPath
