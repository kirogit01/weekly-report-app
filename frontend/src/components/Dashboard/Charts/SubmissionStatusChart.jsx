import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = { submitted: '#16a34a', pending: '#eab308' };

const SubmissionStatusChart = ({ data }) => {
  const chartData = data.map((d) => ({ ...d, value: 1 }));

  return (
    <div className="bg-white rounded-xl border shadow-sm p-5">
      <h3 className="font-semibold mb-4">Submission Status by Team Member</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="member" width={100} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(_, __, props) => props.payload.status} />
          <Bar dataKey="value">
            {chartData.map((entry, index) => (
              <Cell key={index} fill={COLORS[entry.status] || '#9ca3af'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SubmissionStatusChart;
