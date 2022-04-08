import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import CoverageNode from './CoverageNode'
import { FaGripHorizontal } from 'react-icons/fa';

// fake data generator
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
}
const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  // change background colour if dragging
  background: isDragging ? 'gray' : 'transparent',

  // styles we need to apply on draggables
  ...draggableStyle,
})

export default function CostComparisonNodeList({nodes, columnCount}) {
  const [state, setState] = useState([
    {
        id:1,
        header: 'Primary Residence',
        rows: [
            {
                money:false,
                columns: [
                    {data:'Policy Term'},
                    {data:'12/12/2020 to 12/12/2021'},
                    {data:'12/12/2021 to 12/12/2022'}
                ]
            },
            {
                money:false,
                columns: [
                    {data:'Insurance Carrier'},
                    {data:'Chubb'},
                    {data:'Chubb'}
                ]
            },
            {
                money:false,
                columns: [
                    {data:'Property Address'},
                    {data:''},
                    {data:''}
                ]
            },
            {
                money:false,
                columns: [
                    {data:'102 S Orange Grove #206'},
                    {data:''},
                    {data:''}
                ]
            },
            {
                money:true,
                columns: [
                    {data:'Dwelling'},
                    {data:'117000'},
                    {data:'117000'}
                ]
            },
            {
                money:true,
                columns: [
                    {data:'Personal Property'},
                    {data:'117000'},
                    {data:'123600'}
                ]
            },
            {
                money:true,
                columns: [
                    {data:'Liability Limit - Each Occurrence'},
                    {data:'117000'},
                    {data:'123600'}
                ]
            },
            {
                money:true,
                columns: [
                    {data:'Medical Payments - Each Person'},
                    {data:'117000'},
                    {data:'123600'}
                ]
            },
            {
                money:true,
                columns: [
                    {data:'Property Loss Deductible*'},
                    {data:'117000'},
                    {data:'123600'}
                ]
            },
            {
                money:true,
                columns: [
                    {data:'Premium'},
                    {data:'740'},
                    {data:'924.50'}
                ]
            },
        ]
    },
    {
        id:2,
        header: 'Primary Residence 2',
        rows: [
            {
                money:false,
                columns: [
                    {data:'Policy Term'},
                    {data:'12/12/2020 to 12/12/2021'},
                    {data:'12/12/2021 to 12/12/2022'}
                ]
            },
            {
                money:false,
                columns: [
                    {data:'Insurance Carrier'},
                    {data:'Chubb'},
                    {data:'Chubb'}
                ]
            },
            {
                money:false,
                columns: [
                    {data:'Property Address'},
                    {data:''},
                    {data:''}
                ]
            },
            {
                money:false,
                columns: [
                    {data:'102 S Orange Grove #206'},
                    {data:''},
                    {data:''}
                ]
            },
            {
                money:true,
                columns: [
                    {data:'Dwelling'},
                    {data:'117000'},
                    {data:'117000'}
                ]
            },
            {
                money:true,
                columns: [
                    {data:'Personal Property'},
                    {data:'117000'},
                    {data:'123600'}
                ]
            },
            {
                money:true,
                columns: [
                    {data:'Liability Limit - Each Occurrence'},
                    {data:'117000'},
                    {data:'123600'}
                ]
            },
            {
                money:true,
                columns: [
                    {data:'Medical Payments - Each Person'},
                    {data:'117000'},
                    {data:'123600'}
                ]
            },
            {
                money:true,
                columns: [
                    {data:'Property Loss Deductible*'},
                    {data:'117000'},
                    {data:'123600'}
                ]
            },
            {
                money:true,
                columns: [
                    {data:'Premium'},
                    {data:'740'},
                    {data:'924.50'}
                ]
            },
        ]
    }
  ])

  function onDragEnd(result) {
    const { source, destination } = result

    // dropped outside the list
    if (!destination) {
      return
    }
    const items = reorder(state, source.index, destination.index)
    setState(items)
  }

  return (
    <div className="relative">
      <div style={{ display: 'flex' }}>
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    {state.map((item, index) => (
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
                                        className="relative"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        style={getItemStyle(
                                            snapshot.isDragging,
                                            provided.draggableProps.style
                                        )}
                                    >
                                        <div className="absolute top-[12px] left-[10px] z-20" {...provided.dragHandleProps}>
                                            <FaGripHorizontal />
                                        </div>
                                        <CoverageNode node={item} columnCount={columnCount}/>
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
    </div>
  )
}
