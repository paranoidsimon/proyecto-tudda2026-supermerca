import { useLocation } from 'react-router-dom';
import MenuItem from './MenuItem';

export default function Menu({visible = true}) {
  const location = useLocation();

  console.log(location.pathname);

  return <nav
    style={{
      backgroundColor: 'lightblue',
      display: visible ? '' : 'none',
    }}
  >
    <MenuItem to="/">Inicio</MenuItem>
    <MenuItem to="/login">Login</MenuItem>
    <MenuItem to="/about">Acerca de</MenuItem>
    <MenuItem to="/otra" >Otra cosa</MenuItem>
  </nav>;
}