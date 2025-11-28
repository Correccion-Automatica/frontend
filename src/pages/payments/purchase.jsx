import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/axios';
import { useAuth } from '../../context/AuthProvider';
import ButtonPrimary from '../../components/ButtonPrimary';
import { AiOutlineCreditCard, AiOutlineStar } from 'react-icons/ai';
import { FiShield } from 'react-icons/fi';

export default function Purchase() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selection, setSelection] = useState('pack-10');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [customCredits, setCustomCredits] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  // cart holds items added before checkout
  const [cart, setCart] = useState([]);

  const packages = {
    'pack-10': { credits: 10, price: 100, description: 'Ideal para probar el servicio' },
    'pack-100': { credits: 100, price: 800, description: 'Mejor precio por crédito' },
  };

  const selected = packages[selection];

  // allow custom credit quantity: compute derived price using best package rate
  const computed = useMemo(() => {
    const qty = Number(customCredits) || selected.credits;
    // compute unit price using selected package rate
    const unit = selected.price / selected.credits;
    const total = Math.round(unit * qty);
    return { qty, unit: unit.toFixed(2), total };
  }, [customCredits, selected]);

  // number of credits required per "pauta" (configurable)
  const CREDITS_PER_PAUTA = 1;

  function addToCart() {
    const item = { credits: computed.qty, price: computed.total, description: `Créditos x${computed.qty}` };
    setCart((c) => [...c, item]);
  }

  function removeFromCart(idx) {
    setCart((c) => c.filter((_, i) => i !== idx));
  }

  async function handleBuyWithMP() {
    setError(null);
    setCreating(true);
    // open a placeholder window synchronously to avoid popup blockers
    const checkoutWindow = window.open('', '_blank');
    try {
      // If there are items in cart, sum them, otherwise use current computed
      const totalAmount = cart.length ? cart.reduce((s, it) => s + Number(it.price), 0) : computed.total;
      const totalCredits = cart.length ? cart.reduce((s, it) => s + Number(it.credits), 0) : computed.qty;
      const body = {
        amount: totalAmount,
        credits: totalCredits,
        userId: user?.id,
        description: `Compra de ${totalCredits} créditos (${Math.floor(totalCredits / CREDITS_PER_PAUTA)} pautas)`
      };

      const res = await api.post('/mp/create', body);
      const data = res.data;

      // Si Mercado Pago devuelve init_point, redirigimos al checkout
      if (data && (data.init_point || data.sandbox_init_point)) {
        const url = data.init_point || data.sandbox_init_point;
        if (checkoutWindow) {
          checkoutWindow.location.href = url;
        } else {
          window.location.href = url;
        }
        setShowConfirm(false);
        // navigate to internal checkout using any id the backend returned
        const pid = data.paymentId || data.id;
        if (pid) navigate(`/payments/checkout/${pid}`);
        return;
      }

      // Fallback: si el backend devolvió un id de orden interno, navegamos al checkout interno
      if (data && data.id) {
        if (checkoutWindow) {
          checkoutWindow.close();
        }
        setShowConfirm(false);
        navigate(`/payments/checkout/${data.id}`);
        return;
      }

      throw new Error('Respuesta inesperada del servidor');
    } catch (err) {
      console.error('[purchase] error create preference', err);
      if (checkoutWindow) {
        checkoutWindow.close();
      }
      setError(err?.response?.data?.message || err.message || 'Error al crear pago');
      // Intentar fallback con el endpoint de pagos simulados
      try {
        const fallback = await api.post('/payments/create', {
          amount: selected.price,
          credits: selected.credits,
          userId: user?.id,
        });
        const fallbackData = fallback.data;
        if (fallbackData && fallbackData.id) {
          setShowConfirm(false);
          navigate(`/payments/checkout/${fallbackData.id}`);
          if (checkoutWindow) {
            checkoutWindow.close();
          }
        }
      } catch (err2) {
        console.error('[purchase] fallback failed', err2);
      }
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Comprar créditos</h1>
          <p className="text-sm text-gray-500">Selecciona un paquete o personaliza la cantidad. Verás el rendimiento y el total antes de continuar.</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-2"><AiOutlineStar className="text-yellow-500"/> Mejor tasa</div>
          <div className="flex items-center gap-2"><FiShield/> Pago seguro</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {Object.entries(packages).map(([key, pkg]) => (
              <label
                key={key}
                className={`rounded-lg p-4 cursor-pointer transition-colors duration-150 border ${selection === key ? 'border-blue-500 bg-blue-50 text-black dark:bg-blue-900 dark:text-white' : 'border-[var(--color-border)] bg-[var(--color-surface)] dark:bg-[var(--color-surface)] dark:border-[var(--color-border)]'}`}
              >
                <input
                  type="radio"
                  name="package"
                  value={key}
                  checked={selection === key}
                  onChange={() => { setSelection(key); setCustomCredits(''); }}
                  className="hidden"
                />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-medium">{pkg.credits} créditos</div>
                    <div className="text-sm text-gray-500">{pkg.description}</div>
                    <div className="text-xs text-gray-400 mt-1">{(pkg.price / pkg.credits).toFixed(2)} CLP por crédito</div>
                  </div>
                  <div className="text-xl font-semibold">${pkg.price}</div>
                </div>
              </label>
            ))}
          </div>

          <div className="border rounded-lg p-4 bg-[var(--color-surface)] dark:bg-[var(--color-surface)]">
            <h3 className="font-medium mb-2">Cantidad personalizada</h3>
            <div className="flex gap-3 items-center">
              <input
                  type="number"
                  min={1}
                  placeholder="Número de créditos"
                  value={customCredits}
                  onChange={(e) => setCustomCredits(e.target.value)}
                  className="border p-2 rounded w-40 bg-[var(--color-background)] text-[var(--color-text)] border-[var(--color-border)]"
                />
                <div className="text-sm text-[var(--color-muted)] dark:text-[var(--color-muted)]">Precio estimado: <strong className="text-[var(--color-text)]">${computed.total}</strong></div>
            </div>
            <div className="mt-3 text-xs text-gray-500">El precio se calcula con la tasa del paquete seleccionado ({selected.credits} créditos).</div>
            <div className="mt-3">
              <button className="mt-3 px-3 py-2 bg-blue-600 text-white rounded" onClick={addToCart}>Agregar al carrito</button>
            </div>
          </div>
        </div>

  {/* User info + cart summary (responsive) */}
        <aside className="bg-[var(--color-surface)] dark:bg-[var(--color-surface)] border rounded p-4">
          <h3 className="font-medium mb-3">Resumen de compra</h3>
          <div className="flex justify-between mb-1"><span className="text-[var(--color-text)]">Créditos</span><span className="text-[var(--color-text)]">{cart.length ? cart.reduce((s, it) => s + it.credits, 0) : computed.qty}</span></div>
          <div className="flex justify-between mb-1"><span className="text-[var(--color-text)]">Precio unitario</span><span className="text-[var(--color-text)]">{Number(computed.unit).toLocaleString()} CLP</span></div>
          <div className="flex justify-between font-semibold text-[var(--color-text)] mb-3"><span>Total</span><span>${cart.length ? cart.reduce((s, it) => s + it.price, 0) : computed.total}</span></div>

          <div className="mb-3 text-sm text-[var(--color-muted)]">Rendimiento: <strong className="text-[var(--color-text)]">{( (cart.length ? cart.reduce((s, it) => s + it.credits, 0) : computed.qty) / (cart.length ? cart.reduce((s, it) => s + it.price, 0) : computed.total) ).toFixed(4)}</strong> créditos por CLP</div>

          <div className="mb-4">
            <h4 className="font-medium">Carrito</h4>
            {cart.length === 0 ? (
              <div className="text-sm text-gray-500">El carrito está vacío</div>
            ) : (
              <ul className="text-sm">
                {cart.map((it, i) => (
                  <li key={i} className="flex justify-between items-center py-1">
                    <span>{it.description}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">${it.price}</span>
                      <button className="text-xs text-red-600" onClick={() => removeFromCart(i)}>Quitar</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col gap-2 md:sticky md:top-24">
            <ButtonPrimary onClick={() => setShowConfirm(true)} disabled={creating || (cart.length === 0 && !computed.qty)}>
              {creating ? 'Procesando...' : (cart.length ? 'Pagar carrito' : 'Pagar con Mercado Pago')}
            </ButtonPrimary>
            <button className="px-3 py-2 border rounded text-gray-700" onClick={() => navigate(-1)}>Volver</button>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            <div className="flex items-center gap-2"><AiOutlineCreditCard/> Pago seguro con Mercado Pago</div>
            <div className="flex items-center gap-2 mt-2"><FiShield/> Política de reembolsos sujeta a términos</div>
          </div>
        </aside>
      </div>

  {error && <div className="text-red-600 mb-4">{error}</div>}
      {/* Confirmación tipo carrito antes del checkout */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-[var(--color-surface)] dark:bg-[var(--color-surface)] rounded-lg max-w-lg w-full p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-2">Confirmar compra</h3>
            <p className="text-sm text-gray-600 mb-4">Revisa los detalles antes de continuar al checkout.</p>

            <div className="border rounded p-4 mb-4">
              <div className="flex justify-between mb-2"><span>Créditos</span><strong>{computed.qty}</strong></div>
              <div className="flex justify-between mb-2"><span>Precio total</span><strong>${computed.total}</strong></div>
              <div className="flex justify-between mb-2"><span>Pautas permitidas</span><strong>{Math.floor(computed.qty / CREDITS_PER_PAUTA)}</strong></div>
              <div className="text-xs text-gray-500 mt-2">El saldo quedará disponible en tu cuenta al confirmarse el pago.</div>
            </div>

            <div className="flex gap-3 justify-end">
              <button className="px-4 py-2 border rounded" onClick={() => setShowConfirm(false)}>Editar</button>
              <ButtonPrimary onClick={handleBuyWithMP} disabled={creating}>{creating ? 'Procesando...' : 'Confirmar y pagar'}</ButtonPrimary>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}