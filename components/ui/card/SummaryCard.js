import React from 'react'
import { useTheme } from '@nextui-org/react';
import { abbreviateMoney } from '../../../utils/utils';
import { AiFillCaretLeft } from 'react-icons/ai';

const SummaryCard = ({icon=<AiFillCaretLeft/>, autoWidth=false,isIcon=true,val=0,title='',border=false,percent=false,money=false,vertical=false,color='sky',gradientColor="orange",panel=false,shadow=false}) => {
    const { isDark, type } = useTheme();
    
    const textValue = () =>{
        return money ? `$${abbreviateMoney(parseFloat(val))}` :
            percent ? `${Number(val) ? val : 0}%` :
            val
    }
    const isVertical = () =>{
        return vertical ? `flex-col space-y-2` : `flex-row items-center`
    }
    const isPanel = () =>{
        return panel ? `panel-flat-${type}` : ``
    }
    const isShadow = () =>{
        return shadow ? `${type}-shadow` : ``
    }
    const isBorder = () =>{
        return border ? `${isDark?`border-slate-900`:`border-slate-200`} border` : ``
    }
    const getColor = () => {
        const def = {bg:`bg-sky-300/80`,text:`text-sky-400`}
        switch (color) {
            case 'emerald':
                return {bg:`bg-emerald-300/80`,text:`text-emerald-400`}
            case 'purple':
                return {bg:`bg-purple-300/80`,text:`text-purple-400`}
            case 'pink':
                return {bg:`bg-pink-300/80`,text:`text-pink-400`}
            case 'teal':
                return {bg:`bg-teal-300/80`,text:`text-teal-400`}
            case 'amber':
                return {bg:`bg-amber-300/80`,text:`text-amber-400`}
            case 'fuchsia':
                return {bg:`bg-fuchsia-300/80`,text:`text-fuchsia-400`}
            case 'rose':
                return {bg:`bg-rose-300/80`,text:`text-rose-400`}
            case 'violet':
                return {bg:`bg-violet-300/80`,text:`text-violet-400`}
            case 'indigo':
                return {bg:`bg-indigo-300/80`,text:`text-indigo-400`}
            case 'cyan':
                return {bg:`bg-cyan-300/80`,text:`text-cyan-400`}
            case 'red':
                return {bg:`bg-red-300/80`,text:`text-red-400`}
            case 'yellow':
                return {bg:`bg-yellow-300/80`,text:`text-yellow-400`}
            case 'orange':
                return {bg:`bg-orange-300/80`,text:`text-orange-400`}
            case 'lime':
                return {bg:`bg-lime-300/80`,text:`text-lime-400`}
            default:
                return def;
        }
    }

    const returnGradient = () => {
        switch(gradientColor) {
            case 'orange':
                return 'orange-gradient-1'
            case 'orange-reverse':
                return 'orange-reverse-gradient-1'
            case 'pink':
                return 'pink-gradient-1'
            case 'green':
                return 'green-gradient-1'
            case 'blue':
                return 'blue-gradient-1'
            case 'peach':
                return 'peach-gradient-1'
            case 'blood-orange':
                return 'blood-orange-gradient-1'
            case 'grand-blue':
                return 'grand-blue-gradient-1'
            case 'celestial':
                return 'celestial-gradient-1'
            case 'purple-to-green':
                return 'purple-to-green-gradient-1'
            case 'pink-to-orange':
                return 'pink-to-orange-gradient-1'
            case 'pink-to-blue':
                return 'pink-to-blue-gradient-1'
            case 'green-to-orange':
                return 'green-to-orange-gradient-1'
            case 'grand-blue-to-orange':
                return 'grand-blue-to-orange-gradient-1'
            case 'green-to-blue-2':
                return 'green-to-blue-gradient-2'
            case 'blue-to-orange-2':
                return 'blue-to-orange-gradient-2'
            case 'orange-to-red-2':
                return 'orange-to-red-gradient-2'
            case 'orange-to-green-gradient-2':
                return 'orange-to-green-gradient-2'
            case 'blue-to-orange-gradient-3':
                return 'blue-to-orange-gradient-3'
            case 'purple-to-blue-gradient-2':
                return 'purple-to-blue-gradient-2'
        }
    }
    const baseClass = `relative flex p-4 ${autoWidth? `w-auto` : `flex-1  min-w-[240px]`} rounded-lg ${isBorder()} ${isVertical()} ${isPanel()} ${isShadow()}`
    return (
        <div className={baseClass}>
            <div className={`relative flex flex-col z-20 ${vertical ? '': `w-full`}`}>
                <h5 className={`${vertical ? 'flex ': `flex `} font-semibold`}>{title}</h5>
                <div className={`top-border-flair ${returnGradient()}`} />
                <div className={`${vertical ? 'flex ': `flex `} flex font-bold text-3xl mb-2`}>{textValue()}</div>
            </div>
            { 
                isIcon ? 
                <div className={`${vertical ? 'flex justify-end': `flex justify-end w-full`} z-20 ml-4`}>
                    <div className={`flex items-center ${type}-shadow justify-center rounded-lg ${isDark?'bg-slate-500/20':'bg-white/40'} p-2 text-2xl w-[50px] h-[50px]`}>
                        <div className={`text-clip-gradient ${returnGradient()}`}>{icon}</div>
                    </div>
                </div>
                :null
            }
            
            
        </div>
    )
}

export default SummaryCard