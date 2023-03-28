import {
  Button,
  Checkbox,
  Loading,
  Modal,
  Switch,
  useTheme,
} from '@nextui-org/react'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useReloadContext } from '../../../context/state'
import {
  getIcon,
  sortByProperty,
  timeout,
  useNextApi,
} from '../../../utils/utils'
import BrinqInput from '../../ui/input/BrinqInput'
import PanelTitle from '../../ui/title/PanelTitle'
import RenewalPath from './RenewalPath'
import RenewalPathCard from './RenewalPathCard'

export default function RenewalTimelines() {
  const { type } = useTheme()
  const [data, setData] = useState(null)
  const { reload, setReload } = useReloadContext()
  const [newPathModal, setNewPathModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newPath, setNewPath] = useState({
    line: 'Commercial Lines',
    title: '',
  })

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(100)
      if (!isCancelled) {
        fetchData()
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    if (reload.paths) {
      let isCancelled = false
      const handleChange = async () => {
        await timeout(100)
        if (!isCancelled) {
          fetchData()
          setReload({
            ...reload,
            paths: false,
          })
        }
      }
      handleChange()
      return () => {
        isCancelled = true
      }
    }
  }, [reload])

  const fetchData = async () => {
    const res = await useNextApi('GET', `/api/paths/`)
    setData(res)
  }

  const closeModal = () => {
    setNewPathModal(false)
    setLoading(false)
  }
  const changeTask = (e, field) => {
    const path = { ...newPath }
    path[field] = e
    setNewPath({
      ...path,
    })
  }
  const submit = async () => {
    const res = await useNextApi('POST', `/api/paths/`, JSON.stringify(newPath))
    if (res) {
      closeModal()
      setReload({
        ...reload,
        paths: true,
      })
    }
  }

  const pathLine = (e, line) => {
    if (e) {
      changeTask(line, 'line')
    }
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex items-center py-2">
        <PanelTitle title={`Policy Renewal Timelines`} color="yellow" />
        <div className="flex px-4">
          <Button
            flat
            color="primary"
            size="xs"
            auto
            onClick={() => setNewPathModal(true)}
          >
            <div className="flex items-center justify-center text-center">
              <div>Create</div>
              <div className="flex items-center pl-2">{getIcon('plus')}</div>
            </div>
          </Button>
          <Modal
            closeButton
            noPadding
            scroll
            width={'600px'}
            className={'flex w-full items-center justify-center'}
            aria-labelledby="modal-title"
            open={newPathModal}
            onClose={() => closeModal()}
          >
            <Modal.Body className="flex flex-col w-full">
              <div className="flex flex-col w-full h-full gap-4 p-4 overflow-x-hidden">
                <div className="flex items-center w-full gap-4">
                  <BrinqInput
                    title="Renewal Path Title"
                    color="blue"
                    placeholder="Renewal Path Title"
                    callBack={(e) => changeTask(e, 'title')}
                    underlined={false}
                    borderd={true}
                    disabled={false}
                    clearable={false}
                    initialValue={newPath?.title}
                  />
                </div>
                <div className="flex flex-col w-full gap-4 xl:flex-row xl:justify-center">
                  <Checkbox
                    color="primary"
                    defaultSelected={newPath.line == 'Commercial Lines'}
                    isSelected={newPath.line == 'Commercial Lines'}
                    onChange={(e) => pathLine(e, 'Commercial Lines')}
                    size="xs"
                  >
                    <div className="text-xs tracking-widest">
                      Commercial Lines
                    </div>
                  </Checkbox>
                  <Checkbox
                    color="error"
                    defaultSelected={newPath.line == 'Personal Lines'}
                    isSelected={newPath.line == 'Personal Lines'}
                    onChange={(e) => pathLine(e, 'Personal Lines')}
                    size="xs"
                  >
                    <div className="text-xs tracking-widest">
                      Personal Lines
                    </div>
                  </Checkbox>
                  <Checkbox
                    color="success"
                    defaultSelected={newPath.line == 'Benefits'}
                    isSelected={newPath.line == 'Benefits'}
                    onChange={(e) => pathLine(e, 'Benefits')}
                    size="xs"
                  >
                    <div className="text-xs tracking-widest">Benefits</div>
                  </Checkbox>
                </div>
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
      </div>

      <div className="flex flex-col w-full">
        <div className="flex flex-col w-full h-full">
          <div className="flex items-center py-2">
            <PanelTitle title={`Commercial Lines`} color="blue" />
          </div>
          <div className="flex flex-col gap-4">
            {data
              ?.filter((x) => x.line == 'Commercial Lines')
              .map((path) => (
                <RenewalPath
                  key={path.id}
                  allPaths={data?.filter((x) => x.line == 'Commercial Lines')}
                  path={path}
                />
              ))}
          </div>
        </div>
        <div className="flex flex-col w-full h-full">
          <div className="w-full h-full py-2">
            <PanelTitle title={`Personal Lines`} color="red" />
          </div>
          <div className="flex flex-col gap-4">
            {data
              ?.filter((x) => x.line == 'Personal Lines')
              .map((path) => (
                <RenewalPath
                  key={path.id}
                  allPaths={data?.filter((x) => x.line == 'Personal Lines')}
                  path={path}
                />
              ))}
          </div>
        </div>
        <div className="flex flex-col w-full h-full">
          <div className="w-full h-full py-2">
            <PanelTitle title={`Benefits`} color="lime" />
          </div>
          <div className="flex flex-col gap-4">
            {data
              ?.filter((x) => x.line == 'Benefits')
              .map((path) => (
                <RenewalPath
                  key={path.id}
                  allPaths={data?.filter((x) => x.line == 'Benefits')}
                  path={path}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
