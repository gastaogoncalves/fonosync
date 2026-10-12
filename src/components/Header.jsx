import { AudioWaveform } from 'lucide-react'

const links = [
    { label: 'Plataforma', href: '#plataforma' },
    { label: 'Soluções', href: '#solucoes' },
    { label: 'Jogos', href: '#jogos' },
    { label: 'Para Escolas', href: '#escolas' },
]

export default function Header() {
    return (
        <header className="sticky top-0 z-50 bg-white border-b border-line">
            <div className="mx-auto flex h-18 max-w-360 items-center justify-between px-18">
                <a href="#" className="flex items-center gap-2.5">
                    <span className="flex size-9 items-center justify-center rounded-md bg-primary text-white">
                        <AudioWaveform size={22} aria-hidden="true" /> {/* logo placeholder */}
                    </span>
                    <span className="font-serif text-2xl text-navy">FonoSync</span>
                </a>
                <nav aria-label="Principal" className="hidden md:flex items-center">
                    <ul className="flex gap-6">
                        {links.map((link) => (
                            <li key={link.href}>
                                <a href={link.href} className="text-ink hover:text-primary text-sm font-semibold">
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="min-h-11 rounded-md border border-primary bg-white px-4 text-sm text-navy hover:bg-mist"
                    >
                        Acessibilidade
                    </button>
                    <button
                        type="button"
                        className="hidden min-h-11 items-center rounded-md border border-transparent px-4 text-sm text-navy hover:bg-mist md:flex"
                    >
                        Ouvir página
                    </button>
                </div>
            </div>
        </header>
    )
}