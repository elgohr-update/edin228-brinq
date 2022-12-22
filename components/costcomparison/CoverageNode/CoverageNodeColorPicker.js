import { useTheme } from '@nextui-org/react'
import React, { useState } from 'react'
import { useAppContext } from '../../../context/state'

export default function CoverageNodeColorPicker({
  node,
  rowId,
  nodeId,
  usedFor = 'background',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const { isDark, type } = useTheme()
  const { state, setState } = useAppContext()

  const getTextColor = (color) => {
    return color ? color : `var(--nextui-colors-text)`
  }
  const getBgColor = (color) => {
    return color ? color : `transparent`
  }

  const getColor = () => {
    return usedFor == 'background'
      ? getBgColor(node.bgColor)
      : usedFor === 'text'
      ? getTextColor(node.textColor)
      : null
  }
 
  const selectColor = (color) => {
    const baseRows = [...state.costComparison.builder.template.rows]
    let baseNode = baseRows.find( node => node.id === nodeId).rows.find( row => row.id == rowId).columns.find( column => column.id === node.id)
    if(usedFor === 'background'){
        baseNode.bgColor = color
    }else if (usedFor === 'text'){
        baseNode.textColor = color
    }
    setState({...state,costComparison:{...state.costComparison, builder:{template:{...state.costComparison.builder.template, rows:baseRows}}}})
    setIsOpen(false)
  }

  return (
    <div className="relative z-50">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="border-[1px] border-zinc-600 color-picker-container"
        style={{ background: getBgColor(getColor()) }}
      ></div>
      {isOpen ? (
        <div className="absolute top-[-40px] right-[-20px]">
            <div className={`flex items-center space-x-2 px-4 rounded-lg py-2 panel-flatter-${type} ${type}-shadow`}>
                <div onClick={ () => selectColor(`#ff0000`)} className="border-[1px] border-zinc-600 color-picker-container bg-color-red"></div>
                <div onClick={ () => selectColor(`#ffff00`)} className="border-[1px] border-zinc-600 color-picker-container bg-color-yellow"></div>
                <div onClick={ () => selectColor(`#ffa500`)} className="border-[1px] border-zinc-600 color-picker-container bg-color-orange"></div>
                <div onClick={ () => selectColor(`#0000ff`)} className="border-[1px] border-zinc-600 color-picker-container bg-color-blue"></div>
                <div onClick={ () => selectColor(`#00ff00`)} className="border-[1px] border-zinc-600 color-picker-container bg-color-lime"></div>
                <div onClick={ () => selectColor(`#ff00ff`)} className="border-[1px] border-zinc-600 color-picker-container bg-color-fuchsia"></div>
                <div onClick={ () => selectColor(`#800080`)} className="border-[1px] border-zinc-600 color-picker-container bg-color-purple"></div>
                <div onClick={ () => selectColor(`#ffffff`)} className="border-[1px] border-zinc-600 color-picker-container bg-color-white"></div>
                <div onClick={ () => selectColor(`#000000`)} className="border-[1px] border-zinc-600 color-picker-container bg-color-black"></div>
                <div onClick={ () => selectColor(`var(--nextui-colors-text)`)} className="border-[1px] border-zinc-600 color-picker-container bg-color-transparent"></div>
                {
                    usedFor === 'background'?
                    <div onClick={ () => selectColor(`transparent`)} className="border-[1px] border-zinc-600 color-picker-container bg-color-transparent"></div>
                    :usedFor === 'text' ?
                    <div onClick={ () => selectColor(`var(--nextui-colors-text)`)} className="border-[1px] border-zinc-600 color-picker-container bg-color-default"></div>
                    :null
                }
            </div>
        </div>
      ) : null}
    </div>
  )
}
