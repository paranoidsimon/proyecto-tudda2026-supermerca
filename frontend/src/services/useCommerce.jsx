import useApi from './useApi';

export default function useCommerce() {
  const api = useApi();
  return {
    getProducts: (search = '') => api.getJson(`/products?search=${encodeURIComponent(search)}`),
    addProduct: data => api.postJson('/products', data),
    updateProduct: (id, data) => api.patchJson(`/products/${id}`, data),
    deleteProduct: id => api.deleteJson(`/products/${id}`),
    getCart: () => api.getJson('/cart'),
    addCartItem: id => api.postJson(`/cart/${id}`, {}),
    setCartItem: (id, quantity) => api.putJson(`/cart/${id}`, { quantity }),
    removeCartItem: id => api.deleteJson(`/cart/${id}`),
    checkout: () => api.postJson('/checkout', {}),
    getOrders: () => api.getJson('/orders'),
    updateOrderStatus: (id, status) => api.patchJson(`/orders/${id}/status`, { status }),
  };
}
