import { playTabClick } from '@/shared/lib/sounds'

interface TabItem {
  key: string
  label: string
  count?: number
}

interface TabsProps {
  value: string
  onChange: (key: string) => void
  items: TabItem[]
}

export function Tabs({ value, onChange, items }: TabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2" style={{ WebkitOverflowScrolling: 'touch' }}>
      {items.map((item) => (
        <button
          key={item.key}
          className={`tab-btn ${value === item.key ? 'active' : ''}`}
          onClick={() => {
            onChange(item.key)
            playTabClick()
          }}
        >
          {item.label}
          {item.count !== undefined && (
            <span style={{ opacity: 0.5 }}> {item.count}</span>
          )}
        </button>
      ))}
    </div>
  )
}
