// Arrow-D monogram — crisp single-weight vector (currentColor)
export default function LogoMark({ className = '', style }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M25 20 L45 20 L75 50 L45 80 L25 80 Z" />
    </svg>
  )
}

export function Wordmark({ className = '' }) {
  return (
    <span className={`font-display font-semibold tracking-tight text-ink ${className}`}>
      Delvox Labs
    </span>
  )
}
