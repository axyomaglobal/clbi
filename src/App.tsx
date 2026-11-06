import { Component, createRef, type FormEvent } from "react"

const navigation = [
  { label: "Propuesta", href: "#propuesta" },
  { label: "Soluciones", href: "#soluciones" },
  { label: "Servicios", href: "#servicios" },
  { label: "Por qué elegirnos", href: "#por-que-elegirnos" },
  { label: "Contacto", href: "#contacto" },
]

const revealGroups = [
  ".site-header .brand, .site-header .navigation__link, .menu-toggle",
  ".proposal h1, .proposal__lead, .proposal__body, .metric, .proposal .cta, .portrait-composition, .portrait-caption",
  ".partner-logos",
  ".solutions .section-heading > *, .solutions__image, .solution-card, .solutions__cta",
  ".services .section-heading > *, .services__image, .service-item",
  ".why .section-heading > *, .why__image, .reason-item",
  ".contact .section-heading > *, .contact__image, .form-field, .contact-form__footer",
  ".site-footer__horizontal > *, .site-footer__bottom",
]

class ScrollReveal extends Component {
  private observer?: IntersectionObserver
  private observerFrame?: number
  private elements: HTMLElement[] = []

  componentDidMount() {
    document.documentElement.classList.add("reveal-ready")

    this.elements = revealGroups.flatMap((selector) =>
      Array.from(document.querySelectorAll<HTMLElement>(selector)),
    )

    this.elements.forEach((element, index) => {
      element.classList.add("reveal-item")
      element.style.setProperty(
        "--reveal-delay",
        `${Math.min((index % 7) * 55, 330)}ms`,
      )
    })

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      this.elements.forEach((element) => element.classList.add("is-visible"))
      return
    }

    this.observerFrame = window.requestAnimationFrame(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return

            entry.target.classList.add("is-visible")
            this.observer?.unobserve(entry.target)
          })
        },
        {
          threshold: 0.08,
          rootMargin: "0px 0px -6% 0px",
        },
      )

      this.elements.forEach((element) => this.observer?.observe(element))
    })
  }

  componentWillUnmount() {
    if (this.observerFrame) {
      window.cancelAnimationFrame(this.observerFrame)
    }

    this.observer?.disconnect()
  }

  render() {
    return null
  }
}

function Brand() {
  return (
    <a className="brand" href="#propuesta" aria-label="CLBI, inicio">
      <span className="brand__mark">CLBI</span>
      <span className="brand__descriptor">Consultoría para empresas</span>
    </a>
  )
}

function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Brand />

        <nav
          className="navigation navigation--desktop"
          aria-label="Navegación principal"
        >
          {navigation.map((item) => (
            <a className="navigation__link" href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <details className="mobile-navigation">
          <summary className="menu-toggle" aria-label="Abrir o cerrar menú">
            <span />
            <span />
          </summary>
          <nav
            className="navigation navigation--mobile"
            aria-label="Menú móvil"
          >
            {navigation.map((item) => (
              <a
                className="navigation__link"
                href={item.href}
                key={item.href}
                onClick={(event) =>
                  event.currentTarget
                    .closest("details")
                    ?.removeAttribute("open")
                }
              >
                {item.label}
              </a>
            ))}
          </nav>
        </details>
      </div>
    </header>
  )
}

function ImageComposition() {
  return (
    <div className="portrait-composition" aria-label="Claudio Biolatto">
      <figure className="portrait portrait--primary">
        <img
          src="/images/propuesta-2.jpg"
          alt="Claudio Biolatto en su espacio de trabajo"
        />
      </figure>
      <span className="portrait-composition__accent" aria-hidden="true" />
      <p className="portrait-caption">Claudio Biolatto</p>
    </div>
  )
}

type AnimatedMetricProps = {
  target: number
  unit: string
  description: string
}

type AnimatedMetricState = {
  value: number
}

class AnimatedMetric extends Component<AnimatedMetricProps, AnimatedMetricState> {
  state: AnimatedMetricState = { value: 0 }
  private metricRef = createRef<HTMLParagraphElement>()
  private observer?: IntersectionObserver
  private animationTimer?: number
  private hasAnimated = false

  componentDidMount() {
    if (!("IntersectionObserver" in window)) {
      this.startAnimation()
      return
    }

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          this.startAnimation()
          this.observer?.disconnect()
        }
      },
      { threshold: 0.25 },
    )

    if (this.metricRef.current) {
      this.observer.observe(this.metricRef.current)
    } else {
      this.startAnimation()
    }
  }

  componentWillUnmount() {
    this.observer?.disconnect()

    if (this.animationTimer) {
      window.clearInterval(this.animationTimer)
    }
  }

  startAnimation = () => {
    if (this.hasAnimated) return
    this.hasAnimated = true

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.setState({ value: this.props.target })
      return
    }

    const totalSteps = 40
    let currentStep = 0

    this.animationTimer = window.setInterval(() => {
      currentStep += 1
      const progress = Math.min(currentStep / totalSteps, 1)
      const easedProgress = 1 - Math.pow(1 - progress, 3)

      this.setState({
        value: Math.round(this.props.target * easedProgress),
      })

      if (progress >= 1 && this.animationTimer) {
        window.clearInterval(this.animationTimer)
        this.animationTimer = undefined
      }
    }, 30)
  }

  render() {
    return (
      <p className="metric" ref={this.metricRef}>
        <span className="metric__headline">
          <span className="metric__number">+{this.state.value}</span>{" "}
          {this.props.unit}
        </span>
        <span className="metric__description">{this.props.description}</span>
      </p>
    )
  }
}

