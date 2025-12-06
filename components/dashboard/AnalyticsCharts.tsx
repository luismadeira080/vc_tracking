'use client';

import { format, parseISO } from 'date-fns';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface CategoryData {
  category: string;
  'Engagement': number;
  'Avg. Eng. per Post': number;
}

interface TimelineData {
  date: string;
  engagement: number;
}

interface AnalyticsChartsProps {
  categoryChartData: CategoryData[];
  timelineData: TimelineData[];
}

export function AnalyticsCharts({ categoryChartData, timelineData }: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart A: Engagement by Content Category */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
          Engagement by Content Category
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryChartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis type="number" stroke="#71717a" />
            <YAxis dataKey="category" type="category" width={120} stroke="#71717a" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                border: '1px solid #27272a',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#fafafa' }}
            />
            <Legend />
            <Bar dataKey="Engagement" fill="#10B981" />
            <Bar dataKey="Avg. Eng. per Post" fill="#6EE7B7" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart B: Engagement Timeline */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
          Engagement Timeline
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(parseISO(date), 'MMM dd')}
              stroke="#71717a"
            />
            <YAxis stroke="#71717a" />
            <Tooltip
              labelFormatter={(date) => format(parseISO(date), 'MMM dd, yyyy')}
              contentStyle={{
                backgroundColor: '#18181b',
                border: '1px solid #27272a',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#fafafa' }}
            />
            <Line
              type="monotone"
              dataKey="engagement"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: '#10B981', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
