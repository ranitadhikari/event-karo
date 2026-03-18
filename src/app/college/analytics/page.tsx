'use client';

import React from 'react';
import { CollegeLayout } from '@/components/college/CollegeLayout';
import { CollegeStatCard } from '@/components/college/CollegeStatCard';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  Zap, 
  Download,
  Calendar,
  MousePointer2,
  Share2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

// Mock data for analytics
const registrationTrend = [
  { name: 'Jan', count: 120 },
  { name: 'Feb', count: 210 },
  { name: 'Mar', count: 450 },
  { name: 'Apr', count: 380 },
  { name: 'May', count: 560 },
  { name: 'Jun', count: 840 },
];

const eventPerformance = [
  { name: 'Tech Fest', value: 850 },
  { name: 'Hackathon', value: 420 },
  { name: 'Workshop', value: 210 },
  { name: 'Cultural', value: 640 },
  { name: 'Sports', value: 390 },
];

const conversionData = [
  { name: 'Registered', value: 65 },
  { name: 'Interested', value: 25 },
  { name: 'Not Interested', value: 10 },
];

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444'];

export default function AnalyticsPage() {
  return (
    <CollegeLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Advanced Analytics</h2>
            <p className="text-gray-500 font-medium mt-1 text-sm">Deep dive into your event performance and user engagement.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-10 px-4 rounded-lg border-gray-200 bg-white text-gray-700 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-2 font-bold text-sm shadow-sm">
              <TrendingUp className="h-4 w-4" />
              Growth: +24% YoY
            </div>
          </div>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CollegeStatCard 
            label="Avg. Engagement" 
            value="84%" 
            icon={Target} 
            trend={{ value: 5, isUp: true }}
            color="blue"
          />
          <CollegeStatCard 
            label="Conversion Rate" 
            value="12.4%" 
            icon={Zap} 
            trend={{ value: 2, isUp: true }}
            color="amber"
          />
          <CollegeStatCard 
            label="Daily Unique Visitors" 
            value="2,482" 
            icon={Users} 
            trend={{ value: 12, isUp: true }}
            color="emerald"
          />
          <CollegeStatCard 
            label="Social Shares" 
            value="842" 
            icon={Share2} 
            trend={{ value: 8, isUp: true }}
            color="indigo"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Growth Trend */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-8">Registration Growth</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={registrationTrend}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
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
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#2563eb" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Performance Bar Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-8">Event Performance</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eventPerformance}>
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
                    dataKey="value" 
                    fill="#2563eb" 
                    radius={[6, 6, 0, 0]} 
                    barSize={32}
                  >
                    {eventPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </CollegeLayout>
  );
}
