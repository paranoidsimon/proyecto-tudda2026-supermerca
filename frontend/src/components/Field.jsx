export default function Field ({label, children, required = false}) {
    return <div>
        <label>
            {required && <span style={{color: 'red'}} title="este dato es obligatorio">*</span>}
            {label}
            
        </label>
        {children}
    </div>;
}