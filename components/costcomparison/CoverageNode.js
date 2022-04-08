import { useTheme } from '@nextui-org/react'
import React from 'react'

export default function CoverageNode({node, columnCount}) {
    const { isDark, type } = useTheme()
    const headerStyle = `h-[40px] ${isDark? `border-slate-700`:``} border pl-8 pr-4 flex items-center`
    const dataStyle = `border ${isDark? `border-slate-700`:``} w-[200px] py-1 flex items-center justify-end text-right px-4`
    return (
        <div className={`flex flex-col w-full my-2 ${type}-shadow panel-flat-${type} rounded-lg`}>
            <div className={headerStyle}>{node.header}</div>
            {   
                node.rows.map( (row,index) => (
                    <div key={index} className={`flex w-full`}>
                        {
                            row.columns.slice(0,2+columnCount).map( (column,index)=> (
                                <div key={index} className={dataStyle}>
                                    {row.money && !isNaN(column.data)? `$`:null}
                                    {column.data}
                                </div>
                            ))
                        }
                    </div>
                ))
            }
        </div>
    )
}
