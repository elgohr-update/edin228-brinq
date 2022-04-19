import { useTheme } from '@nextui-org/react'
import React, { useState } from 'react'
import { FaGripHorizontal } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { formatMoney } from '../../../utils/utils';
import CoverageNodeCell from './CoverageNodeCell';

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
}
const getItemStyle = (isDragging, draggableStyle) => ({
  background: isDragging ? '#00bfeb59' : 'transparent',
  ...draggableStyle,
})

export default function CoverageNode({coverageNode, columnCount}) {
    const [node, setNode] = useState(coverageNode)
    const { isDark, type } = useTheme()
    const headerStyle = `h-[30px] ${isDark? `border-gray-800`:``} text-xs border rounded-t-lg pl-8 pr-4 flex flex-wrap items-center`
    
    function onDragEnd(result) {
        const { source, destination } = result
        if (!destination) {
          return
        }
        const items = reorder(node.rows, source.index, destination.index)
        setNode({...node,rows:items})
    }

    return (
        <div className={`flex flex-col w-full my-2 ${type}-shadow panel-flat-${type} rounded-lg`}>
            <div className={headerStyle}>{node.header.title}</div>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {node.rows.map((item, index) => (
                            <Draggable
                                key={String(item.id)}
                                draggableId={String(item.id)}
                                index={index}
                            >
                                {(provided, snapshot) => {
                                    if (snapshot.isDragging) {
                                        provided.draggableProps.style.left = undefined;
                                        provided.draggableProps.style.top = undefined;
                                    }
                                    return (
                                        <div
                                            className="relative flex w-full min-h-[30px]"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                            )}
                                        >
                                            <div className="absolute top-[8px] left-[8px] z-20 text-xs" {...provided.dragHandleProps}>
                                                <FaGripHorizontal />
                                            </div>
                                            {
                                                item.columns.slice(0,columnCount).map( (column)=> (
                                                    <CoverageNodeCell key={column.id} nodeId={node.id} rowId={item.id} nodeCell={column} />
                                                ))
                                            }
                                        </div>
                                )}}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    )
}
