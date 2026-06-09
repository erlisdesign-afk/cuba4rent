/* Cuba4Rent — Secciones 2: Logos, Servicios, Promos, Cómo funciona, Freedom, Testimonios, Blog, CTA, Footer */

function Logos() {
  const names = ["Cubatur","Havanatur","Gaviota","Iberostar","Meliá"];
  return (
    <div className="logos">
      <div className="container logos__in">
        {names.map(n=>(
          <span className="logos__item" key={n}><Icon name="globe" size={24}/>{n}</span>
        ))}
      </div>
    </div>
  );
}

function Services({ t }) {
  const ref = useReveal();
  const items = [["serv_1_t","serv_1_d","route"],["serv_2_t","serv_2_d","plane"],["serv_3_t","serv_3_d","briefcase"],["serv_4_t","serv_4_d","steering"]];
  return (
    <section className="section" id="servicios" ref={ref}>
      <div className="container">
        <div className="sec-head reveal">
          <span className="eyebrow eyebrow--center">{t("serv_eyebrow")}</span>
          <h2>{t("serv_title")}</h2>
        </div>
        <div className="serv-grid">
          {items.map(([tk,dk,ic],i)=>(
            <div className="serv reveal" style={{transitionDelay:(i*70)+"ms"}} key={tk}>
              <span className="serv__ic"><Icon name={ic} size={28}/></span>
              <h4>{t(tk)}</h4>
              <p>{t(dk)}</p>
              <span className="serv__arrow"><Icon name="arrowUpRight" size={18}/></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Promos({ t, onBook }) {
  const ref = useReveal();
  return (
    <section className="section" style={{paddingTop:0}} ref={ref}>
      <div className="container promos">
        <div className="promo promo--red reveal">
          <div className="promo__body">
            <h3>{t("promo_cars_t")}</h3>
            <p>{t("promo_cars_d")}</p>
          </div>
          <button className="btn btn--ghost" onClick={()=>document.getElementById("flota")?.scrollIntoView()}><Icon name="carSimple" size={18}/>{t("promo_cars_cta")}</button>
        </div>
        <div className="promo promo--img reveal">
          <img src="assets/img/mountain-road.jpg" alt=""/>
          <div className="promo__body">
            <h3>{t("promo_book_t")}</h3>
            <p>{t("promo_book_d")}</p>
          </div>
          <button className="btn btn--red" onClick={onBook}><Icon name="whatsapp" size={18}/>{t("book_now")}</button>
        </div>
      </div>
    </section>
  );
}

function How({ t }) {
  const ref = useReveal();
  const [open, setOpen] = useState(0);
  const steps = [["how_1_t","how_1_d"],["how_2_t","how_2_d"],["how_3_t","how_3_d"]];
  return (
    <section className="section section--soft" ref={ref}>
      <div className="container how">
        <div className="reveal">
          <span className="eyebrow">{t("how_eyebrow")}</span>
          <h2 style={{fontSize:"clamp(26px,3.4vw,40px)",margin:"14px 0 6px"}}>{t("how_title")}</h2>
          <div className="acc">
            {steps.map(([tk,dk],i)=>(
              <div className={"acc__item"+(open===i?" is-open":"")} key={tk}>
                <button className="acc__head" onClick={()=>setOpen(open===i?-1:i)} aria-expanded={open===i}>
                  <span className="acc__num">{String(i+1).padStart(2,"0")}</span>
                  <span className="acc__title">{t(tk)}</span>
                  <span className="acc__chev"><Icon name="chevronDown" size={16}/></span>
                </button>
                <div className="acc__body" style={{maxHeight:open===i?160:0}}><p>{t(dk)}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="how__media reveal">
          <img src="assets/img/woman-redcar.jpg" alt=""/>
          <div className="how__badge"><b>24/7</b><span>{t("support_24")}</span></div>
        </div>
      </div>
    </section>
  );
}

function Freedom({ t }) {
  return (
    <section className="freedom">
      <img src="assets/img/woman-driving.jpg" alt=""/>
      <div className="freedom__in">
        <span className="eyebrow eyebrow--center">{t("free_eyebrow")}</span>
        <h2>{t("free_title")}</h2>
        <button className="freedom__play" aria-label="Play"><Icon name="play" size={26}/></button>
      </div>
    </section>
  );
}

const TST = [
  { es:"Reservé un clásico para mi luna de miel en La Habana. El agente confirmó por WhatsApp en 10 minutos y el auto estaba impecable.", en:"I booked a classic for my honeymoon in Havana. The agent confirmed via WhatsApp in 10 minutes and the car was spotless.", name:"María Fernández", role:{es:"Turista · España",en:"Tourist · Spain"} },
  { es:"Vivo en Miami y renté para mi familia en Varadero. Sin pago anticipado, todo claro y entregado en el hotel. Repetiré.", en:"I live in Miami and rented for my family in Varadero. No prepayment, all clear and delivered to the hotel. Will repeat.", name:"Yoandry Pérez", role:{es:"Diáspora · EE.UU.",en:"Diaspora · USA"} },
  { es:"El proceso fue increíblemente simple: elegí el auto, puse mis fechas y listo. Atención en inglés perfecta.", en:"The process was incredibly simple: I picked the car, set my dates and done. Perfect English support.", name:"Sarah Johnson", role:{es:"Turista · Canadá",en:"Tourist · Canada"} },
];
function Testimonials({ lang, t }) {
  const ref = useReveal();
  return (
    <section className="section" ref={ref}>
      <div className="container">
        <div className="sec-head reveal">
          <span className="eyebrow eyebrow--center">{t("tst_eyebrow")}</span>
          <h2>{t("tst_title")}</h2>
        </div>
        <div className="tst-grid">
          {TST.map((x,i)=>(
            <div className="tst reveal" style={{transitionDelay:(i*80)+"ms"}} key={i}>
              <span className="tst__quote">&ldquo;</span>
              <div className="tst__stars">{[0,1,2,3,4].map(s=> <Icon key={s} name="star" size={17}/>)}</div>
              <p className="tst__text">{x[lang]}</p>
              <div className="tst__person">
                <span className="tst__avatar">{x.name.split(" ").map(w=>w[0]).slice(0,2).join("")}</span>
                <div><b>{x.name}</b><span>{x.role[lang]}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const POSTS = [
  { img:"assets/img/convertible.png", d:"07", m:{es:"Jul",en:"Jul"}, cat:{es:"Guía de viaje",en:"Travel guide"},
    t:{es:"Conducir en Cuba: todo lo que un turista debe saber",en:"Driving in Cuba: all a tourist should know"} },
  { img:"assets/img/mountain-road.jpg", d:"21", m:{es:"Jun",en:"Jun"}, cat:{es:"Rutas",en:"Routes"},
    t:{es:"La ruta de Viñales a Trinidad en 5 días",en:"The Viñales to Trinidad route in 5 days"} },
  { img:"assets/img/woman-redcar.jpg", d:"03", m:{es:"Jun",en:"Jun"}, cat:{es:"Consejos",en:"Tips"},
    t:{es:"Recogida en el aeropuerto: cómo funciona paso a paso",en:"Airport pickup: how it works step by step"} },
];
function Blog({ lang, t }) {
  const ref = useReveal();
  return (
    <section className="section section--soft" ref={ref}>
      <div className="container">
        <div className="sec-head reveal">
          <span className="eyebrow eyebrow--center">{t("blog_eyebrow")}</span>
          <h2>{t("blog_title")}</h2>
        </div>
        <div className="blog-grid">
          {POSTS.map((p,i)=>(
            <a className="post reveal" href="#" style={{transitionDelay:(i*80)+"ms"}} key={i}>
              <div className="post__media">
                <img src={p.img} alt=""/>
                <div className="post__date"><b>{p.d}</b><span>{p.m[lang]}</span></div>
              </div>
              <div className="post__body">
                <span className="post__cat">{p.cat[lang]}</span>
                <h4>{p.t[lang]}</h4>
                <span className="post__link">{t("learn_more")}<Icon name="arrowRight" size={15}/></span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function BigCTA({ t, onBook }) {
  const C = window.CUBA;
  return (
    <section className="bigcta">
      <img src="assets/img/blackcar.jpg" alt=""/>
      <div className="bigcta__in">
        <h2>{t("cta_title")}</h2>
        <p>{t("cta_sub")}</p>
        <div className="bigcta__btns">
          <button className="btn btn--red btn--lg" onClick={onBook}><Icon name="whatsapp" size={19}/>{t("book_now")}</button>
          <a className="btn btn--outline-white btn--lg" href={C.waPlain()} target="_blank" rel="noopener"><Icon name="phone" size={18}/>{t("contact_us")}</a>
        </div>
      </div>
    </section>
  );
}

function Footer({ lang, t }) {
  const C = window.CUBA;
  const links = [["nav_home","#top"],["nav_fleet","#flota"],["nav_services","#servicios"],["nav_about","#nosotros"],["nav_contact","#contacto"]];
  const servs = ["serv_1_t","serv_2_t","serv_3_t","serv_4_t","rent_driver"];
  return (
    <footer className="footer" id="contacto">
      <div className="news">
        <div className="container news__in">
          <div className="news__txt"><b>{t("foot_news_t")}</b><span>{t("foot_news_d")}</span></div>
          <form className="news__form" onSubmit={e=>e.preventDefault()}>
            <input type="email" placeholder={t("foot_email_ph")} aria-label={t("foot_email_ph")}/>
            <button className="btn btn--red" type="submit">{t("subscribe")}</button>
          </form>
        </div>
      </div>
      <div className="container footer__cols">
        <div className="footer__brand">
          <span className="brand"><span className="brand__mark"><Icon name="carSimple" size={22}/></span>Cuba<b>4</b>Rent</span>
          <p className="footer__about">{t("foot_about")}</p>
          <div className="footer__socials">
            {[["facebook"],["instagram"],["xsocial"],["youtube"]].map(([n])=> <a key={n} href="#" aria-label={n}><Icon name={n} size={17}/></a>)}
          </div>
        </div>
        <div>
          <h5>{t("foot_links")}</h5>
          <ul className="footer__list">{links.map(([k,h])=> <li key={k}><a href={h}>{t(k)}</a></li>)}</ul>
        </div>
        <div>
          <h5>{t("foot_services")}</h5>
          <ul className="footer__list">{servs.map(k=> <li key={k}><a href="#servicios">{t(k)}</a></li>)}</ul>
        </div>
        <div>
          <h5>{t("foot_contact")}</h5>
          <ul className="footer__list footer__contact">
            <li><Icon name="mapPin" size={17}/>Calle 23, Vedado, La Habana, Cuba</li>
            <li><Icon name="whatsapp" size={17}/><a href={C.waPlain()} target="_blank" rel="noopener">+1 786 729 7674</a></li>
            <li><Icon name="mail" size={17}/><a href="mailto:hola@cuba4rent.com">hola@cuba4rent.com</a></li>
            <li><Icon name="clock" size={17}/>{t("foot_hours")}</li>
          </ul>
        </div>
      </div>
      <div className="container footer__bar">
        <span>© {new Date().getFullYear()} Cuba4Rent. {t("rights")}</span>
        <div className="footer__bar-links"><a href="#">{t("privacy")}</a><a href="#">{t("terms")}</a></div>
      </div>
    </footer>
  );
}
Object.assign(window, { Logos, Services, Promos, How, Freedom, Testimonials, Blog, BigCTA, Footer });
