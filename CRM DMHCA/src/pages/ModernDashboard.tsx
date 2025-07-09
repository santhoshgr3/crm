import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target,
  Calendar,
  MessageCircle,
  BarChart3,
  Activity
} from 'lucide-react';
import DashboardWidget from '../components/ui/DashboardWidget';
import KanbanPipeline from '../components/ui/KanbanPipeline';
import { CustomerTimeline, sampleEvents } from '../components/ui/CustomerTimeline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const ResponsiveGridLayout = WidthProvider(Responsive);

const ModernDashboard: React.FC = () => {
  const [layouts, setLayouts] = useState({});
  const [showKanban, setShowKanban] = useState(false);

  // Sample data for charts
  const lineChartData = [
    { name: 'Jan', leads: 65, conversions: 28 },
    { name: 'Feb', leads: 78, conversions: 35 },
    { name: 'Mar', leads: 90, conversions: 42 },
    { name: 'Apr', leads: 81, conversions: 38 },
    { name: 'May', leads: 95, conversions: 48 },
    { name: 'Jun', leads: 110, conversions: 55 }
  ];

  const barChartData = [
    { name: 'Emergency Med', value: 45 },
    { name: 'Cardiology', value: 32 },
    { name: 'Surgery', value: 28 },
    { name: 'Pediatrics', value: 22 },
    { name: 'Radiology', value: 18 }
  ];

  const pieChartData = [
    { name: 'Hot', value: 35, color: '#EF4444' },
    { name: 'Warm', value: 28, color: '#F59E0B' },
    { name: 'Cold', value: 20, color: '#3B82F6' },
    { name: 'Converted', value: 17, color: '#10B981' }
  ];

  const defaultLayout = [
    { i: 'stats1', x: 0, y: 0, w: 3, h: 2 },
    { i: 'stats2', x: 3, y: 0, w: 3, h: 2 },
    { i: 'stats3', x: 6, y: 0, w: 3, h: 2 },
    { i: 'stats4', x: 9, y: 0, w: 3, h: 2 },
    { i: 'chart1', x: 0, y: 2, w: 6, h: 4 },
    { i: 'chart2', x: 6, y: 2, w: 6, h: 4 },
    { i: 'chart3', x: 0, y: 6, w: 4, h: 4 },
    { i: 'timeline', x: 4, y: 6, w: 8, h: 4 }
  ];

  if (showKanban) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Sales Pipeline
            </h1>
            <button
              onClick={() => setShowKanban(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
          <KanbanPipeline />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back! Here's what's happening with your medical education business.
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowKanban(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Pipeline
            </button>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              Customize Layout
            </button>
          </div>
        </div>
      </motion.div>

      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        onLayoutChange={(layout, layouts) => setLayouts(layouts)}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
        isDraggable={true}
        isResizable={true}
        margin={[16, 16]}
      >
        {/* Stats Widgets */}
        <div key="stats1">
          <DashboardWidget
            id="stats1"
            title="Total Leads"
            value="1,247"
            change={{ value: 12.5, type: 'increase', period: 'last month' }}
            icon={Users}
            color="blue"
          />
        </div>

        <div key="stats2">
          <DashboardWidget
            id="stats2"
            title="Conversion Rate"
            value="24.8%"
            change={{ value: 3.2, type: 'increase', period: 'last month' }}
            icon={Target}
            color="green"
          />
        </div>

        <div key="stats3">
          <DashboardWidget
            id="stats3"
            title="Revenue"
            value="$485K"
            change={{ value: 8.1, type: 'increase', period: 'last month' }}
            icon={DollarSign}
            color="purple"
          />
        </div>

        <div key="stats4">
          <DashboardWidget
            id="stats4"
            title="Active Courses"
            value="24"
            change={{ value: 2.3, type: 'decrease', period: 'last month' }}
            icon={BarChart3}
            color="orange"
          />
        </div>

        {/* Line Chart */}
        <div key="chart1">
          <DashboardWidget
            id="chart1"
            title="Leads & Conversions Trend"
            value=""
            color="blue"
          >
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </DashboardWidget>
        </div>

        {/* Bar Chart */}
        <div key="chart2">
          <DashboardWidget
            id="chart2"
            title="Popular Courses"
            value=""
            color="green"
          >
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </DashboardWidget>
        </div>

        {/* Pie Chart */}
        <div key="chart3">
          <DashboardWidget
            id="chart3"
            title="Lead Status Distribution"
            value=""
            color="purple"
          >
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </DashboardWidget>
        </div>

        {/* Timeline */}
        <div key="timeline">
          <CustomerTimeline customerId="sample" events={sampleEvents} />
        </div>
      </ResponsiveGridLayout>
    </div>
  );
};

export default ModernDashboard;