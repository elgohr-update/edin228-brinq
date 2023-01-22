import { Button, useTheme } from '@nextui-org/react'
import React, { useState } from 'react'
import { useAppContext } from '../../context/state'
import { getTemplateId } from '../../utils/utils'
import CostComparisonNodeList from './CostComparisonNodeList'

export default function CostComparisonContainer() {
  const { state, setState } = useAppContext()

  const addColumn = () => {
    const newHeaders = [
      ...state.costComparison.builder.template.headers,
      { id: getTemplateId(), title: `Option ${state.costComparison.builder.template.headers.length-1}` },
    ]
    setState({
      ...state,
      costComparison: {
        ...state.costComparison,
        builder: {
          template: {
            ...state.costComparison.builder.template,
            headers: newHeaders,
          },
        },
      },
    })
  }

  return (
    <div className={`flex h-full w-fit flex-col`}>
      <div className={`flex h-full flex-col`}>
        <div className={`relative px-2 py-2`}>
          <div>Template Header</div>
          <div className={`bottom-border-flair pink-to-blue-gradient-1`} />
        </div>
        <div className={`flex flex-col py-2`}>
          <div className={`relative mb-1 flex items-center px-4`}>
            {state.costComparison.builder.template.headers.map((header) => (
              <div key={header.id} className="w-[200px] py-2 pl-2">
                <h6 className="border-r">{header.title}</h6>
              </div>
            ))}
            <div className="px-4">
              <Button rounded flat auto size="xs" onClick={() => addColumn()}>
                + Column
              </Button>
            </div>
            <div className={`bottom-border-flair pink-to-blue-gradient-1`} />
          </div>
          <div className={`relative flex h-full py-1 xl:pl-4`}>
            <CostComparisonNodeList
              columnCount={state.costComparison.builder.template.headers.length}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
