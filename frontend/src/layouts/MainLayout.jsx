import Header from '../components/Header';
import Footer from '../components/Footer';
import Menu from '../components/Menu';

export default function MainLayout({
  children,
}) {
  return <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}
  >
    <Header />
    
    <div
      className="body"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <Menu />

      <main
        style={{
          flex: 1,
          backgroundColor: 'lightgreen',
        }}
      >
        {children}
      </main>
    </div>

    <Footer />
  </div>;
}