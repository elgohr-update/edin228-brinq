import { useTheme } from '@nextui-org/react'
import React, { useEffect, useRef, useState } from 'react'
import { sortByProperty } from '../../utils/utils'
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
  const gradient = ctx.createLinearGradient(area.left,0,area.right,0)

  gradient.addColorStop(0, colors[indx+0])
  gradient.addColorStop(0.5, colors[indx+11])
  gradient.addColorStop(1, colors[indx+3])

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

export default function NewBusinessBarChart({
  noPadding = false,
  autoWidth = false,
  border = false,
  vertical = true,
  panel = true,
  shadow = true,
  fullData = null,
  year=0
}) {
  const { isDark, type } = useTheme()
  const chartRef = useRef(null)
  const [chartData, setChartData] = useState({
    datasets: [],
  });

  useEffect(() => {
    const chart = chartRef.current;

    if (!chart) {
      return;
    }

    const chartData = {
      ...data,
      datasets: data.datasets.map((dataset, indx) => ({
        ...dataset,
        backgroundColor: [
          createGradient(chart.ctx, chart.chartArea, indx),
          createGradient(chart.ctx, chart.chartArea, indx + 1),
          createGradient(chart.ctx, chart.chartArea, indx + 2),
          createGradient(chart.ctx, chart.chartArea, indx + 3),
          createGradient(chart.ctx, chart.chartArea, indx + 4),
          createGradient(chart.ctx, chart.chartArea, indx + 5),
          createGradient(chart.ctx, chart.chartArea, indx + 6),
          createGradient(chart.ctx, chart.chartArea, indx + 7),
          createGradient(chart.ctx, chart.chartArea, indx + 8),
          createGradient(chart.ctx, chart.chartArea, indx + 9),
        ],
      })),
    };

    setChartData(chartData);
  }, [fullData]);

  const getSorted = () => {
    return sortByProperty(fullData.users, 'totalPrem')
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
        data: getSorted().map((x) => x.totalPrem),
        label: 'Current Total',
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
    labels: getSorted().map((x) => x.name),
    datasets: [...getDataset()],
  }

  const options = {
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false,
        labels: {
          boxWidth: 10,
          boxHeight: 10,
        },
      },
      title: {
        display: true,
        text: `${year} New Business Total`,
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
        radius:0,
        hitRadius: 5,
        hoverRadius: 5,
        backgroundColor: '#fff',
      },
    },
    scales: {
      xAxis: {
        display: true,
        grid:{
            display:false
        }
      },
      yAxis: {
        display: true,
        grid:{
            display:false
        }
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  }

  const baseClass = `relative z-20 flex items-center justify-center h-full ${
    noPadding ? `p-0` : `px-4 py-2`
  } ${
    autoWidth ? `w-auto` : `w-full min-w-[240px]`
  } rounded-lg ${isBorder()} ${isVertical()} ${isPanel()} ${isShadow()}`

  return (
    <div className={baseClass}>
      <Bar options={options} data={chartData} ref={chartRef} plugins={[multiply]} />
    </div>
  )
}
