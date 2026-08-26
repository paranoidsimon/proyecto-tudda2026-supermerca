import Field from './Field';
export default function SelectField({label, value, onChange, options = []}) {

    return <Field label={label}>
        <select
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
        >
            <option disabled>-Seleccione una opcion-</option>
            <option></option>
            {options.map(option => <option 
            key={option.value} 
            value={option.value}>{option.label}
            </option>
            )}
        </select>
        </Field>

}