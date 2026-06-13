import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import '../../styles/uniAdmin.css'

export interface MultiSelectOption {
  id: number
  label: string
}

interface Props {
  options: MultiSelectOption[]
  selected: number[]
  onChange: (ids: number[]) => void
  placeholder?: string
}

export default function MultiSelect({ options, selected, onChange, placeholder = 'Select…' }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const toggle = (id: number) => {
    onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id])
  }

  const selectedLabels = options
    .filter(o => selected.includes(o.id))
    .map(o => o.label)

  return (
    <div className="ua-multiselect" ref={ref}>
      <button
        type="button"
        className="ua-modal-input ua-multiselect-trigger"
        onClick={() => setOpen(o => !o)}
      >
        <span className={selectedLabels.length ? '' : 'ua-multiselect-placeholder'}>
          {selectedLabels.length ? selectedLabels.join(', ') : placeholder}
        </span>
        <ChevronDown size={14} className={open ? 'ua-multiselect-chevron open' : 'ua-multiselect-chevron'} />
      </button>

      {open && (
        <div className="ua-multiselect-panel">
          {options.length === 0 ? (
            <p className="ua-checkbox-empty">No options available.</p>
          ) : (
            options.map(o => (
              <label key={o.id} className="ua-checkbox-row">
                <input
                  type="checkbox"
                  checked={selected.includes(o.id)}
                  onChange={() => toggle(o.id)}
                />
                {o.label}
              </label>
            ))
          )}
        </div>
      )}
    </div>
  )
}
