import React from 'react'

/** Logo auténtico OXXO con barra roja y letras amarillas */
export const OxxoLogo: React.FC<{ width?: number; height?: number }> = ({ width = 110, height = 44 }) => (
  <svg width={width} height={height} viewBox="0 0 160 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="160" height="64" rx="10" fill="#E11D24" />
    <rect x="4" y="4" width="152" height="56" rx="8" stroke="#FFD100" strokeWidth="3" />
    {/* Primera O */}
    <ellipse cx="32" cy="32" rx="14" ry="17" fill="#FFD100" />
    <ellipse cx="32" cy="32" rx="6" ry="9" fill="#E11D24" />
    {/* Primera X */}
    <path d="M54 15 L66 15 L78 32 L66 49 L54 49 L69 32 Z" fill="#FFD100" />
    <path d="M78 15 L90 15 L75 32 L90 49 L78 49 L63 32 Z" fill="#FFD100" />
    {/* Segunda X */}
    <path d="M88 15 L100 15 L112 32 L100 49 L88 49 L103 32 Z" fill="#FFD100" />
    <path d="M112 15 L124 15 L109 32 L124 49 L112 49 L97 32 Z" fill="#FFD100" />
    {/* Segunda O */}
    <ellipse cx="134" cy="32" rx="14" ry="17" fill="#FFD100" />
    <ellipse cx="134" cy="32" rx="6" ry="9" fill="#E11D24" />
  </svg>
)

/** Logo GO MART con flecha naranja y letras azules */
export const GoMartLogo: React.FC<{ width?: number; height?: number }> = ({ width = 120, height = 44 }) => (
  <svg width={width} height={height} viewBox="0 0 180 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="180" height="64" rx="10" fill="#FFFFFF" />
    <rect x="2" y="2" width="176" height="60" rx="8" stroke="#E2E8F0" strokeWidth="2" />
    {/* GO en naranja con chevron */}
    <g fill="#F97316">
      <path d="M22 16 C34 16 38 23 38 32 C38 41 33 48 22 48 C12 48 8 40 8 32 C8 24 12 16 22 16 Z M22 24 C17 24 16 28 16 32 C16 36 17 40 22 40 C27 40 29 36 29 32 C29 30 29 29 28 29 L23 29 L23 25 L32 25 C33 27 33 29 33 32 C33 39 28 44 22 44 C15 44 12 38 12 32 C12 26 15 20 22 20 Z" />
      {/* Flechas dobles >> */}
      <path d="M42 20 L50 32 L42 44 L47 44 L55 32 L47 20 Z" />
      <path d="M51 20 L59 32 L51 44 L56 44 L64 32 L56 20 Z" />
    </g>
    {/* MART en azul marino */}
    <text x="68" y="44" fontFamily="Impact, Arial Black, sans-serif" fontSize="32" fontWeight="900" fill="#0369A1" letterSpacing="1">
      MART
    </text>
  </svg>
)

/** Logo SIX Convenience Store con hoja y estilo emblemático */
export const SixLogo: React.FC<{ width?: number; height?: number }> = ({ width = 120, height = 46 }) => (
  <svg width={width} height={height} viewBox="0 0 180 68" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="180" height="68" rx="10" fill="#FFFFFF" />
    <rect x="2" y="2" width="176" height="64" rx="8" stroke="#FBBF24" strokeWidth="2.5" />
    {/* Hoja verde arriba de la I */}
    <path d="M82 10 C86 4 94 4 98 7 C100 12 96 18 90 17 C85 16 83 13 82 10 Z" fill="#22C55E" />
    {/* Texto SIX en cursiva gruesa roja con borde dorado */}
    <text
      x="88"
      y="42"
      textAnchor="middle"
      fontFamily="Arial Black, Impact, sans-serif"
      fontSize="36"
      fontStyle="italic"
      fontWeight="900"
      fill="#DC2626"
      stroke="#D97706"
      strokeWidth="1.2"
      letterSpacing="3"
    >
      Six
    </text>
    {/* Subtítulo Convenience Store */}
    <rect x="20" y="48" width="140" height="14" rx="4" fill="#DC2626" />
    <text x="90" y="59" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="#FFFFFF" letterSpacing="1.2">
      Convenience Store
    </text>
  </svg>
)

