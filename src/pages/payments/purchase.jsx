import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/axios';
import { useAuth } from '../../context/AuthProvider';
import ButtonPrimary from '../../components/ButtonPrimary';
import { AiOutlineCreditCard, AiOutlineStar } from 'react-icons/ai';
import { FiShield } from 'react-icons/fi';

const CREDIT_PACKS = [
  { id: 'mini', label: 'Mini Pack', credits: 500, price: 2900, note: 'Para probar' },
  { id: 'medium', label: 'Medium Pack', credits: 1000, price: 4900, note: 'Mas conveniente' },
  { id: 'max', label: 'Max Pack', credits: 1500, price: 6900, note: 'Mejor relacion' },
];

const formatCLP = (value) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);

export default function Purchase() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selection, setSelection] = useState(CREDIT_PACKS[0].id);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [customCredits, setCustomCredits] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [cart, setCart] = useState([]);

  const selectedPack = CREDIT_PACKS.find((pack) => pack.id === selection) || CREDIT_PACKS[0];

  const computed = useMemo(() => {
    const qty = Number(customCredits) || selectedPack.credits;
    const unit = selectedPack.price / selectedPack.credits;
    const total = Math.round(unit * qty);
    return { qty, unit: unit.toFixed(2), total };
  }, [customCredits, selectedPack]);

  const CREDITS_PER_PAUTA = 400;

  function addToCart() {
    const item = { credits: computed.qty, price: computed.total, description: `Creditos x${computed.qty}` };
    setCart((c) => [...c, item]);
  }

  function removeFromCart(idx) {
    setCart((c) => c.filter((_, i) => i !== idx));
  }

  async function handleBuyWithMP() {
    setError(null);
    setCreating(true);
    const checkoutWindow = window.open('', '_blank');
    try {
      const totalAmount = cart.length ? cart.reduce((sum, item) => sum + Number(item.price), 0) : computed.total;
      const totalCredits = cart.length ? cart.reduce((sum, item) => sum + Number(item.credits), 0) : computed.qty;
      const categoryId = 'services'; // recomendado por MP para aprobación
      const description =
        cart.length > 0
          ? `Carrito de créditos: ${cart.map((i) => `${i.credits} créditos`).join(' | ')}`
          : `Compra de ${totalCredits} créditos (${selectedPack.label})`;
      const body = {
        amount: totalAmount,
        credits: totalCredits,
        userId: user?.id,
        description,
        categoryId,
      };

      const res = await api.post('/mp/create', body);
      const data = res.data;

      if (data && (data.init_point || data.sandbox_init_point)) {
        const url = data.init_point || data.sandbox_init_point;
        if (checkoutWindow) {
          checkoutWindow.location.href = url;
        } else {
          window.location.href = url;
        }
        setShowConfirm(false);
        const pid = data.paymentId || data.id;
        if (pid) navigate(`/payments/checkout/${pid}`);
        return;
      }

      if (data && data.id) {
        if (checkoutWindow) checkoutWindow.close();
        setShowConfirm(false);
        navigate(`/payments/checkout/${data.id}`);
        return;
      }

      throw new Error('Respuesta inesperada del servidor');
    } catch (err) {
      console.error('[purchase] error create preference', err);
      if (checkoutWindow) checkoutWindow.close();
      setError(err?.response?.data?.message || err.message || 'Error al crear pago');
    } finally {
      setCreating(false);
    }
  }

  const totalCreditsInCart = cart.reduce((sum, item) => sum + Number(item.credits), 0);
  const totalAmountInCart = cart.reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Comprar creditos</h1>
          <p className="text-sm text-gray-500">Selecciona un paquete sugerido o personaliza la cantidad para ver el total estimado.</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-2"><AiOutlineStar className="text-yellow-500"/> Mejor tasa</div>
          <div className="flex items-center gap-2"><FiShield/> Pago seguro</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {CREDIT_PACKS.map((pack) => (
              <label
                key={pack.id}
                className={`rounded-lg p-4 cursor-pointer transition border ${selection === pack.id ? 'border-blue-500 bg-blue-50' : 'border-[var(--color-border)] bg-[var(--color-surface)]'}`}
              >
                <input
                  type="radio"
                  name="package"
                  value={pack.id}
                  checked={selection === pack.id}
                  onChange={() => { setSelection(pack.id); setCustomCredits(''); }}
                  className="hidden"
                />
                <div className="flex flex-col gap-1">
                  <div className="text-xs uppercase tracking-wide text-gray-500">{pack.label}</div>
                  <div className="text-lg font-semibold">{pack.credits.toLocaleString()} creditos</div>
                  <div className="text-sm text-gray-500">{pack.note}</div>
                </div>
                <div className="mt-3 text-xl font-semibold">{formatCLP(pack.price)}</div>
              </label>
            ))}
          </div>

          <div className="border rounded-lg p-4 bg-[var(--color-surface)]">
            <h3 className="font-medium mb-2">Cantidad personalizada</h3>
            <div className="flex gap-3 items-center flex-wrap">
              <input
                type="number"
                min={1}
                placeholder="Numero de creditos"
                id="customCredits"
                name="customCredits"
                value={customCredits}
                onChange={(e) => setCustomCredits(e.target.value)}
                className="border p-2 rounded w-48 bg-[var(--color-background)] text-[var(--color-text)] border-[var(--color-border)]"
              />
              <div className="text-sm text-[var(--color-muted)]">Precio estimado: <strong className="text-[var(--color-text)]">{formatCLP(computed.total)}</strong></div>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              El valor se calcula usando la tasa del paquete seleccionado ({selectedPack.label}).
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-xs text-gray-500">El botón agrega al carrito el paquete seleccionado o la cantidad personalizada.</p>
            <button className="px-3 py-2 bg-blue-600 text-white rounded self-start sm:self-auto" onClick={addToCart}>
              Agregar selección al carrito
            </button>
          </div>
        </div>

        <aside className="bg-[var(--color-surface)] border rounded p-4">
          <h3 className="font-medium mb-3">Resumen de compra</h3>
          <div className="flex justify-between mb-1"><span>Creditos</span><span>{cart.length ? totalCreditsInCart : computed.qty}</span></div>
          <div className="flex justify-between font-semibold mb-3"><span>Total</span><span>{formatCLP(cart.length ? totalAmountInCart : computed.total)}</span></div>

          <div className="mb-4">
            <h4 className="font-medium">Carrito</h4>
            {cart.length === 0 ? (
              <div className="text-sm text-gray-500">El carrito esta vacio</div>
            ) : (
              <ul className="text-sm space-y-1">
                {cart.map((item, i) => (
                  <li key={`${item.description}-${i}`} className="flex justify-between items-center">
                    <span>{item.description}</span>
                    <div className="flex items-center gap-2">
                      <span>{formatCLP(item.price)}</span>
                      <button className="text-xs text-red-600" onClick={() => removeFromCart(i)}>Quitar</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <ButtonPrimary onClick={() => setShowConfirm(true)} disabled={creating || (cart.length === 0 && !computed.qty)}>
              {creating ? 'Procesando...' : (cart.length ? 'Pagar carrito' : 'Pagar con Mercado Pago')}
            </ButtonPrimary>
            <button className="px-3 py-2 border rounded text-gray-700" onClick={() => navigate(-1)}>Volver</button>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            <div className="flex items-center gap-2"><AiOutlineCreditCard/> Pago seguro con Mercado Pago</div>
            <div className="flex items-center gap-2 mt-2"><FiShield/> Politica de reembolsos sujeta a terminos</div>
          </div>
        </aside>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-[var(--color-surface)] rounded-lg max-w-lg w-full p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-2">Confirmar compra</h3>
            <p className="text-sm text-gray-600 mb-4">Revisa los detalles antes de continuar al checkout.</p>

            <div className="border rounded p-4 mb-4">
              <div className="flex justify-between mb-2"><span>Creditos</span><strong>{computed.qty}</strong></div>
              <div className="flex justify-between mb-2"><span>Precio total</span><strong>{formatCLP(computed.total)}</strong></div>
              <div className="flex justify-between mb-2"><span>Pautas estimadas</span><strong>{Math.floor(computed.qty / CREDITS_PER_PAUTA)}</strong></div>
              <div className="text-xs text-gray-500 mt-2">El saldo quedara disponible en tu cuenta al confirmarse el pago.</div>
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
