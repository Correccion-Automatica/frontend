import { useEffect, useState } from 'react';
import { api } from '../lib/axios';

export default function PaymentsHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/payments');
        setPayments(res.data || []);
      } catch (err) {
        console.error('[PaymentsHistory] error', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalSpent = payments.reduce((s, p) => s + (Number(p.amount) || 0), 0);

  return (
    <div className="bg-white border rounded p-4 mt-6">
      <h4 className="font-medium mb-3">Historial de pagos</h4>
      {loading ? (
        <div className="text-sm text-gray-500">Cargando...</div>
      ) : (
        <>
          <div className="text-sm text-gray-600 mb-3">Total gastado: <strong>{totalSpent} CLP</strong></div>
          {payments.length === 0 ? (
            <div className="text-sm text-gray-500">Aún no hay pagos registrados.</div>
          ) : (
            <ul className="text-sm space-y-2">
              {payments.map((p) => (
                <li key={p.id} className="flex justify-between">
                  <div>
                    <div className="font-medium">{p.description || 'Compra de créditos'}</div>
                    <div className="text-xs text-gray-500">Orden #{p.id} · {new Date(p.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className={`text-sm ${p.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>{p.amount} {p.currency}</div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}