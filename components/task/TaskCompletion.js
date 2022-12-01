import React, { useState } from 'react'
import { BsCheckCircleFill, BsFillXCircleFill } from 'react-icons/bs'
import { BiCircle } from 'react-icons/bi'
import { Popover } from '@nextui-org/react'
import { useNextApi } from '../../utils/utils'
import { useReloadContext, useUpdateDataContext } from '../../context/state'

export default function TaskCompletion({ task }) {
  const { reload, setReload } = useReloadContext()
  const { updateData, setUpdateData } = useUpdateDataContext()
  const [isOpen, setIsOpen] = useState(false);


  const setTask = async (completed=false, na=false) => {
    const res = await useNextApi(
      'PUT',
      `/api/task/${task.id}?completed=${completed}&na=${na}`
    )
    setReload({
      ...reload,
      policies: true,
      activities: true,
    })
    setUpdateData({
      ...updateData,
      task: res,
    })
    setIsOpen(false)
  }

  return (
    <div className="flex w-[40px] items-center justify-center">
      <Popover placement="top" isOpen={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger>
          {task?.done ? (
            task?.completed ? (
              <div className="text-color-success">
                <BsCheckCircleFill />
              </div>
            ) : task?.na ? (
              <div className="text-color-warning">
                <BsFillXCircleFill />
              </div>
            ) : (
              <div className="text-color-warning">
                <BsFillXCircleFill />
              </div>
            )
          ) : (
            <div>
              <BiCircle />
            </div>
          )}
        </Popover.Trigger>
        <Popover.Content>
          <div className="flex items-center w-full p-4 space-x-4">
            <div className="transition duration-100 ease-in-out cursor-pointer hover:scale-110 text-color-success" onClick={() => setTask(true,false)}>
              <BsCheckCircleFill />
            </div>
            <div className="transition duration-100 ease-in-out cursor-pointer hover:scale-110" onClick={() => setTask()}>
              <BiCircle />
            </div>
            <div className="transition duration-100 ease-in-out cursor-pointer hover:scale-110 text-color-warning" onClick={() => setTask(false,true)}>
              <BsFillXCircleFill />
            </div>
          </div>
        </Popover.Content>
      </Popover>
    </div>
  )
}
