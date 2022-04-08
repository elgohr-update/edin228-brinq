import { useTheme } from '@nextui-org/react'
import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { useAppContext } from '../../context/state'
import CostComparisonNodeList from './CostComparisonNodeList'

export default function CostComparisonContainer() {
  const { isDark, type } = useTheme()
  const { state, setState } = useAppContext()
  const [columnHeaders, setColumnHeaders] = useState(['Option 1', 'Option 2'])
  return (
    <div className={`flex flex-col panel-theme-${type} rounded-lg ${type}-shadow py-2 w-full`}>
        <div className="flex items-center w-full relative mb-2 px-4">
            <div className="pl-2 py-2 w-[200px]"><h6 className="border-r">Coverage</h6></div>
            <div className="pl-2 py-2 w-[200px]"><h6 className="border-r">Current</h6></div>
            {
                columnHeaders.map( header => (
                    <div className="pl-2 py-2 w-[200px]"><h6 className="border-r">{header}</h6></div>
                ))
            }
            <div className={`bottom-border-flair pink-to-blue-gradient-1`} />
        </div>        
        <div className="flex relative w-full overflow-y-auto max-h-[82vh] py-2 pl-4">
            <CostComparisonNodeList columnCount={columnHeaders.length}/>
        </div>
    </div>
  )
}
