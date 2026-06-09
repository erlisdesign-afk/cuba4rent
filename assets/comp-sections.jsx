/* Cuba4Rent — Secciones 1: Header, Hero, Buscador, Trust, Flota, Ventajas, Historia */
const { useState, useEffect, useRef } = React;

/* reveal-on-scroll hook */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    el.querySelectorAll(".reveal").forEach((n) => io.observe(n));
    el.classList.add("reveal"); io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
const SOCIALS = [["facebook","#"],["instagram","#"],["xsocial","#"],["youtube","#"]];

function Header({ lang, setLang, onBook, t }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h);
  }, []);
  const links = [["nav_home","#top"],["nav_fleet","#flota"],["nav_services","#servicios"],["nav_about","#nosotros"],["nav_contact","#contacto"]];
  return (
    <React.Fragment>
      {/* top bar */}
      <div className="topbar">
        <div className="container topbar__in">
          <div className="topbar__list">
            <a className="topbar__item" href={"tel:+17867297674"}><Icon name="phone" size={14}/>+1 786 729 7674</a>
            <a className="topbar__item topbar__item--email" href="mailto:hola@cuba4rent.com"><Icon name="mail" size={14}/>hola@cuba4rent.com</a>
          </div>
          <div className="topbar__right">
            <div className="lang" role="group" aria-label="Language">
              <button className={lang==="es"?"is-active":""} onClick={()=>setLang("es")}>ES</button>
              <button className={lang==="en"?"is-active":""} onClick={()=>setLang("en")}>EN</button>
            </div>
            <div className="topbar__socials">
              {SOCIALS.map(([n])=> <a key={n} href="#" aria-label={n}><Icon name={n} size={15}/></a>)}
            </div>
          </div>
        </div>
      </div>
      {/* header */}
      <header className={"header"+(scrolled?" is-scrolled":"")}>
        <div className="container header__in">
          <a className="brand" href="#top" aria-label="Cuba4Rent">
            <span className="brand__mark"><Icon name="carSimple" size={22} stroke={2}/></span>
            Cuba<b>4</b>Rent
          </a>
          <nav className="nav">
            {links.map(([k,h])=> <a key={k} href={h}>{t(k)}</a>)}
          </nav>
          <div className="header__actions">
            <button className="icon-btn" aria-label={t("nav_fleet")} onClick={()=>{document.getElementById("flota")?.scrollIntoView();}}><Icon name="search" size={18}/></button>
            <button className="btn btn--red" onClick={onBook}><Icon name="whatsapp" size={18}/>{t("book_now")}</button>
            <button className="icon-btn burger" aria-label="Menu" onClick={()=>setOpen(true)}><Icon name="menu" size={20}/></button>
          </div>
        </div>
      </header>
      {/* mobile drawer */}
      <div className={"drawer"+(open?" is-open":"")}>
        <div className="drawer__scrim" onClick={()=>setOpen(false)}></div>
        <div className="drawer__panel">
          <button className="drawer__close" onClick={()=>setOpen(false)} aria-label="Close"><Icon name="x" size={20}/></button>
          {links.map(([k,h])=> <a key={k} href={h} onClick={()=>setOpen(false)}>{t(k)}</a>)}
          <button className="btn btn--red btn--block" style={{marginTop:16}} onClick={()=>{setOpen(false);onBook();}}><Icon name="whatsapp" size={18}/>{t("book_now")}</button>
        </div>
      </div>
    </React.Fragment>
  );
}

