
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { IssueCategory } from '../types';

const data = [
  { name: 'Potholes', value: 30, color: '#f97316' },
  { name: 'Water Leaks', value: 20, color: '#3b82f6' },
  { name: 'Waste Mgt', value: 20, color: '#10b981' },
  { name: 'Street Lights', value: 15, color: '#eab308' },
  { name: 'Other', value: 15, color: '#64748b' },
];

export const StatsChart: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
           <i className="fas fa-chart-pie text-blue-500"></i>
           Issue Distribution by Category
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
           <i className="fas fa-chart-line text-emerald-500"></i>
           Resolution Performance
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: 'Mon', solved: 12, reported: 15 },
                { name: 'Tue', solved: 18, reported: 14 },
                { name: 'Wed', solved: 10, reported: 22 },
                { name: 'Thu', solved: 25, reported: 18 },
                { name: 'Fri', solved: 30, reported: 28 },
                { name: 'Sat', solved: 15, reported: 10 },
                { name: 'Sun', solved: 8, reported: 5 },
              ]}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip cursor={{ fill: '#f8fafc' }} />
              <Legend />
              <Bar dataKey="reported" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="solved" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
