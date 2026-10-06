import { useState, useEffect } from 'react';
import useUser from '../services/useUser';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Users() {
  const navigate = useNavigate();
  const { getUsers, deleteUser } = useUser();
  const [list, setList] = useState([]);

  async function loadList() {
    try {
      const res = await getUsers();
      setList(res);
    } catch (error) {
      toast.error(error.message || 'No se pudieron cargar los usuarios');
    }
  }

  useEffect(() => {
    loadList();
  // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const eliminarUsuario = async (username) => {
    const result = await Swal.fire({
      title: 'Confirmar la eliminación del usuario',
      text: 'Esta acción elimina el usuario y no se podrá revertir.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(username);
        await loadList();
        toast.success('Usuario eliminado correctamente');
      } catch (error) {
        toast.error(error.message || 'No se pudo eliminar el usuario');
      }
    }
  };

  return <div>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <h4>
        Usuarios
      </h4>

      <div>
        <button
          onClick={() => navigate('/users/new')}
        >
          Agregar
        </button>

        <button
          onClick={() => loadList()}
        >
          Actualizar
        </button>
      </div>
    </div>

    <table
      className="data-table"
    >
      <thead>
        <tr>
          <th>Nombre de usuario</th>
          <th>Nombre completo</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {
          list.map(row => <tr key={row.username}>
            <td>{row.username}</td>
            <td>{row.displayName}</td>
            <td>{row.email}</td>
            <td>{row.role}</td>
            <td>
              <button
                onClick={() => eliminarUsuario(row.username)}
              >
                Eliminar
              </button>
              <button
                onClick={() => navigate(`/users/${row.username}/edit`)}
              >
                Modificar
              </button>
            </td>
          </tr>)
        }
      </tbody>
    </table>

    {/*<pre>
      {JSON.stringify(list, null, 2)}
    </pre>*/}

  </div>;
}