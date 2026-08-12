import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        setEvents(res.data);
      } catch (err) {
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading events...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Events</h1>

      {events.length === 0 ? (
        <p className="text-gray-500">No events available right now.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Link
              key={event._id}
              to={`/events/${event._id}`}
              className="block bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-gray-800">{event.title}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(event.date).toDateString()}
              </p>
              <p className="text-sm text-gray-500">{event.venue}</p>
              <p className="text-sm text-indigo-600 mt-2">
                {event.registeredCount}/{event.seatLimit} registered
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;