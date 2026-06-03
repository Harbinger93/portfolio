import React, { useState, useRef } from "react"
import { createPortal } from "react-dom"
import flags from "react-phone-number-input/flags"
import { ChevronDown, Check, Search } from "lucide-react"
import { Input } from "./input"

interface CountrySelectOption {
  value?: string
  label: string
}

interface CustomCountrySelectProps {
  value?: string
  onChange: (value?: string) => void
  options: CountrySelectOption[]
  labels?: Record<string, string>
  disabled?: boolean
}

export function CustomCountrySelect({
  value,
  onChange,
  options,
  disabled,
}: CustomCountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const [search, setSearch] = useState("")
  const buttonRef = useRef<HTMLButtonElement>(null)

  const FlagIcon = value ? flags[value as keyof typeof flags] : null

  // Filter options based on search query (case-insensitive search on both name and country code)
  const filteredOptions = options.filter((opt) => {
    if (!opt.value) return false
    const name = opt.label.toLowerCase()
    const code = opt.value.toLowerCase()
    const query = search.toLowerCase()
    return name.includes(query) || code.includes(query)
  })

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      // Position dropdown below button relative to page document body
      setCoords({
        top: rect.bottom + window.scrollY + 8,
        left: Math.min(rect.left + window.scrollX, window.innerWidth - 300),
      })
    }
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={handleOpen}
        className="flex items-center gap-1.5 text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none"
        aria-label="Seleccionar país"
      >
        {FlagIcon ? (
          <FlagIcon className="w-5 h-3.5 object-cover rounded-[2px] shadow-sm shrink-0" />
        ) : (
          <span className="text-xs text-[var(--text-secondary)] font-medium">--</span>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 text-[var(--text-secondary)] transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && typeof document !== "undefined" && createPortal(
        <>
          {/* Click-outside backdrop overlay */}
          <div
            className="fixed inset-0 z-[9998] bg-transparent"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsOpen(false)
              setSearch("")
            }}
          />

          {/* Dropdown Card */}
          <div
            style={{
              position: "absolute",
              top: coords.top,
              left: coords.left,
            }}
            className="w-72 max-h-64 z-[9999] rounded-xl glass border border-[var(--glass-border)] bg-[var(--bg-secondary)] shadow-2xl p-2.5 flex flex-col overflow-hidden animate-[fadeIn_0.15s_ease]"
          >
            {/* Search input with search icon */}
            <div className="relative mb-2 shrink-0">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-secondary)] opacity-70" />
              <Input
                type="text"
                placeholder="Buscar país..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 pr-3 text-xs bg-white/[0.04] dark:bg-white/[0.04] border-[var(--glass-border)] focus-visible:ring-[var(--accent-primary)]/20"
              />
            </div>

            {/* Scrollable list */}
            <div className="overflow-y-auto flex-1 pr-1 space-y-0.5 select-none scrollbar-thin">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => {
                  const OptFlag = opt.value
                    ? flags[opt.value as keyof typeof flags]
                    : null
                  const isSelected = opt.value === value

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onChange(opt.value)
                        setIsOpen(false)
                        setSearch("")
                      }}
                      className={`flex items-center justify-between w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition-colors hover:bg-[var(--accent-primary)]/10 text-[var(--text-primary)] cursor-pointer ${
                        isSelected
                          ? "bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] font-semibold"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {OptFlag && (
                          <OptFlag className="w-4.5 h-3 object-cover rounded-[1px] shadow-sm shrink-0" />
                        )}
                        <span className="truncate">{opt.label}</span>
                      </div>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0" />
                      )}
                    </button>
                  )
                })
              ) : (
                <p className="text-center text-xs text-[var(--text-secondary)] py-4">
                  No se encontraron resultados
                </p>
              )}
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  )
}
