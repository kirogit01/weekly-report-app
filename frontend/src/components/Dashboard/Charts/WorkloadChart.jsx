import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#4f46e5', '#0ea5e9', '#16a34a', '#eab308', '#ef4444', '#8b5cf6'];

const WorkloadChart = ({ data }) => (
  <div className="bg-white rounded-xl border shadow-sm p-5">
    <h3 className="font-semibold mb-4">Workload Distribution by Project</h3>
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="totalHours"
          nameKey="project"
          cx="50%"
          cy="50%"
          outerRadius={90}
          label={(entry) => entry.project}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default WorkloadChart;
