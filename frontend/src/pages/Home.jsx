import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useCommerce from '../services/useCommerce';
import useGlobal from '../services/useGlobal';

const money = value => new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
}).format(value);

export default function Home() {
  const { getProducts, addCartItem } = useCommerce();
  const { role } = useGlobal();
  const canManageProducts = role === 'admin' || role === 'seller';
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadProducts(term = '') {
    setLoading(true);
    try {
      setProducts(await getProducts(term));
    } catch (error) {
      toast.error(error.message || 'No se pudo cargar el catálogo');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addToCart(product) {
    if (role !== 'customer') {
      toast.info('Inicia sesión o crea una cuenta de cliente para comprar.');
      return;
    }
    try {
      await addCartItem(product._id);
      toast.success(`${product.name} se agregó al carrito`);
    } catch (error) {
      toast.error(error.message || 'No se pudo agregar el producto');
    }
  }

  return <section className="store-page">
    <h1>Tienda</h1>
    <p>Busca productos y arma tu pedido.</p>
    <form className="search-form" onSubmit={event => {
      event.preventDefault();
      loadProducts(search);
    }}>
      <input
        aria-label="Buscar productos"
        placeholder="Buscar productos..."
        value={search}
        onChange={event => setSearch(event.target.value)}
      />
      <button type="submit">Buscar</button>
    </form>
    {loading ? <p>Cargando productos...</p> : products.length === 0
      ? <p>No hay productos disponibles.</p>
      : <div className="product-grid">
        {products.map(product => <article className="product-card" key={product._id}>
          {product.imageUrl && <img src={product.imageUrl} alt={product.name} />}
          <div className="product-card-content">
            <small>{product.category}</small>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <strong>{money(product.price)}</strong>
            <p>Disponibles: {product.stock}</p>
            {role === 'customer'
              ? <button disabled={product.stock < 1} onClick={() => addToCart(product)}>Agregar al carrito</button>
              : canManageProducts
                ? <Link to="/products/manage">Gestionar productos</Link>
                : <Link to="/login">Inicia sesión para comprar</Link>}
          </div>
        </article>)}
      </div>}
  </section>;
}
