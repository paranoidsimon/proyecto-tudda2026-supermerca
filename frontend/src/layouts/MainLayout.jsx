import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Menu from '../components/Menu';
import { toast } from 'react-toastify';

export default function MainLayout({
  children,
}) {
  const [menuVisible, setMenuVisible] = useState(true);

  useEffect(() => {
    toast.success('Aplicación iniciada correctamente.');
  }, []);

  return <div className="app-shell">
    <Header
      onClickMenu={() => setMenuVisible(!menuVisible)}
      menuVisible={menuVisible}
    />
    
    <div className="app-body">
      <Menu
        visible={menuVisible}
      />

      <main className="app-main">
        {children}
      </main>
    </div>

    <Footer />
  </div>;
}