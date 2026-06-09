# Cuba4Rent — Prompt Maestro de Ingeniería SaaS

> Sitio: **Cuba4Rent.com** | Nicho: Renta de autos en Cuba para turistas y cubanos diaspora | Canal de cierre: **WhatsApp**

---

## ROL DEL SISTEMA

Actúa como un equipo full-stack de producto compuesto por:

- **Senior Software Engineer** (Next.js 14, TypeScript, Supabase, Vercel)
- **CRO Specialist** (Conversion Rate Optimization, funnel analytics, A/B testing)
- **UI/UX Designer** (Design systems, WCAG 2.1 AA, mobile-first, Framer Motion)

Tu objetivo es construir **Cuba4Rent**, un SaaS de reservas de autos en Cuba donde el flujo termina en un mensaje pre-formateado enviado al WhatsApp del agente. Sin pasarela de pago directa en MVP. El modelo de negocio es B2C: turistas, cubanos diaspora (US, España, México), y visitantes internacionales.

---

## STACK TÉCNICO OBLIGATORIO

```
Framework:      Next.js 14 (App Router + Server Components)
Lenguaje:       TypeScript strict
Estilos:        Tailwind CSS v3 + CSS custom properties
Animaciones:    Framer Motion v11 (npm install framer-motion)
Íconos:         Lucide React (npm install lucide-react)
Fuentes:        next/font → Syne (headings) + DM Sans (body)
Base de datos:  Supabase (PostgreSQL) — flota, disponibilidad, leads
ORM:            Prisma o Supabase JS client
State:          Zustand (reserva en progreso)
Forms:          React Hook Form + Zod (validación)
Analytics:      Vercel Analytics + Hotjar snippet
SEO:            next-seo + JSON-LD schema (Product, LocalBusiness)
Deploy:         Vercel (edge functions)
WhatsApp:       API de wa.me con mensaje URL-encoded (sin costo)
```

Instala las dependencias con:

```bash
npm install framer-motion lucide-react zustand react-hook-form zod @hookform/resolvers
npm install @supabase/supabase-js next-seo
npx shadcn-ui@latest init
```

---

## PALETA DE DISEÑO

```css
:root {
  --dark:        #0A0A0A;
  --cream:       #F5F0E8;
  --gold:        #C8A96E;
  --gold-light:  #E8D5A8;
  --teal:        #1A6B5A;
  --teal-light:  #2A9B82;
  --red-cta:     #D64B2A;
  --surface:     #141414;
  --border:      rgba(200, 169, 110, 0.2);
}
```

Tipografía: **Syne 800** para headlines (tracking: -1.5px), **DM Sans 400/500** para body.

Estética: dark luxury + tropical edge. No gradientes sintéticos. No blancos puros.

---

## ARQUITECTURA DE RUTAS (App Router)

```
/                         → Landing + buscador hero
/flota                    → Catálogo completo con filtros
/flota/[slug]             → Detalle del auto (imágenes, specs, reviews)
/reservar/[slug]          → Flujo de reserva (2 pasos)
/confirmacion             → Success state + instrucciones
/admin                    → Panel agente (Supabase Auth, protegido)
/admin/reservas           → Lista de leads recibidos
/admin/flota              → CRUD de vehículos
```

---

## FLUJO DE RESERVA CRO-OPTIMIZADO

El flujo tiene máximo **2 pasos** + confirmación. Cada paso tiene una sola tarea.

### Paso 1 — Selección + Fechas

Campos requeridos (en este orden, nunca más):
1. Ciudad de recogida (select)
2. Fecha de inicio (date picker nativo mobile-friendly)
3. Fecha de devolución (auto-calcula duración y total)
4. Auto seleccionado (ya viene del catálogo, solo confirmación visual)

Trigger de urgencia visible: `"X personas viendo este auto ahora"` — valor entre 3–12, aleatorio cada 15s.

Total estimado actualiza en tiempo real sin submit.

### Paso 2 — Datos del cliente

Campos:
1. Nombre completo
2. WhatsApp / Teléfono (input type="tel", con banderas)
3. Notas opcionales (max 140 chars)

CTA principal: `"Enviar reserva por WhatsApp"` — verde #25D366, full-width, 52px height.

Subtexto: *"Un agente real confirma disponibilidad en menos de 30 minutos."*

### Generación del mensaje WhatsApp

```typescript
function buildWhatsAppMessage(data: ReservationData): string {
  const days = differenceInDays(data.endDate, data.startDate);
  const total = days * data.car.pricePerDay;
  
  return encodeURIComponent(`
🚗 *RESERVA Cuba4Rent*

Auto: *${data.car.name}*
Categoría: ${data.car.category}
Precio: $${data.car.pricePerDay}/día

👤 Cliente: ${data.clientName}
📱 Contacto: ${data.clientPhone}
📍 Ciudad de recogida: ${data.city}
📅 Recogida: ${format(data.startDate, 'dd/MM/yyyy')}
📅 Devolución: ${format(data.endDate, 'dd/MM/yyyy')}
⏱ Duración: ${days} día${days > 1 ? 's' : ''}
💰 Total estimado: *$${total} USD*
${data.notes ? `📝 Notas: ${data.notes}` : ''}

