import { useState } from "react";
import Form from "../components/Form";
import TextField from "../components/TextField";
import SecretField from "../components/SecretField";
import SelectField from "../components/SelectField";


export default function User() {
  const [data, setData] = useState({
    username: "",
    displayName: "",
    email: "",
    password: "",
    role: "user",
  });

  function submitHandler(event) {
    event.preventDefault();
    console.log(data);
  }

  return <Form title="Agregar Usuario" onSubmit={submitHandler}>
    <TextField 
    label="Nombre de Usuario" 
    value={data.username}
    onChange={newValue => setData(data => ({...data, username: newValue}))}
      required
      />
    <TextField 
    label="Nombre completo:" 
    value={data.displayName}
    onChange={newValue => setData(data => ({...data, displayName: newValue}))}
      required
      />
    <TextField 
    label="Correo electronico:" 
    value={data.email}
    onChange={newValue => setData(data => ({...data, email: newValue}))}
      required
      />
    <SecretField 
    label="Contraseña:" 
    value={data.password}
    onChange={newValue => setData(data => ({...data, password: newValue}))}
      required
      />
      <SelectField 
    label="Rol:" 
    value={data.role}
    onChange={newValue => setData(data => ({...data, role: newValue}))}
    options={[
      {value: "admin", label: "Administrador"},
      {value: "user", label: "Usuario"},
    ]}
      required
      />
  </Form>
  }
