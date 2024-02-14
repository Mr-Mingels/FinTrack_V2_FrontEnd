import React, { useEffect, useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import { BudgetPieChartProps } from '../../types'

import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip)

const BudgetPieChart = ({ categories }: BudgetPieChartProps) => {
	const [data, setData] = useState<any>([]);

	useEffect(() => {
		const newData = categories.map((category) => ({
			name: category.name,
			value: category.percentage
		}));
		setData(newData);
	}, [categories]);

	const pieChartData = {
		datasets: [
			{
				data: data,
				backgroundColor: '#6d9dc5',
				borderColor: 'white',
				borderWidth: 1,
			},
		],
	}

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
					// Custom tooltip function
					afterLabel: function (context: any) {
						const dataset = context.dataset.data;
						const total = dataset.reduce((acc: any, curr: any) => acc + curr.value, 0);
						const currentValue = dataset[context.dataIndex].value;
						const percentage = ((currentValue / total) * 100).toFixed(0);
						return ' ' + '\n' + 'Budget Allocation: ' + percentage + '%';
					}
				}
			}
		},
	}

	return (
		<div
			className={`flex flex-grow items-center justify-between h-full`}
		>
			<Doughnut
				data={pieChartData}
				options={options}
				className="doughNutChart"
			/>
		</div>
	)
}

export default BudgetPieChart
