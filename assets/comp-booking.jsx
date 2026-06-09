/* Cuba4Rent — Reserva (bottom-sheet 2 pasos → WhatsApp), FAB y urgencia */

function daysBetween(a, b) {
  if (!a || !b) return 0;
  const d = (new Date(b) - new Date(a)) / 86400000;
  return d > 0 ? Math.round(d) : 0;
}
function fmtDate(s, lang) {
  if (!s) return "—";
  const d = new Date(s + "T00:00:00");
  return d.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", { day: "2-digit", month: "short", year: "numeric" });
}

/* urgency hook — 3..12 viewers, refresh every 15s (deterministic-ish per car) */
function useViewers(seed) {
  const [n, setN] = useState(() => 3 + Math.floor(Math.random() * 8));
  useEffect(() => {
    const id = setInterval(() => setN(3 + Math.floor(Math.random() * 8)), 15000);
    return () => clearInterval(id);
  }, [seed]);
  return n;
}

function BookingModal({ open, lang, t, vehicle, prefill, onClose }) {
  const C = window.CUBA;
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(1);
  const [carSlug, setCarSlug] = useState("");
  const [city, setCity] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [waLink, setWaLink] = useState("#");
  const sheetRef = useRef(null);
  const today = new Date().toISOString().slice(0, 10);

  // open/close lifecycle
  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setShow(true)));
      setStep(1); setSent(false); setErrors({});
      if (vehicle) setCarSlug(vehicle.slug);
      else if (!carSlug) setCarSlug(C.FLEET[0].slug);
      if (prefill) {
        if (prefill.city) setCity(prefill.city);
        if (prefill.start) setStart(prefill.start);
        if (prefill.end) setEnd(prefill.end);
        if (prefill.carSlug) setCarSlug(prefill.carSlug);
      }
      document.body.style.overflow = "hidden";
    } else {
      setShow(false);
      document.body.style.overflow = "";
      const id = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(id);
    }
  }, [open]); // eslint-disable-line

  // esc + focus
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;
  const car = C.FLEET.find((v) => v.slug === carSlug) || C.FLEET[0];
  const days = daysBetween(start, end);
  const total = days * car.pricePerDay;
  const viewers = 3 + (car.slug.length % 7);

  const validateStep1 = () => {
    const e = {};
    if (!city) e.city = t("bk_err_city");
    if (!start || !end || days < 1) e.dates = t("bk_err_dates");
    setErrors(e); return Object.keys(e).length === 0;
  };
  const validateStep2 = () => {
    const e = {};
    if (!name.trim()) e.name = t("bk_err_name");
    if (!phone.trim() || phone.replace(/\D/g, "").length < 6) e.phone = t("bk_err_phone");
    setErrors(e); return Object.keys(e).length === 0;
  };
  const next = () => { if (validateStep1()) { setErrors({}); setStep(2); } };
  const submit = () => {
    if (!validateStep2()) return;
    const data = { car, clientName: name.trim(), clientPhone: phone.trim(), city,
      startDate: fmtDate(start, "es").replace(/\sde\s/g, " "), endDate: fmtDate(end, "es").replace(/\sde\s/g, " "),
      days, notes: notes.trim() };
    const link = C.waURL(data, lang);
    setWaLink(link);
    window.open(link, "_blank");
    setSent(true);
  };

  const TotalBox = () => (
    <div className="bk__total">
      <div className="lab">{t("bk_total")}<b>{days || 0} {days === 1 ? t("bk_day") : t("bk_days")} × ${car.pricePerDay}</b></div>
      <div className="amt"><b>${total || 0}</b><span> USD</span></div>
    </div>
  );

  return (
    <div className={"bk-overlay" + (show ? " is-in" : "")} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog" aria-modal="true" aria-labelledby="bk-title">
      <div className="bk" ref={sheetRef}>
        {!sent ? (
          <React.Fragment>
            <div className="bk__head">
              <div className="bk__head-top">
                <span className="bk__step-label">{t("bk_step")} {step} {t("bk_of")} 2</span>
                <button className="bk__close" onClick={onClose} aria-label={t("bk_close")}><Icon name="x" size={18} /></button>
              </div>
              <div className="bk__progress"><span className="on"></span><span className={step >= 2 ? "on" : ""}></span></div>
            </div>
            <div className="bk__body">
              {step === 1 ? (
                <React.Fragment>
                  <h3 id="bk-title">{t("bk_t1")}</h3>
                  {/* selected car */}
                  <div className="bk__carcard">
                    {car.img ? <img src={car.img} alt={car.name} /> : <div className="bk__carph"><Icon name="car" size={26} /></div>}
                    <div className="info">
                      <b>{car.name}</b>
                      <span>{C.CATEGORY[car.category][lang]} · {car.seats} {t("seats")}</span>
                    </div>
                    <div className="price" style={{ textAlign: "right" }}>
                      <b>${car.pricePerDay}</b><div style={{ fontSize: 11, color: "var(--muted)" }}>{t("per_day")}</div>
                    </div>
                  </div>
                  <div className="bk-field">
                    <label>{t("bk_change")} — {t("f_car")}</label>
                    <div className="ctrl"><Icon name="carSimple" size={17} />
                      <select value={carSlug} onChange={(e) => setCarSlug(e.target.value)}>
                        {C.FLEET.map((v) => <option key={v.slug} value={v.slug}>{v.name} — ${v.pricePerDay}/{lang === "es" ? "día" : "day"}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className={"bk-field" + (errors.city ? " err" : "")}>
                    <label>{t("f_city")}</label>
                    <div className="ctrl"><Icon name="mapPin" size={17} />
                      <select value={city} onChange={(e) => setCity(e.target.value)}>
                        <option value="">{lang === "es" ? "Elige ciudad" : "Choose city"}</option>
                        {C.CITIES.map((c) => <option key={c.id} value={c.id}>{c[lang]}</option>)}
                      </select>
                    </div>
                    {errors.city && <span className="msg">{errors.city}</span>}
                  </div>
                  <div className={"bk-field" + (errors.dates ? " err" : "")}>
                    <div className="bk-row">
                      <div>
                        <label style={{ marginBottom: 7, display: "block" }}>{t("bk_pickup")}</label>
                        <div className="ctrl"><Icon name="calendar" size={17} />
                          <input type="date" min={today} value={start} onChange={(e) => setStart(e.target.value)} />
                        </div>
                      </div>
                      <div>
                        <label style={{ marginBottom: 7, display: "block" }}>{t("bk_return")}</label>
                        <div className="ctrl"><Icon name="calendar" size={17} />
                          <input type="date" min={start || today} value={end} onChange={(e) => setEnd(e.target.value)} />
                        </div>
                      </div>
                    </div>
                    {errors.dates && <span className="msg">{errors.dates}</span>}
                  </div>
                  <TotalBox />
                  <div className="bk__foot">
                    <button className="btn btn--red btn--block btn--lg" onClick={next}>{t("bk_continue")}<Icon name="arrowRight" size={18} /></button>
                  </div>
                  <div className="bk__reassure"><Icon name="shield" size={17} />{t("bk_reassure")}</div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <h3 id="bk-title">{t("bk_t2")}</h3>
                  <div className={"bk-field" + (errors.name ? " err" : "")}>
                    <label>{t("bk_name")}</label>
                    <div className="ctrl"><Icon name="users" size={17} />
                      <input type="text" value={name} placeholder={t("bk_name_ph")} onChange={(e) => setName(e.target.value)} />
                    </div>
                    {errors.name && <span className="msg">{errors.name}</span>}
                  </div>
                  <div className={"bk-field" + (errors.phone ? " err" : "")}>
                    <label>{t("bk_phone")}</label>
                    <div className="ctrl"><Icon name="whatsapp" size={17} />
                      <input type="tel" value={phone} placeholder={t("bk_phone_ph")} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    {errors.phone && <span className="msg">{errors.phone}</span>}
                  </div>
                  <div className="bk-field">
                    <label>{t("bk_notes")}</label>
                    <div className="ctrl" style={{ height: "auto", alignItems: "flex-start", paddingTop: 0 }}>
                      <Icon name="send" size={17} style={{ marginTop: 16 }} />
                      <textarea maxLength={140} value={notes} placeholder={t("bk_notes_ph")} onChange={(e) => setNotes(e.target.value)} />
                    </div>
                  </div>
                  <TotalBox />
                  <div className="bk__foot">
                    <button className="btn btn--ghost" onClick={() => { setErrors({}); setStep(1); }}><Icon name="arrowRight" size={18} style={{ transform: "rotate(180deg)" }} />{t("bk_back")}</button>
                    <button className="btn btn--wa btn--block btn--lg" onClick={submit}><Icon name="whatsapp" size={19} />{t("bk_send")}</button>
                  </div>
                  <div className="bk__reassure"><Icon name="checkCircle" size={17} />{t("bk_reassure")}</div>
                </React.Fragment>
              )}
            </div>
          </React.Fragment>
        ) : (
          <div className="bk__success">
            <div className="bk__success-ic"><Icon name="whatsapp" size={42} /></div>
            <h3>{t("bk_sent_t")}</h3>
            <p>{t("bk_sent_d")}</p>
            <a className="btn btn--wa btn--lg" href={waLink} target="_blank" rel="noopener"><Icon name="whatsapp" size={19} />{t("bk_open_wa")}</a>
            <div style={{ marginTop: 14 }}>
              <button className="btn btn--ghost" onClick={onClose}>{t("bk_close")}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Fab({ lang, t }) {
  const C = window.CUBA;
  const viewers = useViewers("fab");
  const [showUrg, setShowUrg] = useState(false);
  useEffect(() => { const id = setTimeout(() => setShowUrg(true), 2600); return () => clearTimeout(id); }, []);
  return (
    <div className="fab">
      {showUrg && (
        <div className="urgency"><span className="dot"></span>{viewers} {t("viewing")}</div>
      )}
      <a className="fab__btn" href={C.waPlain()} target="_blank" rel="noopener" aria-label={t("wa_help")}>
        <span className="ic"><Icon name="whatsapp" size={28} /></span>
        <span className="fab__label">{t("wa_help")}</span>
      </a>
    </div>
  );
}
Object.assign(window, { BookingModal, Fab, useViewers });
