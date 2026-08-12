import { useState, useEffect } from 'react';
import api from '../services/api';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await api.get('/registrations/my');
        setRegistrations(res.data);
      } catch (err) {
        setError('Failed to load registrations');
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Registrations</h1>

      {registrations.length === 0 ? (
        <p className="text-gray-500">You haven't registered for any events yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {registrations.map((reg) => (
            <div
              key={reg._id}
              className="bg-white border border-gray-200 rounded-lg p-5 flex gap-4 items-center"
            >
              <div className="flex-1">
                <h2 className="font-semibold text-gray-800">{reg.event?.title}</h2>
                <p className="text-sm text-gray-500">
                  {reg.event?.date && new Date(reg.event.date).toDateString()}
                </p>
                <p className="text-sm text-gray-500">{reg.event?.venue}</p>
                <p className="text-sm mt-1">
                  {reg.attended ? (
                    <span className="text-green-600 font-medium">✓ Checked in</span>
                  ) : (
                    <span className="text-amber-600 font-medium">Not checked in yet</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;