/** Native tooltip — simple explanations on hover */
export function HelpTip({ text, label = '?' }) {
  return (
    <abbr
      className="stellar-help-tip"
      title={text}
      style={{ cursor: 'help', textDecoration: 'none' }}
    >
      {label}
    </abbr>
  )
}
