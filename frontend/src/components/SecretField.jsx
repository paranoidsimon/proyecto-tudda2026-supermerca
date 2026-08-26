import Field from './Field';
export default function SecretField({label = 'Contraseña', value, onChange, required = false}) {
  return <Field label={label}>
    <input 
    type="password"  
    value={value} 
    required={required}
    onChange={(e) => onChange?.(e.target.value)}/>
  </Field>;
}