import React, { useState, useEffect, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'

export interface BoteStation {
  id: string
  code: string
  name: string
  location: string
  supportedMaterials: string[]
}

export const BOTE_STATIONS: BoteStation[] = [
  {
    id: 'bin-01',
    code: 'BP-BIN-01-PLAYA-NORTE',
    name: 'Bote Inteligente #01',
    location: 'Playa Norte · Frente al Muelle',
    supportedMaterials: ['Botellas PET', 'Latas de Aluminio'],
  },
  {
    id: 'bin-02',
    code: 'BP-BIN-02-PLAYA-CENTRAL',
    name: 'Bote Inteligente #02',
    location: 'Playa Central · Kiosco de Guardavidas',
    supportedMaterials: ['Botellas PET', 'Latas de Aluminio'],
  },
  {
    id: 'bin-03',
    code: 'BP-BIN-03-CORAL',
    name: 'Bote Inteligente #03',
    location: 'Playa Coral · Entrada Malecón',
    supportedMaterials: ['Botellas PET', 'Latas de Aluminio'],
  },
]

interface Props {
  isOpen: boolean
  onClose: () => void
  onDepositSuccess: (bottlesCount: number, station: BoteStation) => void
  preselectedStation?: BoteStation
}

export const QRScannerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onDepositSuccess,
  preselectedStation,
}) => {
  const [step, setStep] = useState<'scanning' | 'verified' | 'success'>('scanning')
  const [selectedStation, setSelectedStation] = useState<BoteStation>(
    preselectedStation || BOTE_STATIONS[0],
  )
  const [activeStation, setActiveStation] = useState<BoteStation | null>(null)
  const [bottleCount, setBottleCount] = useState<number>(1)
  const [wasteType, setWasteType] = useState<string>('Botellas PET')
  const [hasCamera, setHasCamera] = useState<boolean>(false)
  const [cameraLoading, setCameraLoading] = useState<boolean>(true)
  const [cameraError, setCameraError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanIntervalRef = useRef<number | null>(null)

  // Reproducir sonido de escaneo exitoso
  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12)
      gain.gain.setValueAtTime(0.25, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22)
      osc.start()
      osc.stop(ctx.currentTime + 0.22)
    } catch {
      // Audio no permitido o sin interacción
    }
  }

  // Manejar cuando se detecta un código QR válido
  const handleQRDetected = (station: BoteStation) => {
    playBeep()
    if (navigator.vibrate) {
      navigator.vibrate([80, 50, 80])
    }
    setActiveStation(station)
    setStep('verified')
  }

  const handleClose = () => {
    setStep('scanning')
    setBottleCount(1)
    onClose()
  }

  // Inicializar cámara si está disponible
  useEffect(() => {
    if (!isOpen) {
      // Detener cámara al cerrar
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
      if (scanIntervalRef.current) {
        window.clearInterval(scanIntervalRef.current)
        scanIntervalRef.current = null
      }
      return
    }

    let isMounted = true
    setCameraLoading(true)
    setCameraError(null)

    // Si el navegador tiene soporte para cámara
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 640 } },
        })
        .then((stream) => {
          if (!isMounted) {
            stream.getTracks().forEach((t) => t.stop())
            return
          }
          streamRef.current = stream
          setHasCamera(true)
          setCameraLoading(false)
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }

          // Soporte nativo de BarcodeDetector si existe en Chrome/Edge
          const BarcodeDetectorClass = (window as unknown as { BarcodeDetector?: new (options: { formats: string[] }) => { detect: (src: HTMLVideoElement) => Promise<Array<{ rawValue: string }>> } }).BarcodeDetector
          if (BarcodeDetectorClass) {
            try {
              const detector = new BarcodeDetectorClass({ formats: ['qr_code'] })
              scanIntervalRef.current = window.setInterval(async () => {
                if (videoRef.current && videoRef.current.readyState === 4 && step === 'scanning') {
                  try {
                    const codes = await detector.detect(videoRef.current)
                    if (codes && codes.length > 0) {
                      const raw = codes[0].rawValue
                      const matchedStation =
                        BOTE_STATIONS.find((s) => raw.includes(s.id) || raw.includes(s.code)) ||
                        selectedStation
                      handleQRDetected(matchedStation)
                    }
                  } catch {
                    // Ignorar errores de frames
                  }
                }
              }, 300)
            } catch {
              // Barcode detector no inicializado
            }
          }
        })
        .catch((err) => {
          if (!isMounted) return
          setHasCamera(false)
          setCameraLoading(false)
          setCameraError('Cámara no activa o permiso denegado. Puedes escanear usando el código de prueba.')
          console.warn('Camera not available:', err)
        })
    } else {
      setHasCamera(false)
      setCameraLoading(false)
      setCameraError('Dispositivo sin acceso a cámara web.')
    }

    return () => {
      isMounted = false
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
      if (scanIntervalRef.current) {
        window.clearInterval(scanIntervalRef.current)
        scanIntervalRef.current = null
      }
    }
  }, [isOpen, step, selectedStation])

  // Confirmar depósito y acreditar botellas
  const handleConfirmDeposit = () => {
    if (!activeStation) return
    setStep('success')
    setTimeout(() => {
      onDepositSuccess(bottleCount, activeStation)
      handleClose()
    }, 1400)
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#0f172a',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid #334155',
          display: 'flex',
          flexDirection: 'column',
          color: '#ffffff',
        }}
      >
        {/* Cabecera del Escáner */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>📷</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#f8fafc' }}>
                {step === 'scanning' && 'Escanear Bote Inteligente'}
                {step === 'verified' && '¡Bote Verificado! Depositar'}
                {step === 'success' && '¡Depósito Acreditado!'}
              </h3>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                {step === 'scanning' && 'Escaneo obligatorio para sumar botellas'}
                {step === 'verified' && activeStation?.name}
                {step === 'success' && 'Puntos sumados a tu cuenta'}
              </span>
            </div>
          </div>

          <button
            onClick={handleClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#94a3b8',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* PASO 1: ESCANEAR CÓDIGO QR CON CÁMARA O CÓDIGO DE PRUEBA */}
        {step === 'scanning' && (
          <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#cbd5e1', textAlign: 'center', lineHeight: 1.4 }}>
              Apunta la cámara al <strong>código QR</strong> ubicado en la pantalla del Bote Inteligente para desbloquear la compuerta.
            </p>

            {/* Viewfinder / Visor de la Cámara con efecto HUD */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '230px',
                backgroundColor: '#020617',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '2px solid #22c55e',
                boxShadow: '0 0 20px rgba(34, 197, 94, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Video de la cámara en vivo */}
              {hasCamera ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ fontSize: '36px', opacity: 0.8 }}>📡</span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {cameraLoading ? 'Iniciando cámara óptica...' : 'Simulador de Escáner Óptico Activo'}
                  </span>
                  {cameraError && (
                    <span style={{ fontSize: '10px', color: '#f59e0b', maxWidth: '240px' }}>
                      {cameraError}
                    </span>
                  )}
                </div>
              )}

              {/* Superposición HUD: Retícula de esquinas de escaneo */}
              <div
                style={{
                  position: 'absolute',
                  width: '160px',
                  height: '160px',
                  pointerEvents: 'none',
                }}
              >
                {/* Esquina Superior Izquierda */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '24px', height: '24px', borderTop: '3px solid #4ade80', borderLeft: '3px solid #4ade80' }} />
                {/* Esquina Superior Derecha */}
                <div style={{ position: 'absolute', top: 0, right: 0, width: '24px', height: '24px', borderTop: '3px solid #4ade80', borderRight: '3px solid #4ade80' }} />
                {/* Esquina Inferior Izquierda */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '24px', height: '24px', borderBottom: '3px solid #4ade80', borderLeft: '3px solid #4ade80' }} />
                {/* Esquina Inferior Derecha */}
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '24px', height: '24px', borderBottom: '3px solid #4ade80', borderRight: '3px solid #4ade80' }} />

                {/* Láser animado de escaneo */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, #22c55e, #86efac, #22c55e, transparent)',
                    boxShadow: '0 0 10px #22c55e',
                    animation: 'scanLaser 2s infinite ease-in-out',
                  }}
                />
              </div>

              {/* Badge estado inferior */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#4ade80',
                  letterSpacing: '0.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                <span>Buscando QR de Estación...</span>
              </div>
            </div>

            {/* SECCIÓN DE PRUEBA: CÓDIGO QR OFICIAL DEL BOTE */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '12px 14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#4ade80', textTransform: 'uppercase' }}>
                  QR de Estación Disponible
                </span>
                <select
                  value={selectedStation.id}
                  onChange={(e) => {
                    const found = BOTE_STATIONS.find((s) => s.id === e.target.value)
                    if (found) setSelectedStation(found)
                  }}
                  style={{
                    background: '#1e293b',
                    color: '#ffffff',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    fontSize: '11px',
                    padding: '3px 8px',
                    cursor: 'pointer',
                  }}
                >
                  {BOTE_STATIONS.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* QR Code SVG del Bote seleccionado */}
                <div
                  style={{
                    background: '#ffffff',
                    padding: '6px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  title="Haz clic para escanear este QR directamente"
                  onClick={() => handleQRDetected(selectedStation)}
                >
                  <QRCodeSVG value={selectedStation.code} size={70} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>
                    {selectedStation.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 8px' }}>
                    📍 {selectedStation.location}
                  </div>

                  {/* Botón para escanear este QR inmediatamente */}
                  <button
                    onClick={() => handleQRDetected(selectedStation)}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(22, 163, 74, 0.4)',
                    }}
                  >
                    <span>⚡</span>
                    <span>Escanear este Código QR</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PASO 2: QR VERIFICADO -> REGISTRAR BOTELLES Y ACREDITAR PUNTOS */}
        {step === 'verified' && activeStation && (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Banner de Verificación de Estación */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%)',
                border: '1.5px solid #22c55e',
                borderRadius: '16px',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  flexShrink: 0,
                  boxShadow: '0 0 15px rgba(34, 197, 94, 0.6)',
                }}
              >
                ✓
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '10px', color: '#86efac', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  QR de Bote Validado con Éxito
                </span>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>
                  {activeStation.name}
                </div>
                <div style={{ fontSize: '11px', color: '#cbd5e1' }}>
                  📍 {activeStation.location}
                </div>
              </div>
            </div>

            {/* Estado de la Compuerta */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '10px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px',
              }}
            >
              <span style={{ color: '#94a3b8' }}>Compuerta del Bote:</span>
              <span style={{ color: '#4ade80', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                🟢 ABIERTA (Listo para depositar)
              </span>
            </div>

            {/* Tipo de residuo a depositar */}
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Tipo de Envase:
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['Botellas PET', 'Latas de Aluminio'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setWasteType(type)}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      borderRadius: '10px',
                      border: wasteType === type ? '1.5px solid #22c55e' : '1px solid #334155',
                      background: wasteType === type ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      color: wasteType === type ? '#ffffff' : '#94a3b8',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    {type === 'Botellas PET' ? '🍾 ' : '🥤 '}
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Contador de botellas depositadas */}
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Cantidad a depositar:
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(255, 255, 255, 0.07)',
                  borderRadius: '14px',
                  padding: '6px 14px',
                  border: '1px solid #334155',
                }}
              >
                <button
                  onClick={() => setBottleCount((prev) => Math.max(1, prev - 1))}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: '#1e293b',
                    color: '#ffffff',
                    border: '1px solid #475569',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  -
                </button>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '26px', fontWeight: 900, color: '#4ade80' }}>
                    {bottleCount}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    {bottleCount === 1 ? 'envase' : 'envases'}
                  </div>
                </div>

                <button
                  onClick={() => setBottleCount((prev) => prev + 1)}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: '#1e293b',
                    color: '#ffffff',
                    border: '1px solid #475569',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  +
                </button>
              </div>

              {/* Botones de selección rápida */}
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                {[1, 3, 5, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => setBottleCount(num)}
                    style={{
                      flex: 1,
                      padding: '5px',
                      borderRadius: '8px',
                      background: bottleCount === num ? '#16a34a' : 'rgba(255,255,255,0.06)',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {num} {num === 1 ? 'ud' : 'uds'}
                  </button>
                ))}
              </div>
            </div>

            {/* Resumen de puntos calculados */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '14px',
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Crédito a recibir:</span>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#fef08a' }}>
                  +{bottleCount * 10} PUNTOS
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Peso reciclado:</span>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#86efac' }}>
                  +{(bottleCount * 0.25).toFixed(2)} kg
                </div>
              </div>
            </div>

            {/* Botón de Confirmación de Depósito */}
            <button
              onClick={handleConfirmDeposit}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '14px',
                borderRadius: '14px',
                fontSize: '15px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(22, 163, 74, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>♻️</span>
              <span>Confirmar Depósito (+{bottleCount * 10} pts)</span>
            </button>
          </div>
        )}

        {/* PASO 3: CONFIRMACIÓN EXITOSA */}
        {step === 'success' && (
          <div style={{ padding: '36px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: '#16a34a',
                color: '#ffffff',
                fontSize: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 25px rgba(34, 197, 94, 0.8)',
                animation: 'pulseGlow 1.5s infinite',
              }}
            >
              ✓
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#4ade80' }}>
                ¡Depósito Verificado con Éxito!
              </h3>
              <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#cbd5e1' }}>
                Has depositado {bottleCount} {bottleCount === 1 ? 'envase' : 'envases'} en {activeStation?.name}.
              </p>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '8px 20px',
                borderRadius: '20px',
                fontSize: '18px',
                fontWeight: 900,
                color: '#fef08a',
              }}
            >
              +{bottleCount * 10} PUNTOS ACREDITADOS
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
