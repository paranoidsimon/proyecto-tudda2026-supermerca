import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '../components/Form';
import TextField from '../components/TextField';
import SecretField from '../components/SecretField';

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({username: '', password: ''});

function submitHandler(e) {
  e.preventDefault();
  console.log(data);
}
function cancelHandler(e) {
  navigate('/');
}

  return <Form
    title="Login"
    onSubmit={submitHandler}
    submitLabel="Iniciar sesión"
    onCancel={cancelHandler}
    >
      <TextField 
      label="Usuario"
      value={data.username} 
      onChange={newValue => setData(data => ({...data, username: newValue}))}
      required
      />

      <SecretField 
      label="Contraseña"
      value={data.password} 
      onChange={newValue => setData(data => ({...data, password: newValue}))}
      required
      />
    </Form>
  

}