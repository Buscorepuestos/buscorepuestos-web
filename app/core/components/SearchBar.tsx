'use client'
import {
    ChangeEvent,
    KeyboardEvent,
    useRef,
    useEffect,
    useState,
    useCallback,
    useMemo,
} from 'react'
import { createPortal } from 'react-dom'
import { useAutocomplete } from '../../hooks/useAutocomplete'

// ── Tipos ─────────────────────────────────────────────────────────────────────

interface SearchBarProps {
    inputId?: string
    analyticsLocation?: string
    analyticsEventName?: string
    googleAdsConversionSendTo?: string
    value: string
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
    onClear?: () => void
    isLoading?: boolean
    height?: string
    width?: string
    borderColor?: string
    borderWidth?: string
    onEnterPress?: () => void
    onSuggestionSelect?: (suggestion: string) => void
}

// Elemento plano para la navegación por teclado
interface FlatSuggestion {
    label: string
    sublabel: string
    type: 'part' | 'category' | 'brand' | 'reference' | 'recent'
    count?: number
}

// ── Helper: resalta la parte del texto que coincide con la query ──────────────

function Highlight({ text, query }: { text: string; query: string }) {
    if (!query || !text) return <>{text}</>
    const idx = text.toLowerCase().indexOf(query.toLowerCase())
    if (idx === -1) return <>{text}</>
    return (
        <>
            {text.slice(0, idx)}
            <span style={{ color: '#12B1BB', fontWeight: 600 }}>
                {text.slice(idx, idx + query.length)}
            </span>
            {text.slice(idx + query.length)}
        </>
    )
}

// ── Helper: detección de referencia técnica ───────────────────────────────────

