import { Button, Modal, Text } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { FileUploader } from 'react-drag-drop-files'
import uuid from 'react-uuid'
import { timeout, useApiFormData } from '../../utils/utils'

const fileTypes = ['JPG', 'JPEG', 'PNG', 'GIF']

export default function UserImageUploader({ children, user, onSave, newUser }) {
  const [visible, setVisible] = useState(false)
  const [files, setFiles] = useState([])
  const { data: session } = useSession()

  const handler = () => setVisible(true)

  const closeHandler = async () => {
    const formData = new FormData()
    if (files?.length > 0) {
      formData.append('file', files[0].data) // note, no square-brackets
    }
    const url = newUser ? `/utils/upload/image` : `/users/u/${user.id}/image`
    const res = await useApiFormData(
      'POST',
      url,
      `${session.accessToken}`,
      formData
    )
    if (res) {
      onSave(res)
      setVisible(false)
    }
  }

  const handleChange = (f) => {
    const base = Array.from(f)
    const adjustedFiles = base.map((x) => {
      return { id: uuid(), data: x, description: '', private: true, action: '' }
    })
    const newFiles = [...files, ...adjustedFiles]
    setFiles(newFiles)
  }

  const removeFile = (f) => {
    const newFiles = files.filter((x) => x.id != f)
    setFiles(newFiles)
  }

  return (
    <div>
      <div className="cursor-pointer" onClick={handler}>
        {children}
      </div>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text
            css={{
              textGradient: '45deg, $blue500 -20%, $pink500 50%',
            }}
            id="modal-title"
            size={18}
          >
            Upload Image
          </Text>
        </Modal.Header>
        <Modal.Body>
          <FileUploader
            multiple={true}
            handleChange={handleChange}
            name="file"
            types={fileTypes}
            fileOrFIles={Array}
            maxSize={1000}
          />
          <div className="flex flex-col w-full space-y-2">
            {Array.from(files).map((f) => (
              <div key={f.id} className="flex items-center justify-between">
                <div>{f.data.name}</div>
                <div>
                  <Button
                    auto
                    size="xs"
                    color="error"
                    light
                    onClick={() => removeFile(f.id)}
                  >
                    X
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button auto color="gradient" onClick={closeHandler}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
