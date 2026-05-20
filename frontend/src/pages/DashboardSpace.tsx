import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet, Clock, CheckCircle, Flame } from 'lucide-react';

const data = [
  { name: 'Jan', saved: 400 },
  { name: 'Feb', saved: 800 },
  { name: 'Mar', saved: 1200 },
  { name: 'Apr', saved: 1500 },
  { name: 'May', saved: 2100 },
];

const StatCard = ({ title, value, icon: Icon, color, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="bg-secondary/60 backdrop-blur-md p-4 sm:p-6 rounded-3xl border border-white/5 flex items-center justify-between gap-4"
  >
    <div>
      <p className="text-gray-400 text-xs sm:text-sm mb-1">{title}</p>
      <h3 className="text-2xl sm:text-3xl font-bold text-white">{value}</h3>
    </div>
    <div className={`p-3 sm:p-4 rounded-full bg-${color}-500/20 text-${color}-400 shrink-0`}>
      <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
    </div>
  </motion.div>
);

export const DashboardSpace = () => {
  return (
    <div className="max-w-6xl mx-auto pb-24">
      <motion.div
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        className="mb-6 sm:mb-8"
      >
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">Welcome back, Space Explorer</h1>
        <p className="text-gray-400">Here is your subscription universe at a glance.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatCard title="Total Saved" value="₹2,100" icon={Wallet} color="green" delay={0.1} />
        <StatCard title="Active Bundles" value="3" icon={Flame} color="orange" delay={0.2} />
        <StatCard title="Pending Auth" value="1" icon={Clock} color="yellow" delay={0.3} />
        <StatCard title="Renewals (30d)" value="2" icon={CheckCircle} color="blue" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-secondary/60 backdrop-blur-md p-4 sm:p-6 rounded-3xl border border-white/5"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Savings Trajectory</h3>
          <div className="h-56 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff50" axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff50" axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#151B2F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#06B6D4' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="saved" 
                  stroke="#06B6D4" 
                  strokeWidth={4}
                  dot={{ fill: '#06B6D4', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity or Active Subscriptions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-secondary/60 backdrop-blur-md p-4 sm:p-6 rounded-3xl border border-white/5 flex flex-col"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Active Bundles</h3>
          
          <div className="flex-1 space-y-4">
            {['Entertainment Starter', 'Creator Pro', 'Music Premium'].map((bundle, i) => (
              <div key={i} className="flex items-center justify-between gap-3 p-3 sm:p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="min-w-0">
                  <h4 className="font-medium text-white">{bundle}</h4>
                  <p className="text-xs text-gray-400">Renews in {14 + i * 5} days</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-accent-purple/20 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-accent-purple" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