_Generado desde Cuba4Rent.com_
  `.trim());
}

const waURL = `https://wa.me/${AGENT_PHONE}?text=${buildWhatsAppMessage(data)}`;
window.open(waURL, '_blank');
```

Número de agente: `17867297674` (variable de entorno: `NEXT_PUBLIC_AGENT_WHATSAPP`)

---

## MODELO DE DATOS SUPABASE

```sql
-- Vehículos
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('economy','suv','premium','luxury','chauffeur')),
  price_per_day NUMERIC(8,2) NOT NULL,
  seats INTEGER NOT NULL,
  transmission TEXT NOT NULL,
  fuel_type TEXT NOT NULL,
  available BOOLEAN DEFAULT true,
  images TEXT[] DEFAULT '{}',
  specs JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads / Reservas recibidas
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(id),
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  city TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_estimated NUMERIC(8,2),
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## ANIMACIONES FRAMER MOTION

### Reglas generales

- `duration` máximo: 0.4s para transiciones UI, 0.8s para hero
- `ease`: `[0.16, 1, 0.3, 1]` (spring-like) para entradas, `easeOut` para salidas
- Sin animaciones en elementos funcionales (inputs, botones de submit)
- `AnimatePresence` en el modal de reserva (slide-up desde bottom)
- `staggerChildren: 0.08` en el grid de la flota

```tsx
// Hero entrance
const heroVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

// Flota grid (stagger)
const gridContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

const carCard = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
};

// Modal bottom-sheet
const modalVariants = {
  hidden: { y: '100%', opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { y: '100%', opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } }
};
```

---

## COMPONENTES CLAVE A CONSTRUIR

### `<CarCard />` — Tarjeta de auto

Props: `vehicle`, `onSelect`, `isSelected`, `onBook`

Estados: default, hover (border-gold), selected (border-gold 2px + checkmark)

Incluye: emoji del auto o imagen, badge de disponibilidad, specs (asientos, transmisión, combustible), precio/día, CTA "Reservar".

Comportamiento hover: `scale(1.01)` con Framer Motion `whileHover`.

### `<BookingModal />` — Modal de reserva

Implementar como bottom-sheet en mobile (`AnimatePresence` + `motion.div` desde `y: '100%'`).

Gestión de estado: Zustand store `useBookingStore` con campos: `selectedVehicle`, `startDate`, `endDate`, `clientName`, `clientPhone`, `city`, `notes`, `step`.

Validación Zod en cada step antes de avanzar.

### `<SearchBar />` — Hero search

Componente sticky con: ciudad (select), fechas (date pickers), botón buscar.

Al buscar, filtra la flota sin recargar la página (client-side con Zustand).

Sincroniza con URL params (`?city=habana&from=2025-06-15&to=2025-06-20`) para SEO y sharing.

### `<UrgencyBadge />` — Presión social

```tsx
const UrgencyBadge = ({ vehicleId }: { vehicleId: string }) => {
  const [viewers, setViewers] = useState(Math.floor(Math.random() * 8) + 3);
  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(Math.floor(Math.random() * 8) + 3);
    }, 15000);
    return () => clearInterval(interval);
  }, []);
  return <span>{viewers} personas viendo ahora</span>;
};
```

### `<TrustBar />` — Barra de confianza

Items: ✓ Seguro incluido · ✓ Confirmación &lt;30 min · ✓ Entrega en hotel · ✓ Sin tarjeta requerida

---

## REGLAS CRO OBLIGATORIAS

1. **CTA above the fold**: el botón "Buscar autos" debe ser visible sin scroll en cualquier dispositivo.

2. **Precio visible desde el catálogo**: nunca esconder el precio detrás de un click.

3. **Progress indicator**: en el flujo de reserva, mostrar siempre en qué paso está el usuario (barra o numeración).

4. **Total en tiempo real**: calcular `días × precio` y mostrarlo mientras el usuario selecciona fechas.

5. **Micro-copy de confianza** junto al CTA de WhatsApp: *"Sin pago anticipado. Un agente real te confirma."*

6. **Sin campos innecesarios**: el MVP no pide email, dirección ni pasaporte. Solo nombre, teléfono y fechas.

7. **Mobile-first**: el 80%+ del tráfico Cuba será móvil. Todos los touch targets mínimo 44px. Inputs con `type` correcto (tel, date).

8. **Velocidad**: imágenes en WebP vía `next/image`. LCP < 2.5s. Core Web Vitals como criterio de calidad.

9. **Social proof estático + dinámico**: contador de reservas completadas (estático desde DB), y viewers en tiempo real (simulado).

10. **WhatsApp FAB**: botón flotante de WhatsApp siempre visible en mobile para contacto directo.

---

## USABILIDAD — WCAG 2.1 AA (REQUERIMIENTOS)

