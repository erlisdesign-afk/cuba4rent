/* Cuba4Rent — App root */
function App() {
  const C = window.CUBA;
  const [lang, setLang] = useState(() => localStorage.getItem("c4r_lang") || "es");
  const [booking, setBooking] = useState({ open: false, vehicle: null, prefill: null });
  useEffect(() => { localStorage.setItem("c4r_lang", lang); document.documentElement.lang = lang; }, [lang]);
  const t = (k) => C.t(k, lang);

  const openBooking = (vehicle = null, prefill = null) => setBooking({ open: true, vehicle, prefill });
  const closeBooking = () => setBooking((b) => ({ ...b, open: false }));

  const onHeroSearch = (q) => {
    let vehicle = null;
    if (q.carSlug) vehicle = C.FLEET.find((v) => v.slug === q.carSlug) || null;
    openBooking(vehicle, { city: q.city, start: q.start, end: q.end, carSlug: q.carSlug });
  };

  return (
    <React.Fragment>
      <Header lang={lang} setLang={setLang} t={t} onBook={() => openBooking()} />
      <main>
        <Hero lang={lang} t={t} onBook={() => openBooking()} onSearch={onHeroSearch} />
        <Fleet lang={lang} t={t} onSelect={(v) => openBooking(v)} />
        <Advantages t={t} />
        <Story lang={lang} t={t} onBook={() => openBooking()} />
        <Logos />
        <Services t={t} />
        <Promos t={t} onBook={() => openBooking()} />
        <How t={t} />
        <Freedom t={t} />
        <Testimonials lang={lang} t={t} />
        <Blog lang={lang} t={t} />
        <BigCTA t={t} onBook={() => openBooking()} />
      </main>
      <Footer lang={lang} t={t} />
      <Fab lang={lang} t={t} />
      <BookingModal open={booking.open} lang={lang} t={t} vehicle={booking.vehicle} prefill={booking.prefill} onClose={closeBooking} />
    </React.Fragment>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
