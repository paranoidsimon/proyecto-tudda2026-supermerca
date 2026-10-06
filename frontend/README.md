# Supermerca - frontend

Interfaz React/Vite conectada al backend Express a través del contexto `ApiProvider` (`src/services/useApi.jsx`).

## Desarrollo

1. Inicia MongoDB y configura/inicia el backend según `../backend/readme.md`.
2. Desde `frontend`, instala dependencias con `npm install`.
3. Ejecuta `npm run dev`; la API apunta a `http://localhost:3000/api`.
4. Verifica cambios con `npm run lint` y `npm run build`.

## Recorridos por rol

- Público: explorar y buscar en el catálogo, crear una cuenta de cliente e iniciar sesión.
- Cliente: agregar o quitar productos del carrito, confirmar pedidos sin pago en línea y consultar sus pedidos.
- Vendedor: gestionar productos e inventario y actualizar el estado de los pedidos.
- Administrador: administrar usuarios y asignar los roles `admin`, `seller` o `customer`; también puede gestionar productos y pedidos.

Los permisos efectivos se validan en el backend; ocultar o mostrar enlaces en esta interfaz es solo una ayuda de navegación.
