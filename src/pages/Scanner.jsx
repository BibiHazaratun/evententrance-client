import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import api from '../services/api';

const Scanner = () => {
  const scannerRef = useRef(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode('qr-reader');
    scannerRef.current = html5QrCode;

    html5QrCode
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          // Stop scanning once a code is found
          await html5QrCode.stop();
          setScanning(false);
          handleScan(decodedText);
        },
        () => {} // ignore per-frame scan failures
      )
      .catch(() => setError('Unable to access camera'));

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const handleScan = async (qrCode) => {
    setError('');
    try {
      const res = await api.post(`/registrations/scan/${qrCode}`);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Scan failed');
    }
  };

  const handleRescan = () => {
    setResult(null);
    setError('');
    setScanning(true);
    window.location.reload();
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Scan QR Code</h1>

      {scanning && <div id="qr-reader" className="rounded-lg overflow-hidden" />}

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-md mt-4">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-5 mt-4 text-center">
          <p className="text-green-700 font-medium mb-2">✓ {result.message}</p>
          <p className="text-sm text-gray-700">{result.attendee}</p>
          <p className="text-sm text-gray-500">{result.event}</p>
        </div>
      )}

      {!scanning && (
        <button
          onClick={handleRescan}
          className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
        >
          Scan Another
        </button>
      )}
    </div>
  );
};

export default Scanner;