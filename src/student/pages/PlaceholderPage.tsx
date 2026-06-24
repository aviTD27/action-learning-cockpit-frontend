interface Props {
  title: string
  subtitle: string
}

export default function PlaceholderPage({ title, subtitle }: Props) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60vh',
      gap: '0.5rem',
      color: '#9ca3af',
    }}>
      <p style={{ fontSize: '1rem', fontWeight: 700, color: '#1E3A5F', margin: 0 }}>{title}</p>
      <p style={{ fontSize: '0.875rem', margin: 0 }}>{subtitle}</p>
    </div>
  )
}
