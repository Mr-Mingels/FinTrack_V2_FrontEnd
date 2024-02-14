import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { formatCurrency } from '../../utils/currencyUtils';

export const ExpenseDoughNutChart = ({chartData}: any) => {
    const [data, setData] = useState<any>([]);

	useEffect(() => {
        if (!chartData) return
		const newData = chartData.data.map((data: any) => ({
			name: data.label,
			value: data.value
		}));
		setData(newData);
	}, [chartData]);

    if (!chartData) return

	const doughNutChartData = {
		datasets: [
		  {
			data: data,
			backgroundColor: (context: any) => {
			  if (context.dataIndex && data[context.dataIndex].name === 'Selected Expense') {
				return '#0ba5ec'; // Your custom color for the specific value
			  } else {
				return '#6d9dc5'; // Default color for other slices
			  }
			},
			borderColor: 'white',
			borderWidth: 1,
		  },
		],
	  };

    const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				callbacks: {
					label: function (context: any) {
						let label = context.dataset.label || '';
						if (context.parsed) {
							label = context.dataset.data[context.dataIndex].name
						}
						return label;
					},
					afterLabel: function (context: any) {
						const dataset = context.dataset.data;
						const currentValue = dataset[context.dataIndex].value;
						return formatCurrency(currentValue) + '  /  ' + formatCurrency(chartData.budgetAmount);
					}
				}
			}
		},
	}

    const plugins = [{
        beforeDraw: function(chart) {
             const percentage = ((chartData.expenseAmount / chartData.budgetAmount) * 100).toFixed(0);
             const width = chart.width,
             height = chart.height,
             ctx = chart.ctx;
             ctx.restore();
             const fontSize = (height / 160).toFixed(2);
             ctx.font = fontSize + "em sans-serif";
             ctx.textBaseline = "top";
             const text = `${percentage}%`,
             textX = Math.round((width - ctx.measureText(text).width) / 1.95),
             textY = height / 2.2;
             ctx.fillText(text, textX, textY);
             ctx.save();
        } 
      }]

    return (
        <div className='w-[50%] h-[200px]'>
            <Doughnut data={doughNutChartData} plugins={plugins} options={options}/>
        </div>
    );
};