function isReferenceSearch(term: string): boolean {
    if (!term || term.trim().length < 6) return false
    const t = term.trim()
    const onlyNumbers = /^\d{6,}$/
    const specificPattern = /^[A-Za-z0-9]+[\-\.][A-Za-z0-9]+/
    const mixedPattern = /^[A-Za-z0-9\-\.]+$/
    const hasNumbers = /\d/
    const hasLetters = /[A-Za-z]/
    if (onlyNumbers.test(t)) return true
    if (specificPattern.test(t)) return true
    if (
        mixedPattern.test(t) &&
        hasNumbers.test(t) &&
        hasLetters.test(t) &&
        (t.match(/\d/g) || []).length / t.length >= 0.3
    ) return true
    return false
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function SearchBar(props: SearchBarProps) {
    const {
        results,
        isOpen,
        closeDropdown,
        openDropdown,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
    } = useAutocomplete(props.value)

    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const hasTrackedInteraction = useRef(false)
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 })
    const [mounted, setMounted] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)

    useEffect(() => { setMounted(true) }, [])

    const trackSearchInteraction = useCallback(() => {
        if (!props.analyticsEventName || hasTrackedInteraction.current) return
        hasTrackedInteraction.current = true

        if (typeof window === 'undefined') return

        const eventPayload = {
            event: props.analyticsEventName,
            search_bar_location: props.analyticsLocation ?? 'unknown',
        }

        const win = window as typeof window & {
            dataLayer?: Array<Record<string, unknown>>
            gtag?: (...args: unknown[]) => void
        }

        win.dataLayer = win.dataLayer || []
        win.dataLayer.push(eventPayload)
        win.gtag?.('event', props.analyticsEventName, {
            event_category: 'engagement',
            event_label: props.analyticsLocation ?? 'unknown',
        })

        if (props.googleAdsConversionSendTo) {
            win.gtag?.('event', 'conversion', {
                send_to: props.googleAdsConversionSendTo,
            })
        }
    }, [props.analyticsEventName, props.analyticsLocation, props.googleAdsConversionSendTo])

    // Resetear selección cuando cambian los resultados
    useEffect(() => { setActiveIndex(-1) }, [results, isOpen])

    // ── Click fuera → cerrar ──────────────────────────────────────────────────
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                closeDropdown()
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [closeDropdown])

    // ── Calcular y actualizar posición del dropdown (sigue al input en scroll) ─
    useEffect(() => {
        const updatePosition = () => {
            if (!inputRef.current) return
            const rect = inputRef.current.getBoundingClientRect()
            if (rect.bottom < 0 || rect.top > window.innerHeight) {
                closeDropdown()
                return
            }
            setDropdownPos({ top: rect.bottom + 8, left: rect.left, width: rect.width })
        }

        const shouldShow = isOpen || (isFocused && recentSearches.length > 0)
        if (!shouldShow) return

        updatePosition()
        window.addEventListener('scroll', updatePosition, true)
        window.addEventListener('resize', updatePosition)
        return () => {
            window.removeEventListener('scroll', updatePosition, true)
            window.removeEventListener('resize', updatePosition)
        }
    }, [isOpen, isFocused, recentSearches.length, closeDropdown])

    // ── Lista plana para navegación por teclado ───────────────────────────────
    const flatList = useMemo<FlatSuggestion[]>(() => {
        if (!isOpen) {
            // Cuando no hay resultados pero el input está enfocado → mostrar recientes
            if (isFocused && recentSearches.length > 0 && !props.value.trim()) {
                return recentSearches.map(s => ({
                    label: s, sublabel: '', type: 'recent' as const,
                }))
            }
            return []
        }
        const parts: FlatSuggestion[] = results.parts.map(p => ({
            label: p.title,
            sublabel: [p.subcategory, p.brand].filter(Boolean).join(' · '),
            type: 'part' as const,
            count: p.count,
        }))
        const categories: FlatSuggestion[] = results.categories.map(c => ({
            label: c.name,
            sublabel: `${c.count} piezas`,
            type: 'category' as const,
            count: c.count,
        }))
        const brands: FlatSuggestion[] = results.brands.map(b => ({
            label: `${props.value.trim()} ${b.name}`.trim(),
            sublabel: `${b.count} productos`,
            type: 'brand' as const,
            count: b.count,
        }))
        const refs: FlatSuggestion[] = results.references.map(r => ({
            label: r,
            sublabel: 'Referencia técnica',
            type: 'reference' as const,
        }))
        return [...parts, ...categories, ...brands, ...refs]
    }, [isOpen, results, isFocused, recentSearches, props.value])

    // ── Selección de sugerencia ───────────────────────────────────────────────
    const { onSuggestionSelect } = props
    const selectSuggestion = useCallback((label: string) => {
        addRecentSearch(label)
        onSuggestionSelect?.(label)
        closeDropdown()
    }, [addRecentSearch, onSuggestionSelect, closeDropdown])

    // ── Navegación teclado ────────────────────────────────────────────────────
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActiveIndex(i => Math.min(i + 1, flatList.length - 1))
            return
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActiveIndex(i => Math.max(i - 1, -1))
            return
        }
        if (e.key === 'Enter') {
            if (activeIndex >= 0 && flatList[activeIndex]) {
                selectSuggestion(flatList[activeIndex].label)
            } else {
                addRecentSearch(props.value)
                closeDropdown()
                props.onEnterPress?.()
            }
            return
        }
        if (e.key === 'Escape') {
            closeDropdown()
        }
    }

    // ── UI helpers ────────────────────────────────────────────────────────────
    const getBorderColor = () => {
        if (props.value && isReferenceSearch(props.value)) return '#10B981'
        return props.borderColor ?? '#12B1BB'
    }

    const getPlaceholder = () => {
        if (!props.value) return 'Busca piezas, referencias, marcas...'
        if (isReferenceSearch(props.value)) return 'Referencia técnica detectada'
        return 'Escribe lo que necesitas'
    }

    // ¿Mostrar el panel de recientes? (input vacío, enfocado, hay recientes)
    const showRecents = isFocused && !props.value.trim() && recentSearches.length > 0

    // ¿Mostrar el dropdown de resultados?
    const showResults = mounted && isOpen && flatList.length > 0

    // Índice de inicio de cada grupo dentro del flatList (solo cuando hay resultados)
    const partsEnd = results.parts.length
    const categoriesEnd = partsEnd + results.categories.length
    const brandsEnd = categoriesEnd + results.brands.length

    return (
        <div
            ref={containerRef}
            className={`${props.width} relative flex items-center bg-custom-white rounded-[34px] self-center transition-all duration-200`}
            style={{
                height: props.height,
                borderColor: getBorderColor(),
                borderWidth: props.borderWidth,
                borderStyle: 'solid',
                boxShadow: props.value && isReferenceSearch(props.value)
                    ? '0 0 0 1px rgba(16, 185, 129, 0.2)'
                    : 'none',
            }}
        >
            {/* ── Input ──────────────────────────────────────────────────── */}
            <input
                id={props.inputId}
                data-analytics-location={props.analyticsLocation}
                ref={inputRef}
                className="text-title-4 flex-grow bg-transparent outline-none font-semibold pl-6 pr-14 rounded-[34px]"
                type="text"
                placeholder={getPlaceholder()}
                style={{ color: '#A9A9A9' }}
                value={props.value}
                onChange={props.onChange}
                onKeyDown={handleKeyDown}
                disabled={props.isLoading}
                onFocus={() => {
                    trackSearchInteraction()
                    setIsFocused(true)
                    openDropdown()
                }}
                onClick={trackSearchInteraction}
                onBlur={() => setTimeout(() => setIsFocused(false), 150)}
                autoComplete="off"
            />

            {/* ── Indicador REF ───────────────────────────────────────────── */}
            {props.value && !props.isLoading && isReferenceSearch(props.value) && (
                <div className="absolute right-14 flex items-center pointer-events-none">
                    <span className="text-xs text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full whitespace-nowrap">
                        REF
                    </span>
                </div>
            )}

            {/* ── Botón buscar / limpiar ──────────────────────────────────── */}
            <div className="absolute right-5 flex items-center justify-center w-10 h-10">
                {props.isLoading ? (
                    <div className="w-6 h-6 border-4 border-primary-blue border-t-transparent border-solid rounded-full animate-spin" />
                ) : props.value ? (
                    <button
                        onClick={props.onClear}
                        className="group flex items-center justify-center w-full h-full focus:outline-none"
                        aria-label="Limpiar búsqueda"
                        type="button"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                            className="text-[#A9A9A9] transition-colors duration-200 group-hover:text-red-400">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                ) : (
                    <button
                        onClick={props.onEnterPress}
                        className="group flex items-center justify-center w-full h-full focus:outline-none"
                        aria-label="Buscar"
                        type="button"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                            className="text-[#A9A9A9] transition-colors duration-200 group-hover:text-primary-blue">
                            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.134 17 3 13.866 3 10C3 6.134 6.134 3 10 3C13.866 3 17 6.134 17 10Z"
                                stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                )}
            </div>

            {/* ══════════════════════════════════════════════════════════════
                PORTAL — dropdown flotante (resultados O recientes)
            ══════════════════════════════════════════════════════════════ */}
            {mounted && (showResults || showRecents) && createPortal(
                <div
                    style={{
                        position: 'fixed',
                        top: dropdownPos.top,
                        left: dropdownPos.left,
                        width: dropdownPos.width,
                        zIndex: 99999,
                    }}
                    className="bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* ── Panel de búsquedas recientes ─────────────────── */}
                    {showRecents && !showResults && (
                        <>
                            <div className="flex items-center justify-between px-4 pt-3 pb-1">
                                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                    Búsquedas recientes
                                </span>
                                <button
                                    onMouseDown={(e) => { e.preventDefault(); clearRecentSearches() }}
                                    className="text-[10px] text-gray-400 hover:text-red-400 transition-colors"
                                >
                                    Borrar
                                </button>
                            </div>
                            {recentSearches.map((term, i) => (
                                <div
                                    key={term}
                                    onMouseDown={() => selectSuggestion(term)}
                                    className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${activeIndex === i ? 'bg-blue-50' : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                                        className="text-gray-300 shrink-0">
                                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            stroke="currentColor" strokeWidth="2"
                                            strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="text-sm text-gray-600">{term}</span>
                                </div>
                            ))}
                        </>
                    )}

                    {/* ── Panel de resultados agrupados ────────────────── */}
                    {showResults && (
                        <>
                            {/* Grupo: Piezas */}
                            {results.parts.length > 0 && (
                                <>
                                    <SectionHeader label="Piezas" />
                                    {results.parts.map((part, i) => (
                                        <SuggestionRow
                                            key={`part-${i}`}
                                            icon={<PartIcon />}
                                            iconBg="bg-blue-50"
                                            label={<Highlight text={part.title} query={props.value} />}
                                            sublabel={[part.subcategory, part.brand].filter(Boolean).join(' · ')}
                                            badge={part.count > 1 ? `${part.count} disponibles` : '1 disponible'}
                                            isActive={activeIndex === i}
                                            onSelect={() => selectSuggestion(part.title)}
                                        />
                                    ))}
                                    <SeeMoreLink
                                        label={`Ver ${results.categories[0]?.count ?? ''} resultados en ${results.parts[0]?.subcategory ?? 'esta categoría'} →`}
                                        query={props.value}
                                        onSelect={selectSuggestion}
                                        onSearch={props.onEnterPress}
                                    />
                                    <Divider />
                                </>
                            )}

                            {/* Grupo: Categorías */}
                            {results.categories.length > 0 && (
                                <>
                                    <SectionHeader label="Categorías" />
                                    {results.categories.map((cat, i) => (
                                        <SuggestionRow
                                            key={`cat-${i}`}
                                            icon={<CategoryIcon />}
                                            iconBg="bg-gray-100"
                                            label={<Highlight text={cat.name} query={props.value} />}
                                            sublabel={`${cat.count} piezas disponibles`}
                                            isActive={activeIndex === partsEnd + i}
                                            onSelect={() => selectSuggestion(cat.name)}
                                        />
                                    ))}
                                    <Divider />
                                </>
                            )}

                            {/* Grupo: Marcas */}
                            {results.brands.length > 0 && (
                                <>
                                    <SectionHeader label="Marcas" />
                                    <div className="flex flex-wrap gap-2 px-3 py-2">
                                        {results.brands.map((brand, i) => (
                                            <button
                                                key={`brand-${i}`}
                                                onMouseDown={() => {
                                                    // Combina la query actual con la marca:
                                                    // "faro derecho" + "Renault" → "faro derecho Renault"
                                                    const combined = `${props.value.trim()} ${brand.name}`.trim()
                                                    selectSuggestion(combined)
                                                }}
                                                className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${activeIndex === categoriesEnd + i
                                                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                                                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                                                    }`}
                                            >
                                                <Highlight text={brand.name} query={props.value} />
                                                <span className="text-gray-400 ml-1">· {brand.count}</span>
                                            </button>
                                        ))}
                                    </div>
                                    {results.references.length > 0 && <Divider />}
                                </>
                            )}

                            {/* Grupo: Referencias técnicas */}
                            {results.references.length > 0 && (
                                <>
                                    <SectionHeader label="Referencias técnicas" />
                                    {results.references.map((ref, i) => (
                                        <SuggestionRow
                                            key={`ref-${i}`}
                                            icon={<RefIcon />}
                                            iconBg="bg-green-50"
                                            label={<Highlight text={ref} query={props.value} />}
                                            sublabel="Referencia técnica"
                                            isActive={activeIndex === brandsEnd + i}
                                            onSelect={() => selectSuggestion(ref)}
                                        />
                                    ))}
                                </>
                            )}

                            {/* Footer con atajos */}
                            <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 bg-gray-50">
                                <span className="text-[10px] text-gray-400">
                                    <kbd className="bg-white border border-gray-200 rounded px-1 text-[9px] font-mono">↑↓</kbd>{' '}
                                    navegar &nbsp;
                                    <kbd className="bg-white border border-gray-200 rounded px-1 text-[9px] font-mono">↵</kbd>{' '}
                                    seleccionar &nbsp;
                                    <kbd className="bg-white border border-gray-200 rounded px-1 text-[9px] font-mono">Esc</kbd>{' '}
                                    cerrar
                                </span>
                                <span className="text-[10px] text-gray-400">España · en stock</span>
                            </div>
                        </>
                    )}
                </div>,
                document.body
            )}
        </div>
    )
}

// ── Sub-componentes del dropdown ──────────────────────────────────────────────

function SectionHeader({ label }: { label: string }) {
    return (
        <div className="px-4 pt-3 pb-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                {label}
            </span>
        </div>
    )
}

function Divider() {
    return <div className="border-t border-gray-100 my-1" />
}

interface SuggestionRowProps {
    icon: React.ReactNode
    iconBg: string
    label: React.ReactNode
    sublabel: string
    badge?: string
    isActive: boolean
    onSelect: () => void
}

function SuggestionRow({ icon, iconBg, label, sublabel, badge, isActive, onSelect }: SuggestionRowProps) {
    return (
        <div
            onMouseDown={onSelect}
            className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${isActive ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
        >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-800 truncate font-medium">{label}</div>
                {sublabel && (
                    <div className="text-xs text-gray-400 truncate">{sublabel}</div>
                )}
            </div>
            {badge && (
                <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">{badge}</span>
            )}
        </div>
    )
}

function SeeMoreLink({ label, query, onSelect, onSearch }: { label: string; query: string; onSelect: (s: string) => void; onSearch?: () => void }) {
    return (
        <div
            onMouseDown={() => { onSelect(query); onSearch?.() }}
            className="px-4 py-1.5 text-[11px] text-[#12B1BB] cursor-pointer hover:text-[#0e9aa3] transition-colors"
        >
            {label}
        </div>
    )
}

// ── Iconos inline ─────────────────────────────────────────────────────────────

function PartIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-blue-400">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.134 17 3 13.866 3 10C3 6.134 6.134 3 10 3C13.866 3 17 6.134 17 10Z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function CategoryIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-gray-400">
            <path d="M4 6h16M4 10h16M4 14h16M4 18h16"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )
}

function RefIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-green-500">
            <path d="M7 7h10M7 12h6M7 17h4M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )
}
