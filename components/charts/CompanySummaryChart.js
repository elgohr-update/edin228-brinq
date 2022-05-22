import { useTheme } from '@nextui-org/react'
import React, { useEffect, useRef, useState } from 'react'
import { basicSort } from '../../utils/utils'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Chart, Bar, Line, Scatter, Bubble } from 'react-chartjs-2'
import PanelTitle from '../ui/title/PanelTitle'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const colors = [
  ['#09ffa445', '#09ffa4', '#09f4ff'],
  ['#FFA93B', '#ff5e62', '#FF2525'],
  ['#FF3CAC', '#784BA0', '#2B86C5'],
  ['#5c05b5', '#168cf0', '#0aeed1'],
  ['#FA8BFF', '#2BD2FF', '#2BFF88'],
  ['#5c05b5', '#168cf0', '#0aeed1'],
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
function createGradient(ctx, area, indx) {
  // const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top)
  const gradient = ctx.createLinearGradient(area.left, 0, area.right, 0)

  gradient.addColorStop(0, colors[indx][0])
  gradient.addColorStop(0.5, colors[indx][1])
  gradient.addColorStop(1, colors[indx][2])

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

export default function CompanySummaryChart({
  noPadding = false,
  autoWidth = false,
  border = false,
  vertical = true,
  panel = true,
  shadow = true,
  fullData = null,
  year = 0,
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
        backgroundColor: [
          createGradient(chart.ctx, chart.chartArea, 3),
          createGradient(chart.ctx, chart.chartArea, 2),
          createGradient(chart.ctx, chart.chartArea, 0),
        ],
      })),
    }

    setChartData(chartData)
  }, [fullData])

  const getSorted = () => {
    return basicSort(fullData)
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

  const getDataset = () => {
    return [
      {
        data: getSorted(),
        label: 'Premium',
      },
    ]
  }

  const labels = ['Commercial Lines', 'Personal Lines', 'Benefits']

  const data = {
    labels: labels,
    datasets: [...getDataset()],
  }

  const options = {
    plugins: {
      legend: {
        display: false,
        labels: {
          boxWidth: 10,
          boxHeight: 10,
        },
      },
      title: {
        display: false,
        text: `Premium Summary`,
        position: 'top',
        align: 'center',
      },
    },
    elements: {
      bar: {
        barPercentage: 0.3,
        categoryPercentage: 1,
        borderSkipped: false,
        borderRadius: {
          topLeft: 100,
          topRight: 0,
          bottomRight: 100,
          bottomLeft: 0,
        },
        barThickness: 10,
      },
      point: {
        radius: 0,
        hitRadius: 5,
        hoverRadius: 5,
        backgroundColor: '#fff',
      },
    },
    scales: {
      xAxis: {
        display: true,
        grid: {
          display: false,
        },
      },
      yAxis: {
        display: true,
        grid: {
          display: false,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: true,
  }

  const baseClass = `relative z-20 flex items-center justify-center h-full ${
    noPadding ? `p-0` : `px-4 py-2`
  } ${
    autoWidth ? `w-auto` : `w-full min-w-[240px]`
  } rounded-lg ${isBorder()} ${isVertical()} ${isPanel()} ${isShadow()}`

  return (
    <div className="mt-2 flex h-full w-full flex-auto shrink-0 flex-col lg:mt-0 lg:justify-center">
      <div className="pl-4">
        <PanelTitle title={`Summary`} color="sky" />
      </div>
      <div className={baseClass}>
        <Bar
          options={options}
          data={chartData}
          ref={chartRef}
          plugins={[multiply]}
        />
      </div>
    </div>
  )
}