function Hero({ lang, t, onBook, onSearch }) {
  const C = window.CUBA;
  const today = new Date().toISOString().slice(0,10);
  const [city, setCity] = useState("");
  const [carSlug, setCarSlug] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const trust = ["trust_1","trust_2","trust_3","trust_4"];
  const checks = ["trust_1","t_auto","trust_3","trust_2"];
  return (
    <section className="hero" id="top">
      <div className="hero__bg"><img src="assets/img/road-night.png" alt=""/></div>
      <div className="container hero__in">
        <div className="hero__copy">
          <span className="hero__eyebrow">{t("hero_eyebrow")}</span>
          <h1>{t("hero_title_1")} <em>{t("hero_title_2")}</em></h1>
          <p className="hero__sub">{t("hero_sub")}</p>
          <div className="hero__row">
            <button className="btn btn--red btn--lg" onClick={onBook}><Icon name="carSimple" size={19}/>{t("hero_cta")}</button>
            <div className="hero__from">
              <span>{t("hero_from")}</span>
              <b><i>$</i>45<i style={{fontSize:16}}>{t("per_day")}</i></b>
            </div>
          </div>
        </div>
        <div className="hero__art">
          <div className="hero__badge"><b>20%</b><span>{lang==="es"?"OFF 1ª reserva":"OFF 1st booking"}</span></div>
          <img src="assets/img/car-white.png" alt={lang==="es"?"Auto de renta en Cuba":"Rental car in Cuba"}/>
          <div className="hero__check">
            {checks.map(k=> <span key={k}><Icon name="check" size={15}/>{t(k)}</span>)}
          </div>
        </div>
      </div>
      {/* search panel */}
      <div className="container">
        <div className="searchwrap">
          <div className="search">
            <div className="search__head"><Icon name="carSimple" size={20}/><h3>{t("search_title")}</h3></div>
            <div className="search__grid">
              <div className="field">
                <label>{t("f_city")}</label>
                <div className="ctrl"><Icon name="mapPin" size={17}/>
                  <select value={city} onChange={e=>setCity(e.target.value)} aria-label={t("f_city")}>
                    <option value="">{lang==="es"?"Elige ciudad":"Choose city"}</option>
                    {C.CITIES.map(c=> <option key={c.id} value={c.id}>{c[lang]}</option>)}
                  </select>
                </div>
              </div>
              <div className="field">
                <label>{t("f_car")}</label>
                <div className="ctrl"><Icon name="carSimple" size={17}/>
                  <select value={carSlug} onChange={e=>setCarSlug(e.target.value)} aria-label={t("f_car")}>
                    <option value="">{t("f_any")}</option>
                    {C.FLEET.map(v=> <option key={v.slug} value={v.slug}>{v.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="field">
                <label>{t("f_start")}</label>
                <div className="ctrl"><Icon name="calendar" size={17}/>
                  <input type="date" min={today} value={start} onChange={e=>setStart(e.target.value)} aria-label={t("f_start")}/>
                </div>
              </div>
              <div className="field">
                <label>{t("f_end")}</label>
                <div className="ctrl"><Icon name="calendar" size={17}/>
                  <input type="date" min={start||today} value={end} onChange={e=>setEnd(e.target.value)} aria-label={t("f_end")}/>
                </div>
              </div>
            </div>
            <div style={{padding:"0 30px 26px"}}>
              <button className="btn btn--red btn--block btn--lg" onClick={()=>onSearch({city,carSlug,start,end})}>
                <Icon name="search" size={18}/>{t("f_search")}
              </button>
            </div>
            <div className="search__steps">
              {["steps_1","steps_2","steps_3"].map((k,i)=>(
                <div className="search__step" key={k}><b>{String(i+1).padStart(2,"0")}.</b><span>{t(k)}</span></div>
              ))}
            </div>
          </div>
          <div className="trustbar">
            {trust.map(k=> <span key={k}><Icon name="checkCircle" size={18}/>{t(k)}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function CarCard({ v, lang, t, onSelect }) {
  const C = window.CUBA;
  const cat = C.CATEGORY[v.category][lang];
  return (
    <article className="car">
      <div className="car__media">
        <span className="car__cat">{cat}</span>
        {v.tags && <span className="car__tag">{v.tags[lang]}</span>}
        {v.img
          ? <img src={v.img} alt={v.name} loading="lazy"/>
          : <div className="car__ph"><span className="ph-icon"><Icon name={v.placeholder==="CLASSIC"?"car":"carSimple"} size={26}/></span><small>{v.name}</small></div>}
      </div>
      <div className="car__price"><b>${v.pricePerDay}</b><span>{t("per_day")}</span></div>
      <h3 className="car__name">{v.name}</h3>
      <div className="car__specs">
        <span className="car__spec"><Icon name="users" size={15}/>{v.seats} {t("seats")}</span>
        <span className="car__spec"><Icon name="gears" size={15}/>{t(v.transmission==="auto"?"t_auto":"t_manual")}</span>
        <span className="car__spec"><Icon name="fuel" size={15}/>{t("fuel_gas")}</span>
      </div>
      <button className="btn btn--navy btn--block car__cta" onClick={()=>onSelect(v)}><Icon name="whatsapp" size={17}/>{t("book")}</button>
    </article>
  );
}

function Fleet({ lang, t, onSelect }) {
  const ref = useReveal();
  const C = window.CUBA;
  return (
    <section className="section" id="flota" ref={ref}>
      <div className="container">
        <div className="sec-head reveal">
          <span className="eyebrow eyebrow--center">{t("fleet_eyebrow")}</span>
          <h2>{t("fleet_title")}</h2>
        </div>
        <div className="fleet-grid">
          {C.FLEET.map((v,i)=>(
            <div className="reveal" style={{transitionDelay:(i*70)+"ms"}} key={v.slug}>
              <CarCard v={v} lang={lang} t={t} onSelect={onSelect}/>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Advantages({ t }) {
  const ref = useReveal();
  const left = [["adv_1_t","adv_1_d","car"],["adv_2_t","adv_2_d","dollar"],["adv_3_t","adv_3_d","heart"]];
  const right = [["adv_4_t","adv_4_d","clock"],["adv_5_t","adv_5_d","shield"],["adv_6_t","adv_6_d","hotel"]];
  const Feat = ([tk,dk,ic]) => (
    <div className="feat" key={tk}>
      <span className="feat__ic"><Icon name={ic} size={22}/></span>
      <div><h4>{t(tk)}</h4><p>{t(dk)}</p></div>
    </div>
  );
  return (
    <section className="section section--soft" ref={ref}>
      <div className="container">
        <div className="sec-head reveal">
          <span className="eyebrow eyebrow--center">{t("adv_eyebrow")}</span>
          <h2>{t("adv_title")}</h2>
          <p>{t("adv_sub")}</p>
        </div>
        <div className="adv">
          <div className="adv__col reveal">{left.map(Feat)}</div>
          <div className="adv__art reveal"><img src="assets/img/car-silver.png" alt=""/></div>
          <div className="adv__col adv__col--right reveal">{right.map(Feat)}</div>
        </div>
      </div>
    </section>
  );
}

function Story({ lang, t, onBook }) {
  const ref = useReveal();
  return (
    <section className="section" id="nosotros" ref={ref}>
      <div className="container story">
        <div className="story__media reveal">
          <img className="story__building" src="assets/img/building.png" alt=""/>
          <img className="story__car" src="assets/img/car-orange.png" alt=""/>
          <div className="story__since"><small>{t("story_since")}</small><b>2010</b></div>
          <button className="story__play" aria-label="Play"><Icon name="play" size={24}/></button>
        </div>
        <div className="story__copy reveal">
          <span className="eyebrow">{t("story_eyebrow")}</span>
          <h2>{t("story_title")}</h2>
          <p className="story__p">{t("story_p")}</p>
          <ul className="story__list">
            {["story_1","story_2","story_3"].map(k=> <li key={k}><Icon name="checkCircle" size={20}/>{t(k)}</li>)}
          </ul>
          <button className="btn btn--red" onClick={onBook}>{t("read_more")}<Icon name="arrowRight" size={18}/></button>
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { useReveal, Header, Hero, CarCard, Fleet, Advantages, Story });
