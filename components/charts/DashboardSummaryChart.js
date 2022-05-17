import { useTheme } from '@nextui-org/react'
import React, { useEffect, useRef, useState } from 'react'
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
  ['#5c05b5', '#168cf0', '#0aeed1'],
  ['#FF3CAC', '#784BA0', '#2B86C5'],
  ['#FFA93B', '#ff5e62', '#FF2525'],
  ['#FF3CAC', '#784BA0', '#2B86C5'],
  ['#5c05b5', '#168cf0', '#0aeed1'],
  ['#FA8BFF', '#2BD2FF', '#2BFF88'],
  ['#5c05b5', '#168cf0', '#0aeed1'],
  '#ff5e621f',
  '#ff5e6269',
  '#ff5e62',
  '#46c38924',
  '#0febd599',
  '#0febd599',
  '#09ffa4',
  '#09ffa445',
  '#09f4ff',
  '#46c38924',
  '#0febd599',
  '#0febd599',
  '#09ffa4',
  '#09ffa445',
  '#09f4ff',
  '#46c38924',
  '#0febd599',
  '#0febd599',
  '#5555FF',
  '#9787FF',
  '#FF55B8',
  '#FF8787',
  '#ec008c',
  '#ff9966',
  '#17a8c9',
  '#FF55B8',
]

const basicColors = ['transparent', '#9d85ff26']
function createGradient(ctx, area, indx, fill = false, fixedIndx = 1) {
  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top)

  if (fill) {
    gradient.addColorStop(0, colors[indx][0])
    gradient.addColorStop(0.1, colors[indx][1])
    gradient.addColorStop(0.5, colors[indx][2])
    gradient.addColorStop(0.8, colors[indx][2])
    gradient.addColorStop(1, colors[indx][2])
  } else {
    gradient.addColorStop(0, colors[indx][0])
    gradient.addColorStop(0.5, colors[indx][1])
    gradient.addColorStop(1, colors[indx][2])
  }

  return gradient
}
function createBorderGradient(ctx, area, indx) {
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

export default function DashboardSummaryChart({
  border = false,
  vertical = true,
  panel = false,
  shadow = false,
  fullData = null,
  loading = true,
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
        borderColor: createBorderGradient(chart.ctx, chart.chartArea, indx),
        backgroundColor: createGradient(chart.ctx, chart.chartArea, indx),
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
        data: fullData?.premium_chart,
        label: 'Premium',
        type: 'line',
        yAxisID: 'y',
      },
      {
        data: fullData?.clients_chart,
        label: 'Clients',
        type: 'bar',
        yAxisID: 'y1',
      },
      {
        data: fullData?.policies_chart,
        label: 'Policies',
        type: 'bar',
        yAxisID: 'y2',
      },
      // {
      //   data: fullData?.nb_chart,
      //   label: 'New Business',
      //   type: 'line',
      //   yAxisID: 'y3',
      // },
      // {
      //   data: fullData?.nb_premium_chart,
      //   label: 'New Business Premium',
      //   type: 'line',
      //   yAxisID: 'y4',
      // },
    ]
  }

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  const data = {
    labels: months,
    datasets: [...getDataset()],
  }

  const options = {
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
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
        display: false,
        text: 'New Business Track',
        position: 'top',
        align: 'center',
      },
    },
    elements: {
      line: {
        tension: 0.5,
        borderWidth: 4,
        fill: false,
        borderCapStyle: 'butt',
        capBezierPoints: true,
      },
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
        radius: 4,
        hitRadius: 5,
        hoverRadius: 5,
        backgroundColor: ['#FF55B8'],
      },
    },
    scales: {
      x: {
        display: true,
      },
      y: {
        type: 'linear',
        display: false,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: false,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
      y2: {
        type: 'linear',
        display: false,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
      y3: {
        type: 'linear',
        display: false,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
      y4: {
        type: 'linear',
        display: false,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: true,
  }

  const baseClass = `relative z-20 w-full rounded-lg ${isBorder()} ${isVertical()} ${isPanel()} ${isShadow()}`

  return (
    <div className="flex w-full lg:justify-center">
      <div className={`${baseClass} flex`}>
        <Chart
          data={chartData}
          height={`50px`}
          ref={chartRef}
          //   plugins={[multiply]}
          options={options}
        />
      </div>
    </div>
  )
}