function Proposal() {
  return (
    <main>
      <section className="proposal" id="propuesta">
        <div className="proposal__inner">
          <div className="proposal__content">
            <h1>Tecnología que acompaña decisiones de tu empresa</h1>
            <p className="proposal__lead">
              Sistemas de gestión, infraestructura y seguridad informática, con
              un asesoramiento cercano y pensado para tu negocio.
            </p>
            <p className="proposal__body">
              Hace más de 20 años que acompañamos a empresas de la región a
              ordenar su gestión con tecnología. Más de 10 años de experiencia
              al frente del área de administración de una gran empresa. Por eso,
              cada propuesta entiende cómo trabaja tu empresa para elegir las
              herramientas adecuadas.
            </p>

            <div className="proposal__footer">
              <div className="metrics" aria-label="Experiencia">
                <AnimatedMetric
                  target={20}
                  unit="años"
                  description="acompañando empresas"
                />
                <AnimatedMetric
                  target={60}
                  unit="empresas"
                  description="confían en su trabajo"
                />
              </div>
              <a className="cta" href="#soluciones">
                <span>Conocer más</span>
              </a>
            </div>
          </div>

          <ImageComposition />
        </div>
      </section>
    </main>
  )
}

function PartnerLogos() {
  return (
    <div className="partner-logos" aria-label="Partners tecnológicos">
      <img
        className="partner-logos__image partner-logos__image--lenovo"
        src="/images/Lenovo360_Emblem_Authorized.webp"
        alt="Lenovo 360 Authorized"
      />
      <span className="partner-logos__divider" aria-hidden="true" />
      <img
        className="partner-logos__image partner-logos__image--eset"
        src="/images/logo-eset-vertical-color.webp"
        alt="ESET"
      />
    </div>
  )
}

const solutions = [
  {
    title: "Discovery Easy Soft",
    description:
      "Gestión integral de la empresa en un solo sistema: ventas, compras, stock y más.",
  },
  {
    title: "Exacta Easy Soft",
    description:
      "Contabilidad y administración para pymes y estudios contables.",
  },
  {
    title: "Salary Easy Soft",
    description: "Liquidación de sueldos y gestión del personal.",
  },
  {
    title: "App de Preventa",
    description:
      "Pedidos desde el celular para el equipo comercial, conectados con Discovery.",
  },
  {
    title: "BAS Laboro",
    description:
      "Gestión de recursos humanos: legajos, novedades y seguimiento del personal.",
  },
  {
    title: "ESET Digital Security",
    description:
      "Protección de equipos e información frente a virus, ransomware y otras amenazas.",
  },
]

const services = [
  {
    title: "Consultoría tecnológica",
    description:
      "Analizamos cómo trabaja tu empresa y armamos un plan a la medida de sus procesos.",
  },
  {
    title: "Infraestructura y redes",
    description:
      "Diseño, instalación y mantenimiento de redes de datos para oficinas y plantas.",
  },
  {
    title: "Servidores",
    description:
      "Puesta en marcha y administración de servidores y servicios tecnológicos.",
  },
  {
    title: "Ciberseguridad",
    description:
      "Protección de equipos, información y accesos, como partner autorizado de ESET.",
  },
  {
    title: "Soporte remoto",
    description:
      "Resolvemos problemas a distancia, rápido y sin necesidad de trasladar equipos.",
  },
  {
    title: "Capacitación",
    description:
      "Formamos a tu equipo para que saque el máximo provecho de cada sistema.",
  },
]

