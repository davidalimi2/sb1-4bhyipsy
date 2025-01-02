import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useMessageStore } from '../../../stores/messageStore';

export function MessageStats() {
  const messages = useMessageStore(state => state.messages);

  // Calculate stats
  const stats = {
    total: messages.length,
    unread: messages.filter(m => !m.read).length,
    withAttachments: messages.filter(m => m.attachments?.length).length
  };

  // Prepare chart data
  const chartData = [
    { name: 'Total', count: stats.total },
    { name: 'Unread', count: stats.unread },
    { name: 'With Attachments', count: stats.withAttachments }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500">{key}</div>
            <div className="text-2xl font-semibold">{value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Message Overview</h3>
        <BarChart width={500} height={300} data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#4F46E5" />
        </BarChart>
      </div>
    </div>
  );
}