/** Logo NATURA en verde elegante */
export const NaturaLogo: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'md' }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      background: 'rgba(255,255,255,0.18)',
      padding: size === 'sm' ? '4px 10px' : '8px 14px',
      borderRadius: '8px',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: size === 'sm' ? '12px' : '14px',
      letterSpacing: '0.8px',
      border: '1px solid rgba(255,255,255,0.25)',
    }}
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L4 9v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-8-7z" fill="none" stroke="#86efac" strokeWidth="2" />
      <path d="M12 22V12" stroke="#86efac" strokeWidth="2" />
      <path d="M12 12c-2-2-4-2-4 0s2 2 4 0zm0 0c2-2 4-2 4 0s-2 2-4 0z" fill="#86efac" />
    </svg>
    <span>NATURA</span>
  </div>
)

/** Logo eco store */
export const EcoStoreLogo: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'md' }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      background: 'rgba(255,255,255,0.18)',
      padding: size === 'sm' ? '4px 10px' : '8px 14px',
      borderRadius: '8px',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: size === 'sm' ? '12px' : '14px',
      letterSpacing: '0.5px',
      border: '1px solid rgba(255,255,255,0.25)',
    }}
  >
    <span style={{ fontSize: '15px' }}>🌱</span>
    <span>eco store</span>
  </div>
)

/** Logo Bio Market */
export const BioMarketLogo: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'md' }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      background: 'rgba(255,255,255,0.18)',
      padding: size === 'sm' ? '4px 10px' : '8px 14px',
      borderRadius: '8px',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: size === 'sm' ? '12px' : '14px',
      letterSpacing: '0.5px',
      border: '1px solid rgba(255,255,255,0.25)',
    }}
  >
    <span style={{ fontSize: '15px' }}>🍃</span>
    <span>Bio Market</span>
  </div>
)

/** Mascota Planeta Tierra Feliz con Hojita */
export const PlanetMascot: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="52" r="38" fill="#38BDF8" />
    {/* Continentes verdes */}
    <path
      d="M32 30 C38 25 45 28 48 35 C50 40 42 46 38 44 C34 42 30 36 32 30 Z"
      fill="#4ADE80"
    />
    <path
      d="M58 38 C68 35 74 42 72 50 C70 56 64 58 60 52 C56 46 54 40 58 38 Z"
      fill="#4ADE80"
    />
    <path
      d="M34 62 C40 58 48 64 52 70 C48 78 38 80 32 74 C28 70 30 64 34 62 Z"
      fill="#4ADE80"
    />
    {/* Ojos adorables con brillo */}
    <ellipse cx="43" cy="50" rx="3.5" ry="4.5" fill="#0F172A" />
    <circle cx="44.5" cy="48" r="1.5" fill="#FFFFFF" />
    <ellipse cx="57" cy="50" rx="3.5" ry="4.5" fill="#0F172A" />
    <circle cx="58.5" cy="48" r="1.5" fill="#FFFFFF" />
    {/* Sonrisa amigable */}
    <path d="M46 58 Q50 63 54 58" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
    {/* Mejillas sonrosadas */}
    <ellipse cx="38" cy="55" rx="3" ry="1.8" fill="#F472B6" opacity="0.6" />
    <ellipse cx="62" cy="55" rx="3" ry="1.8" fill="#F472B6" opacity="0.6" />
    {/* Corona de hojita ecológica */}
    <path d="M50 14 C55 6 64 8 68 12 C70 18 64 24 56 22 C50 20 48 16 50 14 Z" fill="#22C55E" />
    <path d="M53 18 Q58 14 64 12" stroke="#15803D" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

/** Ilustración de Termo Reutilizable en Acero Inoxidable */
export const ThermosIllustration: React.FC<{ size?: number }> = ({ size = 90 }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#94A3B8" />
        <stop offset="35%" stopColor="#E2E8F0" />
        <stop offset="60%" stopColor="#FFFFFF" />
        <stop offset="85%" stopColor="#CBD5E1" />
        <stop offset="100%" stopColor="#64748B" />
      </linearGradient>
      <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="50%" stopColor="#475569" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
    </defs>
    {/* Sombra base */}
    <ellipse cx="50" cy="122" rx="24" ry="5" fill="#000000" opacity="0.15" />
    {/* Tapa con anillo */}
    <rect x="42" y="10" width="16" height="8" rx="3" fill="url(#capGrad)" />
    <rect x="38" y="18" width="24" height="10" rx="3" fill="url(#capGrad)" />
    {/* Cuello del termo */}
    <path d="M40 28 L60 28 L64 36 L36 36 Z" fill="url(#metalGrad)" />
    {/* Cuerpo principal del termo */}
    <rect x="33" y="36" width="34" height="78" rx="6" fill="url(#metalGrad)" />
    {/* Detalle logo ecológico grabado */}
    <circle cx="50" cy="70" r="7" fill="none" stroke="#16A34A" strokeWidth="1.5" />
    <path d="M47 70 C47 67 53 67 53 70 C53 73 47 73 47 70 Z" fill="#16A34A" />
    {/* Base reforzada */}
    <rect x="34" y="110" width="32" height="6" rx="2" fill="url(#capGrad)" />
  </svg>
)

