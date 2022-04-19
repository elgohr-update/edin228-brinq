import React, { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import CoverageNode from './CoverageNode/CoverageNode'
import { FaGripHorizontal } from 'react-icons/fa'
import uuid from 'react-uuid'
import { useAppContext } from '../../context/state'
import { getTemplateId } from '../../utils/utils'

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}
const getItemStyle = (isDragging, draggableStyle) => ({
  background: isDragging ? 'gray' : 'transparent',
  ...draggableStyle,
})
//
export default function CostComparisonNodeList({ nodes, columnCount }) {
  const { state, setState } = useAppContext()
  const [data, setData] = useState([
    ...state.costComparison.builder.template.rows,
  ])
  const basicData = {
    data: '',
  }
  useEffect(() => {
    const newData = [...data]
    newData.forEach((coverage) => {
      coverage.rows.forEach((row) => {
        if (columnCount > row.columns.length) {
          const newId = getTemplateId()
          const newData = {
            ...basicData,
            id: newId,
            bgColor: row.defaultBgColor,
            textColor: row.defualyTextColor,
            textBold: row.textBold,
            textItalic: row.textItalic,
            isMoney: row.isMoney,
          }
          row.columns.push(newData)
        }
      })
    })
    setData(newData)
    setState({
      ...state,
      costComparison: {
        ...state.costComparison,
        builder: {
          template: { ...state.costComparison.builder.template, rows: newData },
        },
      },
    })
  }, [columnCount])

  useEffect(() => {
    setData([...state.costComparison.builder.template.rows])
  }, [state.costComparison.builder.template.rows])

  function onDragEnd(result) {
    const { source, destination } = result

    // dropped outside the list
    if (!destination) {
      return
    }
    const items = reorder(data, source.index, destination.index)
    setData(items)
    setState({
      ...state,
      costComparison: {
        ...state.costComparison,
        builder: {
          template: { ...state.costComparison.builder.template, rows: items },
        },
      },
    })
  }

  return (
    <div className="oveflow-scroll hide-scrollbar relative max-h-[120vh]">
      <div style={{ display: 'flex' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {data.map((item, index) => (
                  <Draggable
                    key={String(item.id)}
                    draggableId={String(item.id)}
                    index={index}
                  >
                    {(provided, snapshot) => {
                      // if (snapshot.isDragging) {
                      //     provided.draggableProps.style.left = undefined;
                      //     provided.draggableProps.style.top = undefined;
                      // }
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
                          <div
                            className="absolute top-[8px] left-[10px] z-20"
                            {...provided.dragHandleProps}
                          >
                            <FaGripHorizontal />
                          </div>
                          <CoverageNode
                            coverageNode={item}
                            columnCount={columnCount}
                          />
                        </div>
                      )
                    }}
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
