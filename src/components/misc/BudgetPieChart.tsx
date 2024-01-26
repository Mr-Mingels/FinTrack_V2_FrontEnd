import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { BudgetPieChartProps } from '../../types';

const BudgetPieChart = ({ categories }: BudgetPieChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [data, setData] = useState<any>([])

  useEffect(() => {
    const newData = categories.map((category) => {
      return {
        name: category.name,
        value: category.percentage
      }
    })
    setData(newData)
  }, [categories])

  const handleMouseEnter = (index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  const renderTooltipContent = (props: any) => {
    const { payload } = props;
    if (!payload || payload.length === 0) return null;

    const { name, value } = payload[0].payload;
    return (
      <div className='px-4 py-2 bg-white border border-solid border-[#1b1b1b] text-sm whitespace-nowrap'>
        <p className=''>{name}</p>
        <p className='mt-2'>Budget Allocation: {value}%</p>
      </div>
    );
  };

  return (
    <ResponsiveContainer width={'100%'} height={'100%'}>
      <PieChart>
        <Pie
          data={data}
          labelLine={false}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((index: number) => (
            <Cell key={`cell-${index}`} fill={`#6d9dc5`}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              style={{
                opacity: activeIndex === index ? 0.7 : 1,
                transition: 'opacity 0.3s ease-in-out',
              }} />
          ))}
        </Pie>
        <Tooltip content={renderTooltipContent} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default BudgetPieChart;



