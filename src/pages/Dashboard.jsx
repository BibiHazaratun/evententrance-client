import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/events/dashboard/my');
        setEvents(res.data);
      } catch (err) {
        setError('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Events</h1>
        <Link
          to="/create-event"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700"
        >
          + Create Event
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="text-gray-500">You haven't created any events yet.</p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white border border-gray-200 rounded-lg p-5"
            >
              <h2 className="font-semibold text-gray-800">{event.title}</h2>
              <p className="text-sm text-gray-500">
                {new Date(event.date).toDateString()} • {event.venue}
              </p>
              <div className="flex gap-6 mt-3 text-sm">
                <span className="text-gray-600">
                  Registered: <span className="font-medium text-gray-800">{event.registeredCount}/{event.seatLimit}</span>
                </span>
                <span className="text-gray-600">
                  Attended: <span className="font-medium text-green-600">{event.attendedCount}</span>
                </span>
                <span className="text-gray-600 capitalize">
                  Status: <span className="font-medium text-indigo-600">{event.status}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;