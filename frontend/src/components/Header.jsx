import useGlobal from '../services/useGlobal';
import { Link } from 'react-router-dom';

export default function Header({
  onClickMenu,
  menuVisible
}) {
  const { username } = useGlobal();

  return <header className="app-header">
    <button
      className="menu-toggle"
      type="button"
      aria-label="Alternar menú"
      aria-expanded={menuVisible}
      onClick={onClickMenu}
    >
      <span aria-hidden="true">☰</span>
    </button>
    <Link className="brand" to="/" aria-label="Supermerca, inicio">
      <span className="brand-mark" aria-hidden="true">C</span>
      <span className="brand-name">compra</span>
    </Link>
    <div className="header-account">
      {username && <>Bienvenido, <strong>{username}</strong></>}
    </div>
  </header>;
}