'use client';

import React from 'react';
import { CollegeLayout } from '@/components/college/CollegeLayout';
import { CollegeStatCard } from '@/components/college/CollegeStatCard';
import { 
  Calendar, 
  Users, 
  Eye, 
  Trophy,
  TrendingUp,
  Zap
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

// Mock data for charts
const registrationData = [
  { name: 'Mon', registrations: 12 },
  { name: 'Tue', registrations: 19 },
  { name: 'Wed', registrations: 15 },
  { name: 'Thu', registrations: 22 },
  { name: 'Fri', registrations: 30 },
  { name: 'Sat', registrations: 25 },
  { name: 'Sun', registrations: 18 },
];

const viewData = [
  { name: 'Hackathon', views: 450 },
  { name: 'Workshop', views: 320 },
  { name: 'Seminar', views: 280 },
  { name: 'Cultural', views: 560 },
  { name: 'Sports', views: 390 },
];

const categoryData = [
  { name: 'Technical', value: 40 },
  { name: 'Cultural', value: 30 },
  { name: 'Sports', value: 20 },
  { name: 'Other', value: 10 },
];

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444'];

export default function CollegeDashboard() {
  return (
    <CollegeLayout>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h2>
          <p className="text-gray-500 font-medium mt-1">Welcome back! Here's what's happening with your events.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-2 font-bold text-sm shadow-sm">
            <TrendingUp className="h-4 w-4" />
            Performance: +12% this week
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CollegeStatCard 
          label="Total Events" 
          value="24" 
          icon={Calendar} 
          trend={{ value: 8, isUp: true }}
          color="blue"
        />
        <CollegeStatCard 
          label="Upcoming Events" 
          value="6" 
          icon={Zap} 
          description="Next event in 2 days"
          color="amber"
        />
        <CollegeStatCard 
          label="Total Registrations" 
          value="1,284" 
          icon={Users} 
          trend={{ value: 15, isUp: true }}
          color="emerald"
        />
        <CollegeStatCard 
          label="Page Views" 
          value="12.5k" 
          icon={Eye} 
          trend={{ value: 4, isUp: true }}
          color="indigo"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Registration Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-900">Registration Trends</h3>
            <Badge variant="outline" className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Weekly</Badge>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={registrationData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  cursor={{ stroke: '#2563eb', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="registrations" 
                  stroke="#2563eb" 
                  strokeWidth={3} 
                  dot={{ fill: '#2563eb', strokeWidth: 2, r: 4, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* View Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-900">Views per Event</h3>
            <Badge variant="outline" className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Top 5 Events</Badge>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={viewData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar 
                  dataKey="views" 
                  fill="#2563eb" 
                  radius={[6, 6, 0, 0]} 
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8">
        {/* Category Pie Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-1"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-6">Event Categories</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  align="center"
                  iconType="circle"
                  wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 500 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Registrations Placeholder */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Registrations</h3>
            <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">View All</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-50 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    JD
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">John Doe</p>
                    <p className="text-xs text-gray-500 font-medium">Hackathon 2024</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-900">2 mins ago</p>
                  <Badge variant="outline" className="text-green-600 bg-green-50 border-green-100 text-[10px] font-bold mt-1 uppercase">Paid</Badge>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </CollegeLayout>
  );
}
