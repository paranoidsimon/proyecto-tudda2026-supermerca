import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Form from '../components/Form';
import SecretField from '../components/SecretField';
import TextField from '../components/TextField';
import useUser from '../services/useUser';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useUser();
  const [disabled, setDisabled] = useState(false);
  const [data, setData] = useState({
    username: '',
    displayName: '',
    email: '',
    password: '',
  });

  async function submitHandler(event) {
    event.preventDefault();
    setDisabled(true);
    try {
      await register(data);
      toast.success('Cuenta creada. Ya puedes iniciar sesión.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'No se pudo crear la cuenta');
    } finally {
      setDisabled(false);
    }
  }

  return <Form
    title="Crear cuenta de cliente"
    onSubmit={submitHandler}
    submitLabel="Registrarme"
    onCancel={() => navigate('/')}
    disabled={disabled}
  >
    <TextField label="Nombre de usuario:" value={data.username} required disabled={disabled}
      onChange={value => setData(current => ({ ...current, username: value }))} />
    <TextField label="Nombre completo:" value={data.displayName} required disabled={disabled}
      onChange={value => setData(current => ({ ...current, displayName: value }))} />
    <TextField label="Correo electrónico:" value={data.email} required disabled={disabled}
      onChange={value => setData(current => ({ ...current, email: value }))} />
    <SecretField label="Contraseña (mínimo 8 caracteres):" value={data.password} required disabled={disabled}
      onChange={value => setData(current => ({ ...current, password: value }))} />
  </Form>;
}
