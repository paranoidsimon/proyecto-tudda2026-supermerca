import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useCommerce from '../services/useCommerce';
import useGlobal from '../services/useGlobal';

const money = value => new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
}).format(value);

export default function Cart() {
  const { role } = useGlobal();
  const { getCart, setCartItem, removeCartItem, checkout } = useCommerce();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [busy, setBusy] = useState(false);

  async function loadCart() {
    try {
      setCart(await getCart());
    } catch (error) {
      toast.error(error.message || 'No se pudo cargar el carrito');
    }
  }

  useEffect(() => {
    if (role === 'customer')
      loadCart();
  // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  if (role !== 'customer')
    return <p className="notice">Inicia sesión con una cuenta de cliente para ver el carrito.</p>;

  async function updateQuantity(item, quantity) {
    try {
      await setCartItem(item.productId, quantity);
      await loadCart();
    } catch (error) {
      toast.error(error.message || 'No se pudo actualizar la cantidad');
    }
  }

  async function remove(item) {
    try {
      await removeCartItem(item.productId);
      await loadCart();
    } catch (error) {
      toast.error(error.message || 'No se pudo quitar el producto');
    }
  }

  async function placeOrder() {
    setBusy(true);
    try {
      const order = await checkout();
      toast.success(`Pedido ${order._id} registrado. El pago no se procesa en línea.`);
      await loadCart();
    } catch (error) {
      toast.error(error.message || 'No se pudo registrar el pedido');
    } finally {
      setBusy(false);
    }
  }

  return <section className="store-page">
    <h1>Tu carrito</h1>
    {cart.items.length === 0 ? <p>El carrito está vacío. <Link to="/">Ver productos</Link></p> : <>
      <div className="cart-list">
        {cart.items.map(item => <article className="cart-item" key={item.productId}>
          <div>
            <strong>{item.product?.name || 'Producto ya no disponible'}</strong>
            {item.product && <p>{money(item.product.price)} · Subtotal: {money(item.product.price * item.quantity)}</p>}
          </div>
          {item.product
            ? <div className="button-row">
              <span>Cantidad: {item.quantity}</span>
              <button disabled={item.quantity <= 1} onClick={() => updateQuantity(item, item.quantity - 1)}>−</button>
              <button disabled={item.quantity >= item.product.stock} onClick={() => updateQuantity(item, item.quantity + 1)}>+</button>
              <button className="danger-button" onClick={() => remove(item)}>Quitar</button>
            </div>
            : <button className="danger-button" onClick={() => remove(item)}>Quitar</button>}
        </article>)}
      </div>
      <h2>Total: {money(cart.total)}</h2>
      <p>El pedido se registrará sin realizar un cobro en línea.</p>
      <button disabled={busy || cart.items.some(item => !item.product)} onClick={placeOrder}>
        {busy ? 'Registrando...' : 'Confirmar pedido'}
      </button>
    </>}
  </section>;
}
