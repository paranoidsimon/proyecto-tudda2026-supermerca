import Field from './Field';
export default function TextField({label = 'Usuario', value, onChange, required = false}) {
  return <Field 
  label={label}
  >
    <input 
    type="text"  
    value={value} 
    required={required}
    onChange={(e) => onChange?.(e.target.value)}/>
  </Field>;
}