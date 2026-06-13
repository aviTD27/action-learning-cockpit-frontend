const LABELS: Record<string, string> = {
  NOT_STARTED: 'Not started',
  ONGOING: 'Ongoing',
  COMPLETED: 'Completed',
  GRADUATED: 'Graduated',
  ARCHIVED: 'Archived',
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  PAYMENT_PENDING: 'Payment pending',
  PROBATION: 'Probation',
  SUSPENDED: 'Suspended',
  EXPELLED: 'Expelled',
  DROPPED_OUT: 'Dropped out',
}

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`ua-badge ua-badge-${status.toLowerCase()}`}>
      <span className="ua-badge-dot" />
      {LABELS[status] ?? status}
    </span>
  )
}
