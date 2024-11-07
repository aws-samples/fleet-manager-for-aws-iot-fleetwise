import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '30 min ago', uv: 100, pv: 30, amt: 50 },
  { name: '20 min ago', uv: 80, pv: 40, amt: 70 },
  { name: '10 min ago', uv: 60, pv: 10, amt: 40 },
  { name: 'now', uv: 40, pv: 20, amt: 15 },
];

const BatteryChart = () => { 
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="pv" fill="#0972D3" stroke="#0972D3" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default BatteryChart;
