import { useTheme } from '@nextui-org/react'
import React from 'react'
import { abbreviateMoney } from '../../utils/utils'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Chart, Bar, Line, Scatter, Bubble } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function NewBusinessLineChart({
  noPadding = false,
  autoWidth = false,
  border = false,
  vertical = true,
  color = 'sky',
  gradientColor = 'orange',
  panel = true,
  shadow = true,
  fullData = null,
  slice = false,
  currentMonth = 0
}) {
  const { isDark, type } = useTheme()

  const isVertical = () => {
    return vertical ? `flex-col` : `flex-row items-center`
  }
  const isPanel = () => {
    return panel ? `panel-flat-${type}` : ``
  }
  const isShadow = () => {
    return shadow ? `${type}-shadow` : ``
  }
  const isBorder = () => {
    return border
      ? `${isDark ? `border-slate-900` : `border-slate-200`} border`
      : ``
  }
  const getColor = () => {
    const def = { bg: `bg-sky-300/80`, text: `text-sky-400` }
    switch (color) {
      case 'emerald':
        return { bg: `bg-emerald-300/80`, text: `text-emerald-400` }
      case 'purple':
        return { bg: `bg-purple-300/80`, text: `text-purple-400` }
      case 'pink':
        return { bg: `bg-pink-300/80`, text: `text-pink-400` }
      case 'teal':
        return { bg: `bg-teal-300/80`, text: `text-teal-400` }
      case 'amber':
        return { bg: `bg-amber-300/80`, text: `text-amber-400` }
      case 'fuchsia':
        return { bg: `bg-fuchsia-300/80`, text: `text-fuchsia-400` }
      case 'rose':
        return { bg: `bg-rose-300/80`, text: `text-rose-400` }
      case 'violet':
        return { bg: `bg-violet-300/80`, text: `text-violet-400` }
      case 'indigo':
        return { bg: `bg-indigo-300/80`, text: `text-indigo-400` }
      case 'cyan':
        return { bg: `bg-cyan-300/80`, text: `text-cyan-400` }
      case 'red':
        return { bg: `bg-red-300/80`, text: `text-red-400` }
      case 'yellow':
        return { bg: `bg-yellow-300/80`, text: `text-yellow-400` }
      case 'orange':
        return { bg: `bg-orange-300/80`, text: `text-orange-400` }
      case 'lime':
        return { bg: `bg-lime-300/80`, text: `text-lime-400` }
      default:
        return def
    }
  }

  const returnGradient = () => {
    switch (gradientColor) {
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
  
  const getChartColor = () => {
    const set = {
      color: '#17c964',
      fill: '#17c96445',
    }
    return set
  }

  const getDataset = () => {
    return [
      {
        data: slice ? fullData?.totalPremByMonth.slice(0,currentMonth+1) : fullData?.totalPremByMonth,
        label: 'Current Total'
      },
      {
        data: slice ? fullData?.totalPremGoalByMonth.slice(0,currentMonth+1) : fullData?.totalPremGoalByMonth,
        label: 'Monthly Goals'
      }
    ]
  }

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  // function createGradient(ctx, area) {
  //   const colorStart = faker.random.arrayElement(colors);
  //   const colorMid = faker.random.arrayElement(
  //     colors.filter(color => color !== colorStart)
  //   );
  //   const colorEnd = faker.random.arrayElement(
  //     colors.filter(color => color !== colorStart && color !== colorMid)
  //   );
  
  //   const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
  
  //   gradient.addColorStop(0, colorStart);
  //   gradient.addColorStop(0.5, colorMid);
  //   gradient.addColorStop(1, colorEnd);
  
  //   return gradient;
  // }

  const data = {
    labels: slice ? months.slice(0,currentMonth+1) : months,
    datasets: [...getDataset()],
  }

  const options = {
    plugins: {
      legend: {
        display: true,
        labels: {
          boxWidth:10,
          boxHeight:10,
        }
      },
      title: {
        display:true,
        text: 'New Business Track',
        position: 'top',
        align: 'start'
      }
    },
    elements: {
      line: {
        tension: 0.5,
        borderWidth: 2,
        borderColor: ['#17a8c9','#6c17c9'],
        fill: true,
        backgroundColor: ['#1fb7f83b', '#7c1ff83b'],
        borderCapStyle: 'butt',
        capBezierPoints: true,
      },
      point: {
        radius: 3,
        hitRadius: 5, 
        hoverRadius: 5,
        backgroundColor: '#fff' 
      },
    },
    scales: {
      xAxis: {
        display: true,
      },
      yAxis: {
        display: true,
      },
    },
    responsive: true,
    maintainAspectRatio: true,
  }

  const baseClass = `relative z-20 flex items-center justify-center h-full ${noPadding ? `p-0` : `px-4 py-2`} ${
    autoWidth ? `w-auto` : `w-full min-w-[240px]`
  } rounded-lg ${isBorder()} ${isVertical()} ${isPanel()} ${isShadow()}`

  return (
    <div className={baseClass}>
      <Line data={data} width={`100%`} height={40} options={options} />
    </div>
  )
}
