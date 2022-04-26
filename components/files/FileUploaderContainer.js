import { Button, Modal, Text } from '@nextui-org/react'
import React, { useState } from 'react'
import { AiOutlinePaperClip } from 'react-icons/ai'
import { FileUploader } from 'react-drag-drop-files'

const fileTypes = ['JPG', 'PNG', 'GIF', 'CSV', 'PDF', 'DOC', 'XLSX']

export default function FileUploaderContainer({ onSave }) {
  const [visible, setVisible] = useState(false)
  const [files, setFiles] = useState([])

  const handler = () => setVisible(true)

  //   const closeHandler = () => {
  //     setVisible(false)
  //   }
  const closeHandler = () => {
    onSave(files)
    setVisible(false)
  }

  const handleChange = (f) => {
    const b = Array.from(f)
    const newFiles = [...files, ...b]
    setFiles(newFiles)
  }

  const removeFile = (f) => {
    const newFiles = files.filter((x) => x.lastModified != f)
    setFiles(newFiles)
  }

  return (
    <div>
      <Button auto flat color="primary" size="xs" onClick={handler}>
        <div className="flex items-center space-x-1">
          {Array.from(files).length > 0 ? (
            <div>{Array.from(files).length}</div>
          ) : null}
          <AiOutlinePaperClip />
        </div>
      </Button>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
        fileOrFIles={Array}
      >
        <Modal.Header>
          <Text
            css={{
              textGradient: '45deg, $blue500 -20%, $pink500 50%',
            }}
            id="modal-title"
            size={18}
          >
            Attach Files
          </Text>
        </Modal.Header>
        <Modal.Body>
          <FileUploader
            multiple
            handleChange={handleChange}
            name="file"
            types={fileTypes}
          />
          <div className="flex w-full flex-col space-y-2">
            {Array.from(files).map((f) => (
              <div
                key={f.name + String(f.lastModified)}
                className="flex items-center justify-between"
              >
                <div>{f.name}</div>
                <div>
                  <Button
                    auto
                    size="xs"
                    color="error"
                    light
                    onClick={() => removeFile(f.lastModified)}
                  >
                    X
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="gradient" onClick={closeHandler}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
