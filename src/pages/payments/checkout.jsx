import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../lib/axios";
import { AiOutlineClockCircle, AiOutlineCheckCircle, AiOutlineInfoCircle } from 'react-icons/ai';
import { useAuth } from '../../context/AuthProvider';
import { normalizeUser } from '../../lib/normalizeUser';

export default function Checkout() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/payments/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  const handleSimulatePay = async () => {
    setBusy(true);
    try {
      await fetch(`/api/payments/notify/${orderId}`, { method: 'POST', credentials: 'include' });
      // refresh order
      const res = await api.get(`/payments/${orderId}`);
      setOrder(res.data);
      // Refresh authenticated user so the credit balance updates immediately
      try {
        const me = await api.get('/users/me');
        setUser(normalizeUser(me.data));
      } catch (err) {
        // ignore user-refresh errors; not critical
        console.warn('[checkout] failed to refresh user after payment', err);
      }
      // small delay for UX
      setTimeout(() => navigate('/teacher-profile?paid=1'), 600);
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="p-6">Cargando...</div>;
  if (!order) return <div className="p-6 text-red-600">Orden no encontrada</div>;

  const statusBadge = () => {
    if (order.status === 'paid') return (<span className="inline-flex items-center gap-2 text-green-700 bg-green-100 px-2 py-1 rounded"><AiOutlineCheckCircle/> Pagado</span>);
    if (order.status === 'pending') return (<span className="inline-flex items-center gap-2 text-yellow-700 bg-yellow-50 px-2 py-1 rounded"><AiOutlineClockCircle/> Pendiente</span>);
    return (<span className="inline-flex items-center gap-2 text-gray-700 bg-gray-100 px-2 py-1 rounded"><AiOutlineInfoCircle/> {order.status}</span>);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Detalle de pago</h2>
          <div className="text-sm text-gray-500">Orden #{order.id} · {new Date(order.createdAt).toLocaleString()}</div>
        </div>
        <div>{statusBadge()}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border rounded p-6">
          <h3 className="font-medium text-lg mb-3">Resumen de la orden</h3>
          <div className="flex justify-between py-2 border-b"><span>Descripción</span><span>{order.description || '-'}</span></div>
          <div className="flex justify-between py-2 border-b"><span>Monto</span><span className="font-semibold">{order.amount} {order.currency}</span></div>
          <div className="flex justify-between py-2 border-b"><span>Metodo</span><span>{order.externalId ? 'Mercado Pago' : 'Mercado Pago (Sandbox)'}</span></div>
          <div className="flex justify-between py-2"><span>ID externo</span><span className="text-sm text-gray-600">{order.externalId || '-'}</span></div>

          {order.mpPreferenceId && (
            <div className="mt-4">
              <a className="inline-block text-sm text-blue-600 underline" href={`https://www.mercadopago.cl/checkout/v1/redirect?pref_id=${order.mpPreferenceId}`} target="_blank" rel="noreferrer">Abrir preferencia en Mercado Pago</a>
            </div>
          )}

          <div className="mt-6">
            <h4 className="font-medium mb-2">Instrucciones</h4>
            <ol className="list-decimal list-inside text-sm text-gray-600">
              <li>Haz click en el enlace de pago o espera la redirección desde la página de compra.</li>
              <li>Completa el checkout en Mercado Pago (modo sandbox si aplica).</li>
              <li>Al finalizar volverás a la aplicación y la orden se marcará como pagada.</li>
            </ol>
          </div>
        </div>

        <aside className="bg-white border rounded p-6">
          <h4 className="font-medium mb-3">Acciones</h4>
          <div className="flex flex-col gap-3">
              {order.status !== 'paid' && (
                <button onClick={handleSimulatePay} className="w-full px-4 py-2 bg-green-600 text-white rounded" disabled={busy}>{busy ? 'Procesando...' : 'Simular pago (dev)'}</button>
              )}
              <button onClick={() => navigate('/payments/purchase')} className="w-full px-4 py-2 border rounded">Volver a comprar</button>
              <button onClick={() => navigate('/teacher-profile')} className="w-full px-4 py-2 border rounded">Ir a mis cursos</button>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            <div className="font-medium">Soporte</div>
            <div>Si necesitas ayuda con el pago, contacta a soporte@tuapp.io</div>
          </div>
        </aside>
      </div>
    </div>
  );
}