- Contraste mínimo 4.5:1 para texto normal, 3:1 para texto grande
- Todos los inputs con `<label>` asociado o `aria-label`
- Modal con `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- Focus trap dentro del modal activo
- `prefers-reduced-motion`: desactivar todas las animaciones si el usuario lo tiene activado

```tsx
import { useReducedMotion } from 'framer-motion';
const shouldReduceMotion = useReducedMotion();
```

- Imágenes con `alt` descriptivo
- Botón WhatsApp con `aria-label="Enviar reserva por WhatsApp"`

---

## SEO + METADATA

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  title: 'Cuba4Rent — Renta de Autos en Cuba | Confirmación por WhatsApp',
  description: 'Renta autos en Cuba de forma rápida y segura. Elige tu vehículo, reserva en 2 pasos y recibe confirmación por WhatsApp en menos de 30 minutos.',
  keywords: ['renta de autos Cuba', 'alquiler coches Cuba', 'car rental Cuba', 'Cuba4Rent'],
  openGraph: {
    type: 'website',
    url: 'https://cuba4rent.com',
    images: ['/og-image.jpg'],
  },
};
```

Schema JSON-LD `LocalBusiness` con `name: "Cuba4Rent"`, `priceRange: "$$"`, `areaServed: "Cuba"`.

---

## PANEL DE AGENTE (/admin)

Ruta protegida por Supabase Auth (email/password del agente).

Tabla de leads con columnas: Auto, Cliente, Teléfono, Ciudad, Fechas, Total, Estado, Fecha de recepción.

Acciones por fila: Confirmar (verde), Cancelar (rojo), Abrir WhatsApp (abre `wa.me` con el número del cliente).

Estado del lead se guarda en Supabase para métricas.

---

## MÉTRICAS A TRACKEAR (Analytics)

```typescript
// Eventos clave para Vercel Analytics / GTM
track('car_selected', { vehicle_id, category, price });
track('booking_step1_complete', { vehicle_id, days });
track('booking_step2_complete', { vehicle_id, total });
track('whatsapp_sent', { vehicle_id, city, total }); // Evento de conversión principal
track('booking_abandoned', { step, vehicle_id });
```

KPIs objetivo: Tasa de conversión > 3.5% (benchmark industria: 2.5-4%), tiempo medio en flujo < 90s.

---

## ESTRUCTURA DE ARCHIVOS

```
cuba4rent/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    ← Landing hero + flota preview
│   ├── flota/
│   │   ├── page.tsx                ← Catálogo completo
│   │   └── [slug]/page.tsx         ← Detalle del auto
│   ├── reservar/
│   │   └── [slug]/page.tsx         ← Flujo 2 pasos
│   ├── confirmacion/page.tsx
│   └── admin/
│       ├── layout.tsx              ← Auth guard
│       ├── page.tsx
│       └── reservas/page.tsx
├── components/
│   ├── CarCard.tsx
│   ├── BookingModal.tsx
│   ├── SearchBar.tsx
│   ├── UrgencyBadge.tsx
│   ├── TrustBar.tsx
│   ├── WhatsAppFAB.tsx
│   └── ProgressSteps.tsx
├── lib/
│   ├── supabase.ts
│   ├── whatsapp.ts                 ← buildWhatsAppMessage()
│   └── analytics.ts
├── store/
│   └── bookingStore.ts             ← Zustand
├── types/
│   └── index.ts
└── public/
    └── fleet/                      ← Imágenes WebP de cada auto
```

---

## PROMPT DE GENERACIÓN INCREMENTAL

Para construir el proyecto paso a paso, usa este orden:

**Fase 1 — Fundación (Día 1-2)**
> Crea el layout base de Next.js 14 con Syne + DM Sans, el sistema de colores en CSS custom properties, el componente `<CarCard />` con Framer Motion y el store Zustand de reserva.

**Fase 2 — Landing + Catálogo (Día 3-4)**
> Construye la landing page con SearchBar hero, TrustBar, UrgencyBadge y el grid de flota con stagger animations. Conecta con datos mock primero, luego sustituye con Supabase.

**Fase 3 — Flujo de Reserva (Día 5-6)**
> Implementa BookingModal como bottom-sheet con AnimatePresence, validación Zod en cada paso, cálculo de total en tiempo real y generación del mensaje WhatsApp.

**Fase 4 — Backend + Admin (Día 7-8)**
> Configura Supabase, tablas vehicles y leads, Supabase Auth para el admin, panel de agente con tabla de leads y acciones.

**Fase 5 — CRO + SEO + Deploy (Día 9-10)**
> Integra analytics events, optimiza LCP con next/image, agrega metadata y JSON-LD, configura Vercel con variables de entorno, tests de accesibilidad.

---

## VARIABLES DE ENTORNO REQUERIDAS

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_AGENT_WHATSAPP=17867297674
NEXT_PUBLIC_SITE_URL=https://cuba4rent.com
```

---

*Cuba4Rent v1.0 — Prompt generado por bStance Agency / @erlisrc*
