import React, { useState } from 'react'
import { BsCheckCircleFill, BsFillXCircleFill } from 'react-icons/bs'
import { BiCircle } from 'react-icons/bi'
import { Popover } from '@nextui-org/react'
import { useNextApi } from '../../utils/utils'
import { useAppContext } from '../../context/state'

export default function TaskCompletion({ task }) {
  const { state, setState } = useAppContext()
  
  const setCompleted = async () => {
    const res = await useNextApi(
      'PUT',
      `/api/task/${task.id}?completed=true&na=false`
    )
    setState({
        ...state,reloadTrigger:{...state.reloadTrigger,policies:true,activities:true}
    })
  }
  const setNa = async () => {
    const res = await useNextApi(
      'PUT',
      `/api/task/${task.id}?completed=false&na=true`
    )
    setState({
        ...state,reloadTrigger:{...state.reloadTrigger,policies:true,activities:true}
    })
  }
  const setNone = async () => {
    const res = await useNextApi(
      'PUT',
      `/api/task/${task.id}?completed=false&na=false`
    )
    setState({
        ...state,reloadTrigger:{...state.reloadTrigger,policies:true,activities:true}
    })
  }

  return (
    <div className="flex w-[40px] items-center justify-center">
      <Popover placement="top">
        <Popover.Trigger>
          {task?.done ? (
            task?.completed ? (
              <div className="text-color-success">
                <BsCheckCircleFill />
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
          <div className="flex w-full items-center space-x-4 p-4">
            <div className="text-color-success" onClick={() => setCompleted()}>
              <BsCheckCircleFill />
            </div>
            <div onClick={() => setNone()}>
              <BiCircle />
            </div>
            <div className="text-color-warning" onClick={() => setNa()}>
              <BsFillXCircleFill />
            </div>
          </div>
        </Popover.Content>
      </Popover>
    </div>
  )
}
