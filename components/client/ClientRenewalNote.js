import { Modal } from '@nextui-org/react'
import React from 'react'
import { useState } from 'react'
import BrinqTextArea from '../ui/textarea/BrinqTextArea'

function ClientRenewalNote({ clientId, val }) {
  const [editText, setEditText] = useState(val)
  const [showModal, setShowModal] = useState(false)

  const updateText = (e) => {
    setEditText(e)
  }
  const closeModal = () => {
    setShowModal(false)
  }
  return (
    <div className="flex items-center w-full py-4">
      <div
        className="flex flex-col w-full h-full border-2 rounded-lg border-zinc-800"
        onClick={() => setShowModal(true)}
      >
        <div className="w-full h-full">
          {val ? (
            editText
          ) : (
            <div className="flex items-center justify-center w-full h-full text-xs font-bold opacity-50">
              Click to Add Note
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
        <Modal.Footer>
          <div>XXXXXXX</div>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ClientRenewalNote
