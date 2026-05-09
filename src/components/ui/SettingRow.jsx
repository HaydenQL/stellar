export default function SettingRow({ icon: Icon, title, description, children }) {
  return (
    <div className="stellar-settings-row">
      {Icon && (
        <div className="settings-row-icon">
          <Icon width={18} height={18} />
        </div>
      )}
      <div className="stellar-settings-row-body">
        <div className="stellar-settings-row-label">{title}</div>
        {description && <div className="stellar-field-help">{description}</div>}
      </div>
      {children}
    </div>
  )
}
