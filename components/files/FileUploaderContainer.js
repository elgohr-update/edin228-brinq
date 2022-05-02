import { Button, Modal, Text } from '@nextui-org/react'
import React, { useState } from 'react'
import { AiOutlinePaperClip } from 'react-icons/ai'
import { FileUploader } from 'react-drag-drop-files'
import uuid from 'react-uuid'

const fileTypes = ['JPG', 'PNG', 'GIF', 'CSV', 'PDF', 'DOC', 'XLSX']

export default function FileUploaderContainer({ onSave, showLargeButton=false }) {
  const [visible, setVisible] = useState(false)
  const [files, setFiles] = useState([])

  const handler = () => setVisible(true)

  const closeHandler = () => {
    onSave(files)
    setVisible(false)
  }

  const handleChange = (f) => {
    const base = Array.from(f)
    const adjustedFiles = base.map( x => {return {id:uuid(),data:x,description:'',private:true, action:''}})
    const newFiles = [...files, ...adjustedFiles]
    setFiles(newFiles)
  }

  const removeFile = (f) => {
    const newFiles = files.filter((x) => x.id != f)
    setFiles(newFiles)
  }

  return (
    <div>
      <Button auto flat color="primary" size="xs" onClick={handler}>
        {showLargeButton ?
          <div className="flex items-center space-x-1">
          <div>Attach Files</div>
          <AiOutlinePaperClip />
        </div>
        :
          <div className="flex items-center space-x-1">
            {Array.from(files).length > 0 ? (
              <div>{Array.from(files).length}</div>
            ) : null}
            <AiOutlinePaperClip />
          </div>
        }
        
      </Button>
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
            Attach Files
          </Text>
        </Modal.Header>
        <Modal.Body>
          <FileUploader
            multiple
            handleChange={handleChange}
            name="file"
            types={fileTypes}
            fileOrFIles={Array}
          />
          <div className="flex w-full flex-col space-y-2">
            {Array.from(files).map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between"
              >
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
