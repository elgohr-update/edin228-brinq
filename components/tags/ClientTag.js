import React from 'react'
import { Button, Loading, Modal, Tooltip, useTheme } from '@nextui-org/react'
import { useState } from 'react'
import BrinqInput from '../ui/input/BrinqInput'
import PanelTitle from '../ui/title/PanelTitle'
import { useNextApi } from '../../utils/utils'

const ClientTag = ({
  text = '',
  color = 'sky',
  autoWidth = false,
  opacity = false,
  shadow = false,
  tooltip = false,
  tooltipContent = null,
  editable = false,
  tag = null,
  callBack = null,
}) => {
  const { isDark, type } = useTheme()
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [tagEdit, setTagEdit] = useState(tag)
  const [loading, setLoading] = useState(false)

  const isShadow = () => {
    return shadow ? `${type}-shadow` : ``
  }
  const isOpacity = () => {
    return opacity ? `opacity-50` : ``
  }
  const getColor = () => {
    const def = 'tag-gray-bg'
    switch (color) {
      case 'green':
        return 'deal-tag-green'
      case 'blue':
        return 'deal-tag-blue'
      case 'red':
        return 'deal-tag-red'
      case 'orange':
        return 'deal-tag-orange'
      case 'purple':
        return 'deal-tag-purple'
      case 'pink':
        return 'deal-tag-pink'
      case 'yellow':
        return 'deal-tag-yellow'
      case 'subtle':
        return 'deal-tag-subtle'
      default:
        return def
    }
  }

  const editTag = (e, field) => {
    const nt = { ...tagEdit }
    nt[field] = e
    setTagEdit({
      ...nt,
    })
  }

  const cancel = () => {
    const nt = { ...tag }
    setTagEdit(nt)
    closeModal()
  }

  const remove = async () => {
    const res = await useNextApi('DELETE', `/api/tags/${tagEdit.id}`)
    if (res) {
      callBack()
      closeModal()
    }
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const submit = async () => {
    if (tagEdit?.name.length < 1) {
      return
    }
    const bundle = JSON.stringify({ ...tagEdit })
    const res = await useNextApi('PUT', `/api/tags/${tagEdit.id}`, bundle)
    if (res) {
      callBack()
      closeModal()
    }
  }

  return (
    <>
      <Tooltip content={tooltipContent}>
        <div
          onClick={() => (editable ? setShowModal(true) : null)}
          className={`${editable ? 'cursor-pointer' : ''} ${
            autoWidth ? `w-auto` : `min-w-[30px]`
          } tag-text-shadow flex min-h-[14px] items-center justify-center rounded-sm px-2 text-center text-[0.55rem] font-bold tracking-widest ${getColor()} ${isShadow()} ${isOpacity()}`}
        >
          {text}
        </div>
      </Tooltip>
      <Modal
        closeButton
        noPadding
        scroll
        className={'flex w-full items-center justify-center'}
        aria-labelledby="modal-title"
        open={showModal}
        onClose={closeModal}
      >
        <Modal.Body className="flex flex-col w-full p-4">
          <div className="flex items-center justify-center w-full py-4">
            <ClientTag text={tagEdit?.name} color={tagEdit?.color} />
          </div>
          <div className="flex flex-col w-full">
            <div className="flex justify-center mb-2">
              <div className="flex items-center gap-2">
                <div
                  onClick={() => editTag('blue', 'color')}
                  className={`${
                    tagEdit?.color == 'blue'
                      ? 'border-[2px] border-slate-400 '
                      : ''
                  } deal-tag-blue h-[20px] w-[20px] cursor-pointer rounded-full transition duration-100 hover:scale-105`}
                ></div>
                <div
                  onClick={() => editTag('green', 'color')}
                  className={`${
                    tagEdit?.color == 'green'
                      ? 'border-[2px] border-slate-400 '
                      : ''
                  } deal-tag-green h-[20px] w-[20px] cursor-pointer rounded-full transition duration-100 hover:scale-105`}
                ></div>
                <div
                  onClick={() => editTag('red', 'color')}
                  className={`${
                    tagEdit?.color == 'red'
                      ? 'border-[2px] border-slate-400 '
                      : ''
                  } deal-tag-red h-[20px] w-[20px] cursor-pointer rounded-full transition duration-100 hover:scale-105`}
                ></div>
                <div
                  onClick={() => editTag('orange', 'color')}
                  className={`${
                    tagEdit?.color == 'orange'
                      ? 'border-[2px] border-slate-400 '
                      : ''
                  } deal-tag-orange h-[20px] w-[20px] cursor-pointer rounded-full transition duration-100 hover:scale-105`}
                ></div>
                <div
                  onClick={() => editTag('purple', 'color')}
                  className={`${
                    tagEdit?.color == 'purple'
                      ? 'border-[2px] border-slate-400 '
                      : ''
                  } deal-tag-purple h-[20px] w-[20px] cursor-pointer rounded-full transition duration-100 hover:scale-105`}
                ></div>
                <div
                  onClick={() => editTag('pink', 'color')}
                  className={`${
                    tagEdit?.color == 'pink'
                      ? 'border-[2px] border-slate-400 '
                      : ''
                  } deal-tag-pink h-[20px] w-[20px] cursor-pointer rounded-full transition duration-100 hover:scale-105`}
                ></div>
                <div
                  onClick={() => editTag('yellow', 'color')}
                  className={`${
                    tagEdit?.color == 'yellow'
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
                initialValue={tagEdit?.name}
                value={tagEdit?.name}
              />
            </div>
            <div className="flex flex-col w-full py-4">
              <PanelTitle title={'Clients'} />
              <div className="flex max-h-[30vh] flex-col overflow-y-auto pl-4">
                {tagEdit?.clients?.map((x) => (
                  <div
                    className="flex items-center justify-between w-full"
                    key={x.id}
                  >
                    <h6>{x.client_name}</h6>
                  </div>
                ))}
              </div>
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
                  size={'xs'}
                >
                  {loading ? (
                    <Loading
                      type="points-opacity"
                      color="currentColor"
                      size="md"
                    />
                  ) : (
                    <div>Save</div>
                  )}
                </Button>
              </div>
              <div>
                <Button
                  disabled={loading}
                  auto
                  color="secondary"
                  className="w-full"
                  onClick={() => setShowDeleteModal(true)}
                  size={'xs'}
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
                  onClick={() => cancel()}
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

export default ClientTag