const reasons = [
  {
    title: "Trayectoria comprobable",
    description:
      "Más de 20 años implementando sistemas en empresas de distintos rubros.",
  },
  {
    title: "Acompañamiento completo",
    description: "Antes, durante y después de la implementación.",
  },
  {
    title: "Una sola mirada",
    description:
      "Gestión, infraestructura y seguridad resueltas por el mismo equipo.",
  },
  {
    title: "Respaldo de marcas líderes",
    description:
      "Distribuidor oficial de Buenos Aires Software y partner autorizado de ESET.",
  },
]

function Solutions() {
  return (
    <section className="solutions section-dark" id="soluciones">
      <div className="section-shell">
        <div className="section-heading section-heading--light">
          <h2>Un sistema para cada área de tu empresa.</h2>
          <p>
            Cada solución resuelve una parte de la gestión, y armamos la
            combinación que tu empresa necesita según su tamaño y su rubro.
          </p>
        </div>

        <div className="solutions__media">
          <figure className="solutions__image solutions__image--wide">
            <img
              src="/images/soluciones-de-gestion-1.jpg"
              alt="Claudio Biolatto asesorando a una empresa"
            />
          </figure>
          <figure className="solutions__image solutions__image--portrait">
            <img
              src="/images/soluciones-de-gestion-2.jpg"
              alt="Claudio Biolatto durante una reunión de trabajo"
            />
          </figure>
        </div>

        <div className="solutions__catalog">
          <div className="solutions__grid">
            {solutions.map((solution) => (
              <article className="solution-card" key={solution.title}>
                <h3>{solution.title}</h3>
                <p>{solution.description}</p>
              </article>
            ))}
          </div>
          <a className="cta solutions__cta" href="#contacto">
            <span>Quiero saber qué sistema necesito</span>
          </a>
        </div>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section className="services section-light" id="servicios">
      <div className="section-shell">
        <div className="section-heading">
          <h2>Servicios que optimizan la operación.</h2>
          <p>
            Nos ocupamos de la tecnología para que tu empresa pueda enfocarse en
            lo suyo.
          </p>
        </div>

        <div className="services__layout">
          <div className="services__media" aria-label="Servicios tecnológicos">
            <figure className="services__image services__image--main">
              <img
                src="/images/servicios-1.jpg"
                alt="Atención y soporte tecnológico personalizado"
              />
            </figure>
            <figure className="services__image services__image--detail">
              <img
                src="/images/servicios-2.jpg"
                alt="Herramientas de trabajo e infraestructura informática"
              />
            </figure>
            <figure className="services__image services__image--system">
              <img
                src="/images/servicios-3.jpg"
                alt="Implementación de sistemas de gestión"
              />
            </figure>
          </div>

          <div className="services__list">
            {services.map((service) => (
              <article className="service-item" key={service.title}>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function WhyChooseUs() {
  return (
    <section className="why section-dark" id="por-que-elegirnos">
      <div className="section-shell">
        <div className="section-heading section-heading--light">
          <h2>Experiencia en el negocio y en la tecnología.</h2>
          <p>
            Instalar un sistema es el primer paso. Lo importante es que funcione
            para tu empresa todos los días.
          </p>
        </div>

        <div className="why__layout">
          <div className="why__media">
            <figure className="why__image why__image--portrait">
              <img
                src="/images/DSC01026.webp"
                alt="Claudio Biolatto trabajando junto a sus clientes"
              />
            </figure>
            <figure className="why__image why__image--detail">
              <img
                src="/images/porque-elegirnos-2.jpg"
                alt="Análisis cercano de la gestión de una empresa"
              />
            </figure>
          </div>

          <div className="why__reasons">
            {reasons.map((reason) => (
              <article className="reason-item" key={reason.title}>
                <h3>{reason.title}</h3>
                <p>{reason.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

type ContactFormState = {
  status: "idle" | "sending" | "success"
}

class ContactForm extends Component<Record<string, never>, ContactFormState> {
  state: ContactFormState = { status: "idle" }
  private formRef = createRef<HTMLFormElement>()
  private submissionTimer?: number

  componentWillUnmount() {
    if (this.submissionTimer) {
      window.clearTimeout(this.submissionTimer)
    }
  }

  handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity()
      return
    }

    this.setState({ status: "sending" })
    this.submissionTimer = window.setTimeout(() => {
      this.formRef.current?.reset()
      this.setState({ status: "success" })
    }, 900)
  }

  handleInput = () => {
    if (this.state.status === "success") {
      this.setState({ status: "idle" })
    }
  }

  render() {
    const isSending = this.state.status === "sending"

    return (
      <form
        className="contact-form"
        ref={this.formRef}
        onSubmit={this.handleSubmit}
        onInput={this.handleInput}
      >
        <div className="form-field">
          <label htmlFor="name-company">Nombre y empresa</label>
          <input
            id="name-company"
            name="nameCompany"
            type="text"
            autoComplete="organization-title"
            required
            disabled={isSending}
          />
        </div>

        <div className="form-field">
          <label htmlFor="contact-detail">Teléfono o email</label>
          <input
            id="contact-detail"
            name="contactDetail"
            type="text"
            autoComplete="email"
            required
            disabled={isSending}
          />
        </div>

        <div className="form-field">
          <label htmlFor="help-topic">¿En qué podemos ayudarte?</label>
          <select
            id="help-topic"
            name="helpTopic"
            defaultValue=""
            required
            disabled={isSending}
          >
            <option value="" disabled>
              Seleccionar
            </option>
            <option value="sistemas-de-gestion">Sistemas de gestión</option>
            <option value="infraestructura-y-redes">
              Infraestructura y redes
            </option>
            <option value="ciberseguridad">Ciberseguridad</option>
            <option value="soporte-tecnico">Soporte técnico</option>
            <option value="otra-consulta">Otra consulta</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="message">Mensaje</label>
          <textarea id="message" name="message" required disabled={isSending} />
        </div>

        <div className="contact-form__footer">
          <button
            className="contact-form__submit"
            type="submit"
            disabled={isSending}
          >
            <span>{isSending ? "Enviando..." : "Enviar consulta"}</span>
          </button>
          <p className="contact-form__status" aria-live="polite" role="status">
            {this.state.status === "success"
              ? "Gracias. Tu consulta fue enviada correctamente."
              : ""}
          </p>
        </div>
      </form>
    )
  }
}

function Contact() {
  return (
    <section className="contact section-light" id="contacto">
      <div className="section-shell">
        <div className="section-heading">
          <h2>Hablemos de tu empresa.</h2>
          <p>
            Contanos qué necesitás mejorar y buscamos juntos la solución
            tecnológica adecuada.
          </p>
        </div>

        <div className="contact__layout">
          <div className="contact__visual">
            <figure className="contact__image">
              <img
                src="/images/contacto.jpg"
                alt="Claudio Biolatto disponible para conversar sobre tu empresa"
              />
            </figure>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__horizontal">
          <nav className="footer-navigation" aria-label="Navegación del pie">
            {navigation.map((item) => (
              <a href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="site-footer__brand">
            <Brand />
          </div>

          <div className="site-footer__social">
            <div className="site-footer__icons">
              <a
                href="https://wa.me/5493415633240"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.5 4.1 1.6 5.9L.2 24l6.5-1.7a11.8 11.8 0 0 0 5.4 1.4c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.1-3.4-8.4Zm-8.4 18.2c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a9.7 9.7 0 1 1 8.4 4.7Zm5.3-7.3c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-1.7-.8-2.8-1.5-3.9-3.4-.3-.5.3-.5.8-1.6.1-.2 0-.4 0-.6l-.9-2.1c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.8.4-.3.3-1.1 1.1-1.1 2.7s1.2 3.1 1.3 3.3c.2.2 2.3 3.5 5.6 4.9 2.1.9 2.9 1 4 .8.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4Z" />
                </svg>
              </a>
              <span aria-label="Mail pendiente">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 5h18v14H3V5Zm1.8 2 7.2 5 7.2-5H4.8ZM19 17V9.4l-7 4.9-7-4.9V17h14Z" />
                </svg>
              </span>
              <a
                href="https://www.linkedin.com/in/claudio-biolatto-ba08712b7?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4.8 3A2.8 2.8 0 1 1 4.8 8.6 2.8 2.8 0 0 1 4.8 3ZM2.4 10.3h4.8V22H2.4V10.3Zm7.8 0h4.6v1.6h.1c.6-1.2 2.2-2.4 4.5-2.4 4.8 0 5.7 3.2 5.7 7.3V22h-4.8v-4.6c0-1.1 0-3.5-2.2-3.5s-2.5 1.7-2.5 3.4V22h-4.8V10.3h-.6Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>
            Desarrollado por{" "}
            <a
              href="https://axyomadigital.com/"
              target="_blank"
              rel="noreferrer"
            >
              Axyoma
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <ScrollReveal />
      <Header />
      <Proposal />
      <PartnerLogos />
      <Solutions />
      <Services />
      <WhyChooseUs />
      <Contact />
      <Footer />
    </>
  )
}
