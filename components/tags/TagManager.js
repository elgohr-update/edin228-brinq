import { Button, Loading, Modal, useTheme } from '@nextui-org/react'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import PanelTitle from '../../components/ui/title/PanelTitle'
import { timeout, useNextApi } from '../../utils/utils'
import BrinqInput from '../ui/input/BrinqInput'
import ClientTag from './ClientTag'

export default function TagManager() {
  const { type } = useTheme()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [newTag, setNewTag] = useState({
    name: '',
    color: 'blue',
    clients: [],
  })

  useEffect(() => {
    let isCancelled = false
    const handleChange = async () => {
      await timeout(1000)
      if (!isCancelled) {
        await fetchData()
      }
    }
    handleChange()
    return () => {
      isCancelled = true
    }
  }, [])

  const fetchData = async () => {
    const res = await useNextApi('GET', `/api/tags/`)
    setData(res)
  }

  const editTag = (e, field) => {
    const nt = { ...newTag }
    nt[field] = e
    setNewTag({
      ...nt,
    })
  }

  const closeModal = () => {
    setShowModal(false)
    setNewTag({
      name: '',
      color: 'blue',
      clients: [],
    })
  }

  const submit = async () => {
    if (newTag.name.length < 1) {
      return
    }
    const bundle = JSON.stringify({ ...newTag })
    const res = await useNextApi('POST', `/api/tags/`, bundle)
    if (res) {
      closeModal()
      fetchData()
    }
  }

  return (
    <div className="flex flex-col w-full">
      <div className="w-full py-2">
        <PanelTitle title={`Tags`} color="yellow" />
      </div>
      <div className="flex flex-col w-full">
        <div className="flex flex-wrap gap-4 pb-4">
          {data?.map((x) => (
            <ClientTag key={x.id} tag={x} callBack={fetchData} editable text={x.name} color={x.color} />
          ))}
        </div>
        <div>
          <Button
            disabled={loading}
            auto
            color="gradient"
            onClick={() => setShowModal(true)}
            size={'sm'}
          >
            {loading ? (
              <Loading type="points-opacity" color="currentColor" size="md" />
            ) : (
              <div>Create Tag</div>
            )}
          </Button>
        </div>
      </div>
      <Modal
        closeButton
        noPadding
        scroll
        className={'flex w-full items-center justify-center'}
        aria-labelledby="modal-title"
        open={showModal}
        onClose={closeModal}
      >
        <Modal.Header className="flex flex-col w-full px-4">
          <div className="text-xs tracking-widest opacity-60">New Tag</div>
        </Modal.Header>
        <Modal.Body className="flex flex-col w-full p-4">
          <div className="flex items-center justify-center w-full py-4">
            <ClientTag text={newTag.name} color={newTag.color} />
          </div>
          <div className="flex flex-col w-full">
            <div className="flex justify-center mb-2">
              <div className="flex items-center gap-2">
                <div
                  onClick={() => editTag('blue', 'color')}
                  className={`${
                    newTag.color == 'blue'
                      ? 'border-[2px] border-slate-400 '
                      : ''
                  } deal-tag-blue h-[20px] w-[20px] cursor-pointer rounded-full transition duration-100 hover:scale-105`}
                ></div>
                <div
                  onClick={() => editTag('green', 'color')}
                  className={`${
                    newTag.color == 'green'
                      ? 'border-[2px] border-slate-400 '
                      : ''
                  } deal-tag-green h-[20px] w-[20px] cursor-pointer rounded-full transition duration-100 hover:scale-105`}
                ></div>
                <div
                  onClick={() => editTag('red', 'color')}
                  className={`${
                    newTag.color == 'red'
                      ? 'border-[2px] border-slate-400 '
                      : ''
                  } deal-tag-red h-[20px] w-[20px] cursor-pointer rounded-full transition duration-100 hover:scale-105`}
                ></div>
                <div
                  onClick={() => editTag('orange', 'color')}
                  className={`${
                    newTag.color == 'orange'
                      ? 'border-[2px] border-slate-400 '
                      : ''
                  } deal-tag-orange h-[20px] w-[20px] cursor-pointer rounded-full transition duration-100 hover:scale-105`}
                ></div>
                <div
                  onClick={() => editTag('purple', 'color')}
                  className={`${
                    newTag.color == 'purple'
                      ? 'border-[2px] border-slate-400 '
                      : ''
                  } deal-tag-purple h-[20px] w-[20px] cursor-pointer rounded-full transition duration-100 hover:scale-105`}
                ></div>
                <div
                  onClick={() => editTag('pink', 'color')}
                  className={`${
                    newTag.color == 'pink'
                      ? 'border-[2px] border-slate-400 '
                      : ''
                  } deal-tag-pink h-[20px] w-[20px] cursor-pointer rounded-full transition duration-100 hover:scale-105`}
                ></div>
                <div
                  onClick={() => editTag('yellow', 'color')}
                  className={`${
                    newTag.color == 'yellow'
                      ? 'border-[2px] border-slate-400 '
                      : ''
                  } deal-tag-yellow h-[20px] w-[20px] cursor-pointer rounded-full transition duration-100 hover:scale-105`}
                ></div>
              </div>
            </div>
            <div className="w-full">
              <BrinqInput
                title={`Tag Label`}
                color={'lime'}
                placeholder="Tag Label"
                callBack={(e) => editTag(e, 'name')}
                underlined={false}
                bordered={true}
                disabled={false}
                clearable={false}
                value={newTag?.name}
              />
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
  )
}
