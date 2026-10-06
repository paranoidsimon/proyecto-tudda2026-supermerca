import { useParams } from 'react-router-dom';
import { useState } from 'react';
import Form from '../components/Form';
import TextField from '../components/TextField';
import SecretField from '../components/SecretField';
import SelectField from '../components/SelectField';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import useUser from '../services/useUser';
import { useNavigate } from 'react-router-dom';

export default function User() {
  const { username } = useParams();
  const { getUser, updateUser, addUser } = useUser();
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: '',
    displayName: '',
    email: '',
    password: '',
    role: 'customer',
  });

  useEffect(() => {
    if (!username) {
      setData({
        username: '',
        displayName: '',
        email: '',
        password: '',
        role: 'customer',
      });
      return;
    }

    getUser(username)
      .then(userData => setData(userData))
      .catch(err => toast.error(err?.message || 'Error al cargar los datos del usuario'));
  // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  async function submitHandler(e) {
    e.preventDefault();

    try {
      if (!data.email.includes('@')) {
        toast.error('El correo electrónico no es válido');
        return;
      }
      if (username)
        await updateUser(username, data);
      else
        await addUser(data);

      toast.success(`Usuario ${username ? 'modificado' : 'agregado'} correctamente`);
      navigate('/users');
    } catch (error) {
      toast.error(error.message || 'No se pudo guardar el usuario');
    }
  }

  return <Form
    title={username ? `Modificando usuario: ${username}` : "Agregar usuario"}
    onSubmit={submitHandler}
    submitLabel={username ? "Modificar" : "Agregar"}
    onCancel={() => navigate('/users')}
  >
    <TextField
      label="Nombre de usuario:"
      value={data.username}
      onChange={newValue => setData(data => ({ ...data, username: newValue }))}
      required
      disabled={Boolean(username)}
    />
    <TextField
      label="Nombre completo:"
      value={data.displayName}
      onChange={newValue => setData(data => ({ ...data, displayName: newValue }))}
      required
    />
    <TextField
      label="Correo electrónico:"
      value={data.email}
      onChange={newValue => setData(data => ({ ...data, email: newValue }))}
      required
    />
    <SecretField
      label="Contraseña:"
      value={data.password}
      onChange={newValue => setData(data => ({ ...data, password: newValue }))}
      required={!username}
    />
    <SelectField
      label="Rol:"
      value={data.role}
      onChange={newValue => setData(data => ({ ...data, role: newValue }))}
      options={[
        { value: 'customer', label: 'Cliente' },
        { value: 'seller', label: 'Vendedor' },
        { value: 'admin', label: 'Administrador' },
      ]}
      required
    />
  </Form>;
}