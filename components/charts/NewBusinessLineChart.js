import { useTheme } from '@nextui-org/react'
import React, { useEffect, useRef, useState } from 'react'
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
  'transparent',
  '#9d85ff26',
  '#5555FF',
  '#9787FF',
  '#FF55B8',
  '#FF8787',
  '#ec008c',
  '#ff9966',
  '#17a8c9',
  '#FF55B8',
  '#5555FF',
  '#9787FF',
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
function createGradient(ctx, area, indx, fill = false, fixedIndx = 1) {
  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top)

  if (fill) {
    gradient.addColorStop(0, colors[0])
    gradient.addColorStop(0.2, colors[0])
    gradient.addColorStop(0.5, colors[fixedIndx])
    gradient.addColorStop(0.8, colors[fixedIndx])
    gradient.addColorStop(1, colors[fixedIndx])
  } else {
    gradient.addColorStop(0, colors[indx + 1])
    gradient.addColorStop(0.5, colors[indx + 6])
    gradient.addColorStop(1, colors[indx + 8])
  }

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

export default function NewBusinessLineChart({
  noPadding = false,
  autoWidth = false,
  border = false,
  vertical = true,
  panel = true,
  shadow = true,
  fullData = null,
  slice = false,
  currentMonth = 0,
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
        borderColor: createGradient(chart.ctx, chart.chartArea, indx),
        backgroundColor: createGradient(chart.ctx, chart.chartArea, indx, true),
      })),
    }

    setChartData(chartData)
  }, [fullData])

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
  const getDataset = () => {
    return [
      {
        data: slice
          ? fullData?.totalPremByMonth.slice(0, currentMonth + 1)
          : fullData?.totalPremByMonth,
        label: 'Current Sales',
      },
      {
        data: slice
          ? fullData?.totalPremGoalByMonth.slice(0, currentMonth + 1)
          : fullData?.totalPremGoalByMonth,
        label: 'Sales Goal',
      },
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

  const data = {
    labels: slice ? months.slice(0, currentMonth + 1) : months,
    datasets: [...getDataset()],
  }

  const options = {
    plugins: {
      legend: {
        display: true,
        labels: {
          boxWidth: 6,
          boxHeight: 6,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: 'New Business Track',
        position: 'top',
        align: 'center',
      },
    },
    elements: {
      line: {
        tension: 0.5,
        borderWidth: 4,
        borderColor: [
          '#5555FF',
          '#9787FF',
          '#FF55B8',
          '#FF8787',
          'teal',
          'blue',
          'purple',
          '#ec008c',
          '#ff9966',
          '#17a8c9',
          '#fbf530',
        ],
        fill: false,
        // backgroundColor: ['#1fb7f83b', '#7c1ff83b'],
        borderCapStyle: 'butt',
        capBezierPoints: true,
      },
      point: {
        radius: 4,
        hitRadius: 5,
        hoverRadius: 5,
        backgroundColor: ['#FF55B8'],
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

  const baseClass = `relative z-20 flex items-center justify-center w-full ${
    noPadding ? `p-0` : `px-4`
  } rounded-lg ${isBorder()} ${isVertical()} ${isPanel()} ${isShadow()}`

  return (
    <div className="flex h-full w-full">
      <div className={`${baseClass} md:hidden lg:hidden`}>
        <Line
          data={chartData}
          ref={chartRef}
          plugins={[multiply]}
          options={options}
        />
      </div>
      <div className={`${baseClass} hidden md:flex`}>
        <Line
          data={chartData}
          ref={chartRef}
          height={80}
          plugins={[multiply]}
          options={options}
        />
      </div>
    </div>
  )
}
