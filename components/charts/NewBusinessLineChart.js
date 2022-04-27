import { useTheme } from '@nextui-org/react'
import React, { useRef, useState } from 'react'
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
import faker from 'faker';

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
  'red',
  'orange',
  'yellow',
  'lime',
  'green',
  'teal',
  'blue',
  'purple',
];
function createGradient(ctx, area) {
  const colorStart = faker.random.arrayElement(colors);
  const colorMid = faker.random.arrayElement(
    colors.filter(color => color !== colorStart)
  );
  const colorEnd = faker.random.arrayElement(
    colors.filter(color => color !== colorStart && color !== colorMid)
  );

  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);

  gradient.addColorStop(0, colorStart);
  gradient.addColorStop(0.5, colorMid);
  gradient.addColorStop(1, colorEnd);

  return gradient;
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
  currentMonth = 0
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
      datasets: data.datasets.map(dataset => ({
        ...dataset,
        borderColor: createGradient(chart.ctx, chart.chartArea),
      })),
    };

    setChartData(chartData);
  }, []);

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
      <Line data={chartData} ref={chartRef} width={`100%`} height={28} options={options} />
    </div>
  )
}
