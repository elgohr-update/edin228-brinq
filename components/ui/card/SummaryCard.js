import React from 'react'
import { useTheme } from '@nextui-org/react';
import { abbreviateMoney } from '../../../utils/utils';
import { AiFillCaretLeft } from 'react-icons/ai';

const SummaryCard = ({icon=<AiFillCaretLeft/>, noPadding=false, autoWidth=false,isIcon=true,val=0,title='',border=false,percent=false,money=false,vertical=true,color='sky',gradientColor="orange",panel=false,shadow=false}) => {
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
        return panel ? `panel-theme-${type}` : ``
    }
    const isShadow = () =>{
        return shadow ? `${type}-shadow` : ``
    }
    const isBorder = () =>{
        return border ? `${isDark?`border-slate-900`:`border-slate-200`} border` : ``
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
    const baseClass = `relative flex ${noPadding?`p-0`:`px-4 py-2`} ${autoWidth? `w-auto min-w-[240px]` : `flex-1  min-w-[240px]`} rounded-lg ${isBorder()} ${isVertical()} ${isPanel()} ${isShadow()}`
    return (
        <div className={baseClass}>
            <div className={`relative flex z-20 ${vertical ? 'flex-col': `flex-col w-full`}`}>
                <div className={`${vertical ? 'flex ': `flex `} flex font-bold text-2xl`}>{textValue()}</div>
                <h5 className={`${vertical ? 'flex': `flex `} font-semibold`}>{title}</h5>
                <div className={`top-border-flair ${returnGradient()}`} />
            </div>
            { 
                isIcon ? 
                <div className={`${vertical ? 'flex justify-end': `flex justify-end w-full`} relative z-20  pl-10`}>
                    <div className={`z-20 flex items-center ${type}-shadow text-white justify-center rounded-lg ${isDark?'bg-slate-500/20':'bg-white/40'} p-2 text-2xl w-[40px] h-[40px]`}>
                        <div>{icon}</div>
                    </div>
                    <div className={`absolute rounded-lg z-10 ${returnGradient()} w-[40px] h-[40px]`}></div>
                </div>
                :null
            }
            
            
        </div>
    )
}

export default SummaryCard