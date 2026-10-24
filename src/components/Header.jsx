import { AudioWaveform } from 'lucide-react'
import A11yActions from './A11yActions'

const links = [
    { label: 'Plataforma', href: '#plataforma' },
    { label: 'Soluções', href: '#solucoes' },
    { label: 'Jogos', href: '#jogos' },
    { label: 'Para Escolas', href: '#escolas' },
]

export default function Header() {
    return (
        <header className="sticky top-0 z-50 bg-surface border-b border-line">
            <div className="mx-auto flex h-18 max-w-360 items-center justify-between px-18">
                <a href="#" className="flex items-center gap-2.5">
                    <span className="flex size-9 items-center justify-center rounded-md bg-primary text-on-primary">
                        <AudioWaveform size={22} aria-hidden="true" /> {/* logo placeholder */}
                    </span>
                    <span className="font-serif text-2xl text-navy">FonoSync</span>
                </a>
                <nav aria-label="Principal" className="hidden md:flex items-center">
                    <ul className="flex gap-6">
                        {links.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    className="text-ink text-sm font-semibold underline-offset-4 decoration-2 hover:text-primary hover:underline"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <A11yActions />
            </div>
        </header>
    )
}
