import { Button, Modal, useTheme } from '@nextui-org/react'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useReloadContext } from '../../../context/state'
import { getIcon, useNextApi } from '../../../utils/utils'
import ClientTag from '../../tags/ClientTag'

export default function TagContainer({
  tags,
  clientId = null,
  allowAddition = false,
}) {
  const { isDark, type } = useTheme()
  const [showModal, setShowModal] = useState(false)
  const [data, setData] = useState([])
  const [editTags, setEditTags] = useState({ tags: [] })
  const { reload, setReload } = useReloadContext()

  useEffect(() => {
    const t = tags ? tags?.map((x) => x.id) : []
    const bundle = { tags: t }
    setEditTags(bundle)
    return () => {}
  }, [tags])

  useEffect(() => {
    showModal ? fetchData() : null
    return () => {}
  }, [showModal])

  const fetchData = async () => {
    const res = await useNextApi('GET', `/api/tags/`)
    setData(res)
  }

  const addOrRemoveTag = (e) => {
    const nt = editTags.tags.includes(e)
      ? { tags: editTags.tags.filter((x) => x != e) }
      : { tags: [...editTags.tags, e] }
    setEditTags(nt)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const submit = async () => {
    const bundle = JSON.stringify({ ...editTags })
    const res = await useNextApi(
      'PUT',
      `/api/clients/${clientId}/tags`,
      bundle
    )
    if (res) {
      closeModal()
      setReload({
        ...reload,
        client: true,
      })
    }
  }

  return (
    <>
      <div className="flex items-center w-full">
        <div className={`flex gap-2`}>
          {tags?.map((x) => {
            return <ClientTag key={x.id} text={x.name} color={x.color} />
          })}
        </div>
        {allowAddition ? (
          <div>
            <Button
              flat
              auto
              className="w-full"
              size="xs"
              onClick={() => setShowModal(true)}
            >
              {getIcon('tag')}
            </Button>
          </div>
        ) : null}
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
          <div className="text-xs tracking-widest opacity-60">Add Tags</div>
        </Modal.Header>
        <Modal.Body className="flex flex-col w-full p-4">
          <div className="flex flex-wrap items-center w-full gap-2">
            {data?.map((x) => (
              <div
                key={x.id}
                onClick={() => addOrRemoveTag(x.id)}
                className={`${
                  editTags.tags.includes(x.id)
                    ? `border-[2px] ${
                        isDark ? 'border-zinc-200' : 'border-zinc-800'
                      } rounded-sm`
                    : ''
                } cursor-pointer`}
              >
                <ClientTag tag={x} text={x.name} color={x.color} />
              </div>
            ))}
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
                  auto
                  color="gradient"
                  className="w-full"
                  onClick={() => submit()}
                  size={'xs'}
                >
                  <div>Save</div>
                </Button>
              </div>
              <div>
                <Button
                  auto
                  color="error"
                  className="w-full"
                  onClick={() => closeModal()}
                  size={'xs'}
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
