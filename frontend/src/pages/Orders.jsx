import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useCommerce from '../services/useCommerce';
import useGlobal from '../services/useGlobal';

const statusLabels = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  shipped: 'Enviado',
  completed: 'Completado',
  cancelled: 'Cancelado',
};
const money = value => new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
}).format(value);

export default function Orders() {
  const { role } = useGlobal();
  const { getOrders, updateOrderStatus } = useCommerce();
  const [orders, setOrders] = useState([]);

  async function loadOrders() {
    try {
      setOrders(await getOrders());
    } catch (error) {
      toast.error(error.message || 'No se pudieron cargar los pedidos');
    }
  }

  useEffect(() => {
    if (role)
      loadOrders();
  // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  if (!role)
    return <p className="notice">Inicia sesión para consultar tus pedidos.</p>;

  async function changeStatus(order, status) {
    try {
      await updateOrderStatus(order._id, status);
      toast.success('Estado del pedido actualizado');
      await loadOrders();
    } catch (error) {
      toast.error(error.message || 'No se pudo cambiar el estado');
    }
  }

  const manager = role === 'admin' || role === 'seller';
  return <section className="store-page">
    <h1>{manager ? 'Gestión de pedidos' : 'Mis pedidos'}</h1>
    {orders.length === 0 ? <p>Aún no hay pedidos.</p> : <div className="order-list">
      {orders.map(order => <article key={order._id} className="order-card">
        <div className="order-heading">
          <div>
            <strong>Pedido {order._id}</strong>
            {manager && <span>Cliente: {order.username}</span>}
          </div>
          <span>{statusLabels[order.status] || order.status}</span>
        </div>
        <ul>
          {order.items.map(item => <li key={item.productId}>{item.name} × {item.quantity} — {money(item.price * item.quantity)}</li>)}
        </ul>
        <strong>Total: {money(order.total)}</strong>
        <p>Creado: {new Date(order.createdAt).toLocaleString()}</p>
        {manager && order.status !== 'cancelled' && order.status !== 'completed' && <>
          <label>Actualizar estado
            <select value={order.status} onChange={event => changeStatus(order, event.target.value)}>
              {['pending', 'confirmed', 'shipped', 'completed', 'cancelled'].map(status =>
                <option key={status} value={status}>{statusLabels[status]}</option>)}
            </select>
          </label>
        </>}
      </article>)}
    </div>}
  </section>;
}
