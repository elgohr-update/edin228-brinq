import React from 'react'

export default function PanelTitle({title,color}) {
    
    const getColor = () => {
        const def = {bg:`bg-sky-500`,text:`text-sky-400`, shadow:'blue-shadow'}
        switch (color) {
            case 'emerald':
                return {bg:`bg-emerald-500`,text:`text-emerald-400`, shadow:'blue-shadow'}
            case 'purple':
                return {bg:`bg-purple-500`,text:`text-purple-400`, shadow:'pink-shadow'}
            case 'pink':
                return {bg:`bg-pink-500`,text:`text-pink-400`, shadow:'pink-shadow'}
            case 'teal':
                return {bg:`bg-teal-500`,text:`text-teal-400`, shadow:'blue-shadow'}
            case 'amber':
                return {bg:`bg-amber-500`,text:`text-amber-400`, shadow:'orange-shadow'}
            case 'fuchsia':
                return {bg:`bg-fuchsia-500`,text:`text-fuchsia-400`, shadow:'pink-shadow'}
            case 'rose':
                return {bg:`bg-rose-500`,text:`text-rose-400`, shadow:'pink-shadow'}
            case 'violet':
                return {bg:`bg-violet-500`,text:`text-violet-400`, shadow:'purple-shadow'}
            case 'indigo':
                return {bg:`bg-indigo-500`,text:`text-indigo-400`, shadow:'purple-shadow'}
            case 'cyan':
                return {bg:`bg-cyan-500`,text:`text-cyan-400`, shadow:'blue-shadow'}
            case 'red':
                return {bg:`bg-red-500`,text:`text-red-400`, shadow:'pink-shadow'}
            case 'yellow':
                return {bg:`bg-yellow-500`,text:`text-yellow-400`, shadow:'orange-shadow'}
            case 'orange':
                return {bg:`bg-orange-500`,text:`text-orange-400`, shadow:'orange-shadow'}
            case 'lime':
                return {bg:`bg-lime-500`,text:`text-lime-400`, shadow:'green-shadow'}
            default:
                return def;
        }
    }

  return (
    <div className="flex items-center py-1 mb-1">
        <div className={`flex mr-2 h-[15px] w-[10px] rounded ${getColor().shadow} ${getColor().bg}`} />
        <h6 className="tracking-wide font-bold">
            {title}
        </h6>

    </div>
  )
}
