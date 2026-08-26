export default function Header({onClickMenu}) {
  return <header
    style={{
      backgroundColor: 'pink',
    }}
  >
    <img src="/menu.svg" alt="Menu" width={25} onClick={onClickMenu}/>
    Titulo de la pagina
  </header>;
}