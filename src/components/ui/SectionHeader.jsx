export default function SectionHeader({ title, description }) {
  return (
    <div className="stellar-section-header">
      <h1 className="stellar-page-title">{title}</h1>
      {description && <p className="stellar-page-lead">{description}</p>}
    </div>
  )
}
