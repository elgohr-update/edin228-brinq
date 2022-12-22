import { Input, Textarea, useTheme } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../../context/state'
import { formatMoney } from '../../../utils/utils'
import CoverageNodeColorPicker from './CoverageNodeColorPicker'

export default function CoverageNodeCell({nodeCell,rowId,nodeId}) {
    const { state, setState } = useAppContext()
    const [editMenu, setEditMenu] = useState(false)
    const { isDark, type } = useTheme()
    const [baseNode, setbaseNode] = useState(null)
    const baseRows = [...state.costComparison.builder.template.rows]

    useEffect(() => {
        setbaseNode(baseRows.find( node => node.id === nodeId).rows.find( row => row.id == rowId).columns.find( column => column.id === nodeCell.id))
    },[])

    const showCellEdit = () => {
        setEditMenu(true)
    }
    const closeMenu = () => {
        setEditMenu(false)
    }
    const isActive = (status) => {
        return status ? 'is-active-icon' : 'default-text-color'
    }
    const setText = (val) => {
        baseNode.data = val
        setState({...state,costComparison:{...state.costComparison, builder:{template:{...state.costComparison.builder.template, rows:baseRows}}}})   
    }
    const setBold = () => {
        baseNode.textBold = !baseNode.textBold 
        setState({...state,costComparison:{...state.costComparison, builder:{template:{...state.costComparison.builder.template, rows:baseRows}}}})
    }
    const setItalic = () => {
        baseNode.textItalic = !baseNode.textItalic 
        setState({...state,costComparison:{...state.costComparison, builder:{template:{...state.costComparison.builder.template, rows:baseRows}}}})
    }
    const setMoney = () => {
        baseNode.isMoney = !baseNode.isMoney 
        setState({...state,costComparison:{...state.costComparison, builder:{template:{...state.costComparison.builder.template, rows:baseRows}}}})
    }
    
    
    const dataStyle = `relative border ${isDark? `border-gray-800`:``} text-xs w-[200px] py-1 flex items-center justify-end text-right px-2`
    const cellStyle = {color:`${nodeCell.textColor}`,backgroundColor:`${nodeCell.bgColor}`}

    return (
        <div className={dataStyle} style={cellStyle}>
            {
            editMenu ? 
                <div className="relative z-40 w-full">
                    <div className={`flex items-center absolute w-auto space-x-2 z-40 right-[-10px] p-2 rounded-lg top-[-45px] panel-flatter-${type} ${type}-shadow`}> 
                        <div className="relative flex items-center space-x-2">
                            <h4>Background</h4>
                            <CoverageNodeColorPicker nodeId={nodeId} rowId={rowId} usedFor={'background'} node={nodeCell} /> 
                        </div>
                        <div className="relative flex items-center space-x-2">
                            <h4>Text</h4>
                            <CoverageNodeColorPicker nodeId={nodeId} rowId={rowId} usedFor={'text'} node={nodeCell} /> 
                        </div>
                        <div className="flex items-center space-x-1 b-button-group">
                            <div onClick={() => setMoney()} className={`cursor-pointer px-2 py-1 ${isActive(nodeCell.isMoney)}`}>$</div>
                            <div onClick={() => setBold()} className={`cursor-pointer px-2 py-1 ${isActive(nodeCell.textBold)}`}>B</div>
                            <div onClick={() => setItalic()} className={`cursor-pointer px-2 py-1 ${isActive(nodeCell.textItalic)}`}>I</div>
                        </div>
                    </div>
                    <div className="w-full">
                       <Textarea fullWidth onChange={ (e) => setText(e.target.value)} autoFocus size="xs" initialValue={nodeCell.data} clearable underlined/> 
                    </div>
                </div> 
                : 
                <div className={` w-full h-full whitespace-pre-line ${nodeCell.textBold?'font-bold':''} ${nodeCell.textItalic?'italic':''}`} onClick={() => showCellEdit()}>
                    {
                    nodeCell.isMoney && !isNaN(nodeCell.data)? 
                        `$${formatMoney(Number(nodeCell.data))}`: 
                    nodeCell.data.length < 1 ? 
                        <div className="min-h-[10px] min-w-[100px] w-full">{nodeCell.data}</div> : 
                    nodeCell.data
                    }
                </div>
            }
            {editMenu?<div onClick={() => closeMenu()} className="hidden-backdrop-cell"></div>:null}   
        </div>
    )
}
