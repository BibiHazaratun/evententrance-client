import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registering, setRegistering] = useState(false);
  const [registration, setRegistration] = useState(null);
  const [checkingRegistration, setCheckingRegistration] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        setError('Event not found');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  useEffect(() => {
    const checkExistingRegistration = async () => {
      if (!user) {
        setCheckingRegistration(false);
        return;
      }
      try {
        const res = await api.get('/registrations/my');
        const existing = res.data.find(
          (r) => (r.event?._id || r.event) === id
        );
        if (existing) {
          setRegistration(existing);
        }
      } catch (err) {
        // ignore, fallback to button
      } finally {
        setCheckingRegistration(false);
      }
    };
    checkExistingRegistration();
  }, [id, user]);

  const handleRegister = async () => {
    setError('');
    setRegistering(true);
    try {
      const res = await api.post(`/registrations/${id}`);
      setRegistration(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      if (msg.toLowerCase().includes('already registered')) {
        setRegistration({ alreadyRegisteredNoQr: true });
      }
    } finally {
      setRegistering(false);
    }
  };

  if (loading || checkingRegistration) return <div className="p-10 text-center text-gray-500">Loading...</div>;
  if (!event) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{event.title}</h1>
      <p className="text-gray-500 mb-4">{event.description}</p>

      <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-2 text-sm">
        <p><span className="font-medium text-gray-700">Date:</span> {new Date(event.date).toDateString()}</p>
        <p><span className="font-medium text-gray-700">Venue:</span> {event.venue}</p>
        <p><span className="font-medium text-gray-700">Seats:</span> {event.registeredCount}/{event.seatLimit}</p>
        <p><span className="font-medium text-gray-700">Organizer:</span> {event.organizer?.name}</p>
      </div>

      {error && !registration?.alreadyRegisteredNoQr && (
        <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-md mt-4">
          {error}
        </div>
      )}

      {registration ? (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-5 text-center">
          <p className="text-green-700 font-medium mb-3">You're registered! 🎉</p>
          {registration.qrImage ? (
            <>
              <img src={registration.qrImage} alt="QR Code" className="w-48 h-48 mx-auto" />
              <p className="text-xs text-gray-500 mt-2">Show this QR code at the entrance</p>
            </>
          ) : (
            <p className="text-xs text-gray-500">
              Check "My Registrations" to view your QR code.
            </p>
          )}
        </div>
      ) : (
        <button
          onClick={handleRegister}
          disabled={!user || registering || event.registeredCount >= event.seatLimit}
          className="w-full mt-6 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {!user
            ? 'Login to register'
            : event.registeredCount >= event.seatLimit
            ? 'Event Full'
            : registering
            ? 'Registering...'
            : 'Register for this Event'}
        </button>
      )}
    </div>
  );
};

export default EventDetails;