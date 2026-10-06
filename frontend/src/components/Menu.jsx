import MenuItem from './MenuItem';
import useGlobal from '../services/useGlobal';
import useApi from '../services/useApi';

export default function Menu({
  visible = true
}) {
  const { role, username, clearSession } = useGlobal();
  const { setAuthorization } = useApi();
  const isAdmin = role === 'admin';
  const canManageStore = isAdmin || role === 'seller';

  function logout() {
    localStorage.removeItem('session');
    setAuthorization('');
    clearSession();
    window.location.href = '/';
  }

  return <nav
    className="app-menu"
    style={{ display: visible ? undefined : 'none' }}
    aria-label="Navegación principal"
  >
    <div className="menu-links">
      <MenuItem to="/">Inicio</MenuItem>
      {!username && <MenuItem to="/login">Iniciar sesión</MenuItem>}
      {!username && <MenuItem to="/register">Crear cuenta</MenuItem>}
      {isAdmin && <MenuItem to="/users">Usuarios</MenuItem>}
      {canManageStore && <MenuItem to="/products/manage">Gestionar productos</MenuItem>}
      {username && <MenuItem to="/orders">Pedidos</MenuItem>}
      {role === 'customer' && <MenuItem to="/cart">Carrito</MenuItem>}
      {username && <MenuItem onClick={logout}>Cerrar sesión</MenuItem>}
      <MenuItem to="/about">Acerca de</MenuItem>
    </div>
  </nav>;
}