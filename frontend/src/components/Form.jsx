export default function Form({
  title,
  children,
  onSubmit,
  submitLabel = "Enviar",
  onCancel,
  cancelLabel = "Cancelar",
  disabled = false
}) {
  return <form
    className="standard-form"
    onSubmit={onSubmit}
  >
    {title && <h3>{title}</h3>}
    {children}

    <div
      className="form-buttons"
    >
      {onCancel && <input
        type="button"
        value={cancelLabel}
        onClick={onCancel}
        disabled={disabled}
      />}
      <input
        type="submit"
        value={submitLabel}
        disabled={disabled}
      />
    </div>
  </form>;
}