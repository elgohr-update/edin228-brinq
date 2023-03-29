import { Button, Loading, Modal } from '@nextui-org/react'
import React from 'react'
import { useState } from 'react'
import { useReloadContext } from '../../context/state'
import { getFormattedDateTime, useNextApi } from '../../utils/utils'
import BrinqTextArea from '../ui/textarea/BrinqTextArea'
import UserAvatar from '../user/Avatar'

function ClientRenewalNote({
  clientId,
  val,
  editedBy = null,
  editedDate = null,
}) {
  const [editText, setEditText] = useState(val)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const { reload, setReload } = useReloadContext()

  const updateText = (e) => {
    setEditText(e)
  }
  const closeModal = () => {
    setShowModal(false)
    setLoading(false)
  }
  const cancel = () => {
    setEditText(val)
    closeModal()
  }
  const submit = async () => {
    setLoading(true)
    const finalBundle = { text: editText }
    const bundle = JSON.stringify({ ...finalBundle })
    const res = await useNextApi(
      'PUT',
      `/api/clients/${clientId}/renewalnote`,
      bundle
    )
    if (res) {
      closeModal()
      setReload({
        ...reload,
        policies: true,
        activities: true,
      })
    }
  }
  return (
    <div className="flex items-center w-full py-4">
      <div
        className="flex flex-col w-full h-full border-2 rounded-lg border-zinc-800"
        onClick={() => setShowModal(true)}
      >
        <div className="w-full h-full">
          {val ? (
            <div className="flex flex-col justify-between w-full h-full">
              <h6 className="block max-h-[60vh] w-full overflow-y-auto whitespace-pre-line p-4 ">
                {editText}
              </h6>
              <div className="flex p-2">
                <div className="flex flex-col items-end w-full">
                  <div className="flex items-center justify-end w-full gap-4">
                    <h4>{getFormattedDateTime(editedDate)}</h4>
                    <div>
                      <UserAvatar
                        tooltip={true}
                        tooltipPlacement="topEnd"
                        isUser={false}
                        lookUpUser={editedBy}
                        isGrouped={true}
                        squared={false}
                        size={`sm`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full text-xs font-bold opacity-60">
              Add Note
            </div>
          )}
        </div>
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
        <Modal.Body className="flex flex-col w-full p-6">
          <div className="relative flex w-full">
            {/* <textarea
              value={editText}
              onChange={(e) => updateText(e.target.value)}
            /> */}
            <div className="flex w-full">
              <BrinqTextArea
                placeholder="Notes"
                callBack={updateText}
                initialValue={editText}
                bordered
                minRows={10}
                maxRows={20}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="w-full p-4">
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
                  <div>Save</div>
                )}
              </Button>
            </div>
            <div>
              <Button
                disabled={loading}
                auto
                color="error"
                className="w-full"
                onClick={() => cancel()}
              >
                <div>Cancel</div>
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ClientRenewalNote
