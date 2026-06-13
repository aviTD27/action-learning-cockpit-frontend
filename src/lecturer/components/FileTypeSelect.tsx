import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import '../styles/lecturer.css'

const FILE_TYPES = [
  '.pdf', '.zip', '.docx', '.pptx', '.xlsx',
  '.csv', '.txt', '.py', '.java', '.ipynb',
  '.png', '.jpg', '.mp4',
]

interface Props {
  value: string
  onChange: (value: string) => void
}

function parse(value: string): string[] {
  return value.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
}

export default function FileTypeSelect({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = parse(value)

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const toggle = (type: string) => {
    const next = selected.includes(type)
      ? selected.filter(s => s !== type)
      : [...selected, type]
    onChange(next.join(', '))
  }

  return (
    <div className="ua-multiselect" ref={ref}>
      <button
        type="button"
        className="ua-modal-input ua-multiselect-trigger"
        onClick={() => setOpen(o => !o)}
      >
        <span className={selected.length ? '' : 'ua-multiselect-placeholder'}>
          {selected.length ? selected.join(', ') : 'Any file type'}
        </span>
        <ChevronDown size={14} className={open ? 'ua-multiselect-chevron open' : 'ua-multiselect-chevron'} />
      </button>

      {open && (
        <div className="ua-multiselect-panel">
          {FILE_TYPES.map(type => (
            <label key={type} className="ua-checkbox-row">
              <input
                type="checkbox"
                checked={selected.includes(type)}
                onChange={() => toggle(type)}
              />
              {type}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
