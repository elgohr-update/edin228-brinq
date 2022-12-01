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

function createGradient(ctx, area, colors, indx) {
  const gradient = ctx.createLinearGradient(area.left, 0, area.right, 0)
  gradient.addColorStop(0, colors[0])
  gradient.addColorStop(0.5, colors[1])
  gradient.addColorStop(1, colors[2])

  return gradient
}

function createTranspGradient(ctx, area, colors, indx) {
  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top)
  gradient.addColorStop(0, colors[3])
  gradient.addColorStop(0.5, colors[4])
  gradient.addColorStop(1, colors[5])

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
export default function BackgroundFillSparkline({
  baseData = null,
  slice = true,
  passColors = null,
  toCurrentMonth = false,
}) {
  const chartRef = useRef(null)
  const [chartData, setChartData] = useState({
    datasets: [],
  })
  const [colors, setColors] = useState([
    '#09ffa4',
    '#09ffa445',
    '#09f4ff',
    '#46c38924',
    '#0febd599',
    '#0febd599 ',
  ])
  const [dataMonth, setDataMonth] = useState(0)

  useEffect(() => {
    const chart = chartRef.current

    if (!chart) {
      return
    }
    const base = new Date()
    const currentYear = base.getFullYear()
    const currentMonth = base.getMonth()
    setDataMonth(currentMonth)
    if (passColors) {
      setColors(passColors)
    }
    const chartData = {
      ...data,
      datasets: data.datasets.map((dataset, indx) => ({
        ...dataset,
        borderColor: createGradient(chart.ctx, chart.chartArea, colors),
        backgroundColor: createTranspGradient(
          chart.ctx,
          chart.chartArea,
          colors
        ),
      })),
    }
    setChartData(chartData)
  }, [baseData, passColors])

  const getDataset = () => {
    return [
      {
        data: slice
          ? baseData?.filter((element, index) => {
              return index % 2 === 0
            })
          : toCurrentMonth
          ? baseData?.slice(0, dataMonth + 1)
          : baseData,
        label: 'Premium',
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
    labels: slice
      ? months.filter((element, index) => {
          return index % 2 === 0
        })
      : toCurrentMonth
      ? months?.slice(0, dataMonth + 1)
      : months,
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
        borderWidth: 0.5,
        fill: true,
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
  }
  return (
    <div className="absolute bottom-0 z-10 w-full rounded-lg">
      <Line
        data={chartData}
        height={50}
        ref={chartRef}
        plugins={[multiply]}
        options={options}
      />
    </div>
  )
}
