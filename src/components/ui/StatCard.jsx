export default function StatCard({ icon: Icon, value, label, sublabel }) {
  return (
    <div className="stellar-stat-card">
      {Icon && <Icon className="stellar-stat-icon" width={20} height={20} />}
      <div className="stellar-stat-value">{value}</div>
      <div className="stellar-stat-label">{label}</div>
      {sublabel && <div className="stellar-stat-sublabel">{sublabel}</div>}
    </div>
  )
}