/** Ilustración de Gorra Ecológica Negra */
export const CapIllustration: React.FC<{ size?: number }> = ({ size = 90 }) => (
  <svg width={size} height={size * 0.9} viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="capBlack" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#334155" />
        <stop offset="70%" stopColor="#1E293B" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
    </defs>
    {/* Sombra */}
    <ellipse cx="60" cy="78" rx="42" ry="7" fill="#000000" opacity="0.15" />
    {/* Corona de la gorra */}
    <path
      d="M30 52 C30 25 50 18 68 18 C86 18 96 32 98 52 Z"
      fill="url(#capBlack)"
    />
    {/* Botón superior */}
    <ellipse cx="65" cy="18" rx="4" ry="2.5" fill="#475569" />
    {/* Costuras */}
    <path d="M65 18 Q62 35 60 52" stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />
    <path d="M65 18 Q78 35 84 52" stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />
    {/* Visera curva */}
    <path
      d="M18 56 C26 48 50 48 98 52 C104 60 90 68 60 68 C30 68 14 62 18 56 Z"
      fill="#0F172A"
    />
    {/* Reflejo en la visera */}
    <path
      d="M24 56 C34 52 56 52 92 54 C82 58 64 62 42 62 C30 62 22 59 24 56 Z"
      fill="#334155"
      opacity="0.5"
    />
    {/* Parche verde reciclaje */}
    <circle cx="56" cy="38" r="5" fill="#16A34A" />
    <path d="M54 38 L58 38 M56 36 L56 40" stroke="#FFFFFF" strokeWidth="1" />
  </svg>
)

/** Ilustración de Bolsa de Tela (Canvas Tote Bag) */
export const ToteBagIllustration: React.FC<{ size?: number }> = ({ size = 90 }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="clothGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEF3C7" />
        <stop offset="50%" stopColor="#FDE68A" />
        <stop offset="100%" stopColor="#E2D4A8" />
      </linearGradient>
    </defs>
    {/* Sombra */}
    <ellipse cx="50" cy="114" rx="26" ry="5" fill="#000000" opacity="0.15" />
    {/* Asas de la bolsa */}
    <path
      d="M38 48 C38 18 62 18 62 48"
      stroke="#D4C493"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M38 48 C38 20 62 20 62 48"
      stroke="#FEF3C7"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
    {/* Cuerpo de la bolsa de tela */}
    <path
      d="M24 48 L76 48 L72 108 C72 111 68 113 65 113 L35 113 C32 113 28 111 28 108 Z"
      fill="url(#clothGrad)"
      stroke="#D4C493"
      strokeWidth="1.5"
    />
    {/* Pliegues de tela */}
    <path d="M36 50 L38 108" stroke="#D4C493" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
    <path d="M64 50 L62 108" stroke="#D4C493" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
    {/* Emblema ecológico de hojita en el centro */}
    <circle cx="50" cy="78" r="14" fill="#FFFFFF" opacity="0.8" />
    <path
      d="M50 68 C44 74 44 84 50 88 C56 84 56 74 50 68 Z"
      fill="#22C55E"
    />
    <path d="M50 72 V86" stroke="#15803D" strokeWidth="1.5" />
  </svg>
)

/** Ilustración de Snack Saludable Barrita */
export const SnackIllustration: React.FC<{ size?: number }> = ({ size = 90 }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Sombra */}
    <ellipse cx="50" cy="122" rx="20" ry="5" fill="#000000" opacity="0.15" />
    {/* Envoltura tipo barrita */}
    <rect x="32" y="18" width="36" height="98" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
    {/* Sellos dentados arriba y abajo */}
    <path d="M32 18 L36 14 L40 18 L44 14 L48 18 L52 14 L56 18 L60 14 L64 18 L68 14 V18 H32 Z" fill="#CBD5E1" />
    <path d="M32 116 L36 120 L40 116 L44 120 L48 116 L52 120 L56 116 L60 120 L64 116 L68 120 V116 H32 Z" fill="#CBD5E1" />
    {/* Ventana transparente con granos / frutos */}
    <rect x="36" y="32" width="28" height="54" rx="4" fill="#FEF3C7" stroke="#FDE68A" />
    {/* Avena y nueces */}
    <circle cx="44" cy="42" r="3" fill="#D97706" />
    <circle cx="56" cy="48" r="4" fill="#92400E" />
    <circle cx="42" cy="58" r="3.5" fill="#B45309" />
    <circle cx="54" cy="68" r="3" fill="#D97706" />
    <circle cx="46" cy="76" r="2.5" fill="#92400E" />
    {/* Cintillo verde orgánico */}
    <rect x="32" y="90" width="36" height="18" fill="#16A34A" />
    <text x="50" y="102" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fontWeight="bold" fill="#FFFFFF">
      100% ECO
    </text>
  </svg>
)

