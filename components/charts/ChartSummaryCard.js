import { User, useTheme } from '@nextui-org/react'
import React, { useEffect, useRef, useState } from 'react'
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

const colors = [
  '#09ffa4',
  '#09ffa445',
  '#09f4ff',
  '#09f4ff45',  
  '#5555FF',
  '#9787FF',
  '#FF55B8',
  '#FF8787',
  '#ec008c',
  '#ff9966',
  '#17a8c9',
  '#fbf530',
  '#5555FF',
  '#9787FF',
  '#FF55B8',
  '#FF8787',
  '#ec008c',
  '#ff9966',
  '#17a8c9',
  '#fbf530',
  '#5555FF',
  '#9787FF',
  '#FF55B8',
  '#FF8787',
  '#ec008c',
  '#ff9966',
  '#17a8c9',
  '#fbf530',
  '#5555FF',
  '#9787FF',
  '#FF55B8',
  '#FF8787',
  '#ec008c',
  '#ff9966',
  '#17a8c9',
  '#fbf530',
  '#5555FF',
  '#9787FF',
  '#FF55B8',
  '#FF8787',
  '#ec008c',
  '#ff9966',
  '#17a8c9',
  '#fbf530',
]
function createSolidGradient(ctx, area,indx) {
  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top)
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(0.5, colors[0]);
  gradient.addColorStop(1, colors[2]);

  return gradient
}

function createTranspGradient(ctx, area,indx) {
  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top)
  gradient.addColorStop(0, colors[3]);
  gradient.addColorStop(0.5, colors[3]);
  gradient.addColorStop(1, colors[3]);

  return gradient
}

var multiply = {
  beforeDatasetsDraw: function (chart, options, el) {
    chart.ctx.globalCompositeOperation = 'multiply'
  },
  afterDatasetsDraw: function (chart, options) {
    chart.ctx.globalCompositeOperation = 'source-over'
  },
}

export default function ChartSummaryCard({
  noPadding = false,
  autoWidth = false,
  content = null,
  subContent = null,
  border = false,
  percent = false,
  money = false,
  vertical = true,
  panel = false,
  shadow = false,
  fullData = null,
  slice = false,
  currentMonth = null,
  direction = 'up',
}) {
  const { isDark, type } = useTheme()
  const chartRef = useRef(null)
  const [chartData, setChartData] = useState({
    datasets: [],
  })
  useEffect(() => {
    const chart = chartRef.current

    if (!chart) {
      return
    }

    const chartData = {
      ...data,
      datasets: data.datasets.map((dataset, indx) => ({
        ...dataset,
      })),
    }

    setChartData(chartData)
  }, [fullData])

  const getDataset = () => {
    return slice
      ? [
          {
            data: fullData.premByMonth.slice(0, currentMonth + 1),
            label: 'Current Sales',
          },
        ]
      : [
          {
            data: fullData.premByMonth,
            label: 'Current Sales',
          },
        ]
  }

  const contentValue = () => {
    return money
      ? `$${abbreviateMoney(parseFloat(content))}`
      : percent
      ? `${Number(content) ? content : 0}%`
      : content
  }
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

  const getChartColor = () => {
    if (direction == 'up') {
      const set = {
        color: '#31ff8a',
        fill: '#31f5ff38',
      }
      return set
    }
    const set = {
      color: '#ff31c0',
      fill: '#ff316a45',
    }
    return set
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

  const data = {
    labels: slice ? months.slice(0, currentMonth + 1) : months,
    datasets: [...getDataset()],
  }

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 2,
        borderColor: getChartColor().color,
        fill: true,
        backgroundColor: getChartColor().fill,
      },
      point: {
        radius: 0,
        hitRadius: 0,
      },
    },
    scales: {
      xAxis: {
        display: false,
      },
      yAxis: {
        display: false,
      },
    },
    responsive: true,
    maintainAspectRatio: true,
  }

  const baseClass = `relative h-[90px] z-20 flex ${noPadding ? `p-0` : `px-4 py-2`} ${
    autoWidth ? `w-auto` : `flex-1  min-w-[240px]`
  } rounded-lg ${isBorder()} ${isVertical()} ${isPanel()} ${isShadow()}`

  return (
    <div className={baseClass}>
      <div>
        <User
          src={fullData.user.image_file}
          name={fullData.user.name}
          className="px-0"
          size="xs"
        />
      </div>
      <div>{contentValue()}</div>
      <div>{subContent}</div>
      <div className="absolute right-0 bottom-5 z-10 rounded-lg opacity-40">
        <Line data={chartData} ref={chartRef} width={100} height={40} plugins={[multiply]} options={options} />
      </div>
    </div>
  )
}