/** Ilustración interactiva del Bote Inteligente con sensores destacados */
export const SmartBinIllustration: React.FC<{ width?: number; height?: number; active?: boolean }> = ({
  width = 240,
  height = 360,
  active = false,
}) => (
  <svg width={width} height={height} viewBox="0 0 240 360" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="binBody" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="30%" stopColor="#64748B" />
        <stop offset="70%" stopColor="#475569" />
        <stop offset="100%" stopColor="#334155" />
      </linearGradient>
      <linearGradient id="binRim" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#94A3B8" />
        <stop offset="50%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#64748B" />
      </linearGradient>
      <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Sombra del suelo */}
    <ellipse cx="120" cy="345" rx="80" ry="12" fill="#000000" opacity="0.25" />

    {/* Cuerpo inferior del bote */}
    <rect x="50" y="150" width="140" height="185" rx="16" fill="url(#binBody)" stroke="#1E293B" strokeWidth="2" />

    {/* Cabeza / Cúpula superior */}
    <path
      d="M50 150 C50 60 70 30 120 30 C170 30 190 60 190 150 Z"
      fill="url(#binBody)"
      stroke="#1E293B"
      strokeWidth="2"
    />

    {/* Moldura metálica plateada de contorno */}
    <path
      d="M52 145 C52 64 72 36 120 36 C168 36 188 64 188 145"
      stroke="url(#binRim)"
      strokeWidth="4"
      fill="none"
    />

    {/* Pantalla digital interactiva superior */}
    <rect x="68" y="55" width="104" height="65" rx="10" fill="#0F172A" stroke="#334155" strokeWidth="2" />
    {/* Contenido en pantalla digital */}
    <g>
      <circle cx="84" cy="72" r="7" fill="#15803D" />
      <path d="M82 72 L86 72 M84 70 L84 74" stroke="#FFF" strokeWidth="1.2" />
      <text x="96" y="72" fontFamily="sans-serif" fontSize="7" fill="#94A3B8">
        ¡Gracias por reciclar!
      </text>
      <text x="96" y="86" fontFamily="sans-serif" fontSize="11" fontWeight="bold" fill="#4ADE80">
        +10 PUNTOS
      </text>
      <text x="80" y="105" fontFamily="sans-serif" fontSize="8" fill="#E2E8F0">
        Total acumulado: 230 pts
      </text>
    </g>

    {/* Boca / Compuerta de depósito con LED verde brillante */}
    <rect
      x="60"
      y="130"
      width="120"
      height="60"
      rx="12"
      fill="#090D16"
      stroke={active ? '#22C55E' : '#4ADE80'}
      strokeWidth={active ? 4 : 3}
      filter={active ? 'url(#glowGreen)' : undefined}
    />
    {/* Interior de la compuerta */}
    <ellipse cx="120" cy="160" rx="48" ry="16" fill="#020617" />

    {/* Icono de reciclaje en el centro del bote */}
    <g transform="translate(98, 215) scale(0.9)">
      <path
        d="M24 4 L30 14 H20 L24 4 Z M16 32 L10 22 H20 L16 32 Z M34 26 L44 26 L39 34 L34 26 Z"
        fill="#22C55E"
      />
      <circle cx="24" cy="22" r="14" stroke="#22C55E" strokeWidth="3" fill="none" strokeDasharray="18 10" />
    </g>

    {/* Texto frontal del contenedor */}
    <text x="120" y="270" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#FFFFFF" letterSpacing="1">
      JUNTOS
    </text>
    <text x="120" y="284" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill="#CBD5E1" letterSpacing="0.5">
      CUIDAMOS EL PLANETA
    </text>

    {/* Lector RFID / Sensor lateral */}
    <g transform="translate(182, 110)">
      <circle cx="8" cy="8" r="8" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
      <path d="M5 8 A3 3 0 0 1 11 8 M3 8 A5 5 0 0 1 13 8" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </g>
  </svg>
)
