"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type LandingPageProps = {
  country: string;
  offerValue: string;
  offerCurrency: string;
  offerEndDate: string;
  campaignUrl: string;
  termsUrl: string;
  requestedCountryIsValid: boolean;
};

type Copy = {
  countryName: string;
  amazon: string;
  locale: string;
  exclusive: string;
  eyebrow: string;
  headline: string;
  lede: string;
  primaryCta: string;
  ctaNote: string;
  trust: string[];
  howTitle: string;
  howIntro: string;
  steps: { title: string; body: string }[];
  valueEyebrow: string;
  valueTitle: string;
  valueBody: string;
  valuePoints: string[];
  safetyTitle: string;
  safetyBody: string;
  safetyCards: { title: string; body: string }[];
  faqTitle: string;
  faqIntro: string;
  faqs: { question: string; answer: string }[];
  finalTitle: string;
  finalBody: string;
  terms: string;
  legal: string;
  modalKicker: string;
  modalTitle: string;
  modalIntro: string;
  modalPoints: string[];
  security: string;
  continueLabel: string;
  openingLabel: string;
  notNow: string;
  close: string;
  unavailableTitle: string;
  unavailableBody: string;
};

const marketMeta: Record<string, { countryName: string; amazon: string; locale: string; domain: string; currency: string }> = {
  UK: { countryName: "the United Kingdom", amazon: "Amazon.co.uk", locale: "en-GB", domain: "amazon.co.uk", currency: "GBP" },
  US: { countryName: "the United States", amazon: "Amazon.com", locale: "en-US", domain: "amazon.com", currency: "USD" },
  DE: { countryName: "Deutschland", amazon: "Amazon.de", locale: "de-DE", domain: "amazon.de", currency: "EUR" },
  CA: { countryName: "Canada", amazon: "Amazon.ca", locale: "en-CA", domain: "amazon.ca", currency: "CAD" },
  JP: { countryName: "日本", amazon: "Amazon.co.jp", locale: "ja-JP", domain: "amazon.co.jp", currency: "JPY" },
  ES: { countryName: "España", amazon: "Amazon.es", locale: "es-ES", domain: "amazon.es", currency: "EUR" },
  IT: { countryName: "Italia", amazon: "Amazon.it", locale: "it-IT", domain: "amazon.it", currency: "EUR" },
};

function formatOffer(value: string, currency: string, locale: string) {
  const amount = Number(value.replace(/,/g, ""));
  if (Number.isNaN(amount)) return value;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : Number.isInteger(amount) ? 0 : 2,
  }).format(amount).replace("CA$", "$") + (currency === "CAD" ? " CAD" : "");
}

function formatStartingOffer(country: string, offer: string) {
  if (country === "DE") return `Ab ${offer}`;
  if (country === "JP") return `${offer}から`;
  if (country === "ES") return `Desde ${offer}`;
  if (country === "IT") return `Da ${offer}`;
  return `From ${offer}`;
}

function formatEndDate(value: string, locale: string) {
  if (!value) return "";
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(date);
}

function buildCopy(country: string, offer: string, endDate: string): Copy {
  const market = marketMeta[country];
  const end = formatEndDate(endDate, market.locale);

  if (country === "DE") {
    return {
      ...market,
      exclusive: "Exklusives Angebot für berechtigte Prime-Mitglieder",
      eyebrow: "Prime-Mitgliederangebot",
      headline: `Hol dir einen KFC-Gutschein ab ${offer} mit Prime.`,
      lede: `Berechtigte Prime-Mitglieder in Deutschland können sich bei ${market.amazon} anmelden, ihre Teilnahmeberechtigung prüfen und das Angebot in Anspruch nehmen.`,
      primaryCta: "Angebot ansehen",
      ctaNote: `Du siehst zuerst alle Details und wirst anschließend sicher zu ${market.amazon} weitergeleitet.`,
      trust: ["Für berechtigte Prime-Mitglieder", "Angebot für Deutschland", "Einlösung über Amazon"],
      howTitle: "So funktioniert das Angebot",
      howIntro: "Drei kurze Schritte. Deine Amazon-Anmeldedaten bleiben bei Amazon.",
      steps: [
        { title: "Angebot prüfen", body: "Informiere dich über Vorteil, Markt und Teilnahmebedingungen." },
        { title: "Zu Amazon wechseln", body: `Öffne die offizielle Angebotsseite bei ${market.amazon}.` },
        { title: "Anmelden und Berechtigung prüfen", body: "Amazon bestätigt die Berechtigung und zeigt die Einlösehinweise." },
      ],
      valueEyebrow: "Prime × KFC Vorteil",
      valueTitle: `KFC-Vorteile ab ${offer}`,
      valueBody: "Ein unkomplizierter Vorteil für berechtigte Prime-Mitglieder, abschließend geprüft durch Amazon.",
      valuePoints: [`KFC-Gutschein ab ${offer}`, "Für berechtigte Prime-Mitglieder in Deutschland", `Berechtigungsprüfung bei ${market.amazon}`],
      safetyTitle: "Klar, sicher und ohne Umwege",
      safetyBody: "Diese Seite stellt das Angebot vor. Anmeldung, Berechtigungsprüfung und Einlösehinweise erfolgen ausschließlich bei Amazon.",
      safetyCards: [
        { title: "Keine Zahlung auf dieser Seite", body: "Hier werden keine Zahlungsdaten abgefragt." },
        { title: "Kein Amazon-Passwort", body: "Amazon-Zugangsdaten werden hier niemals erfasst." },
        { title: "Prüfung durch Amazon", body: "Amazon bestätigt die endgültige Teilnahmeberechtigung." },
        { title: "Bedingungen gelten", body: "Verfügbarkeit und Aktionsbedingungen können gelten." },
      ],
      faqTitle: "Häufige Fragen",
      faqIntro: "Das Wichtigste vor der Weiterleitung zu Amazon.",
      faqs: [
        { question: "Wer kann teilnehmen?", answer: `Das Angebot richtet sich an berechtigte Prime-Mitglieder in Deutschland. Melde dich bei ${market.amazon} an, um deine Berechtigung zu prüfen.` },
        { question: "Löse ich den Gutschein auf dieser Seite ein?", answer: `Nein. Nach den Angebotsdetails wirst du zu ${market.amazon} weitergeleitet. Dort erfolgt die Anmeldung und Einlösung.` },
        { question: "Wird hier mein Amazon-Passwort abgefragt?", answer: "Nein. Diese Seite erfasst keine Amazon-Anmeldedaten." },
        { question: "Wie verwende ich den KFC-Gutschein?", answer: "Amazon zeigt die Einlösehinweise und geltenden Bedingungen nach der Berechtigungsprüfung an." },
        { question: "Wann endet das Angebot?", answer: end ? `Das Angebot endet am ${end}, vorbehaltlich Verfügbarkeit und offizieller Bedingungen.` : "Das Enddatum findest du in den offiziellen Angebotsbedingungen." },
      ],
      finalTitle: "Bereit, dein Prime-Angebot zu prüfen?",
      finalBody: "Sieh dir die Details an und wechsle anschließend sicher zu Amazon.",
      terms: "Aktionsbedingungen",
      legal: "Zeitlich begrenztes Angebot. Teilnahmeberechtigung, Verfügbarkeit und Bedingungen gelten.",
      modalKicker: "Prime × KFC Angebot",
      modalTitle: `Dein KFC-Angebot ab ${offer}`,
      modalIntro: "Prüfe die wichtigsten Informationen, bevor du zu Amazon wechselst.",
      modalPoints: ["Für berechtigte Prime-Mitglieder in Deutschland", `Verfügbar für qualifizierte ${market.amazon}-Konten`, "Anmeldung bei Amazon zur Berechtigungsprüfung", "Verfügbarkeit und Bedingungen gelten"],
      security: `Anmeldung und Einlösung erfolgen sicher bei ${market.amazon}. Diese Seite erfasst dein Amazon-Passwort nicht.`,
      continueLabel: `Weiter zu ${market.amazon}`,
      openingLabel: `${market.amazon} wird geöffnet…`,
      notNow: "Jetzt nicht",
      close: "Schließen",
      unavailableTitle: "Das Angebot ist vorübergehend nicht verfügbar",
      unavailableBody: "Die Kampagnenkonfiguration konnte nicht bestätigt werden. Bitte versuche es später erneut.",
    };
  }

  if (country === "JP") {
    return {
      ...market,
      exclusive: "対象のPrime会員限定オファー",
      eyebrow: "Prime会員限定",
      headline: `Primeで${offer}からのKFCクーポンを。`,
      lede: `日本の対象Prime会員は、${market.amazon}にサインインして対象条件を確認し、期間限定オファーを利用できます。`,
      primaryCta: "オファー詳細を見る",
      ctaNote: `詳細を確認した後、安全に${market.amazon}へ移動します。`,
      trust: ["対象のPrime会員限定", "日本向けオファー", "Amazonで受け取り"],
      howTitle: "受け取り方法",
      howIntro: "Amazonのログイン情報をこのページで入力する必要はありません。",
      steps: [
        { title: "オファーを確認", body: "特典内容と対象条件を確認します。" },
        { title: "Amazonへ移動", body: `${market.amazon}の公式ページを開きます。` },
        { title: "サインインして対象確認", body: "Amazonが対象条件を確認し、利用方法をご案内します。" },
      ],
      valueEyebrow: "Prime × KFC 特典",
      valueTitle: `次回のKFC注文に使える${offer}からのクーポン`,
      valueBody: "対象のPrime会員向けのシンプルな特典です。最終確認はAmazonで行われます。",
      valuePoints: [`KFC ${offer}からのクーポン`, "日本の対象Prime会員向け", `${market.amazon}で対象条件を確認`],
      safetyTitle: "安心して確認できます",
      safetyBody: "このページはオファーをご案内するものです。サインイン、対象確認、利用案内はAmazonで行われます。",
      safetyCards: [
        { title: "このページで支払い不要", body: "支払い情報の入力は求めません。" },
        { title: "Amazonパスワード不要", body: "Amazonのログイン情報は収集しません。" },
        { title: "Amazonが対象確認", body: "最終的な対象条件はAmazonが確認します。" },
        { title: "条件が適用されます", body: "在庫状況や利用条件が適用される場合があります。" },
      ],
      faqTitle: "よくある質問",
      faqIntro: "Amazonへ移動する前にご確認ください。",
      faqs: [
        { question: "誰が対象ですか？", answer: `日本の対象Prime会員向けです。${market.amazon}にサインインして対象条件をご確認ください。` },
        { question: "このページでクーポンを受け取りますか？", answer: `いいえ。詳細確認後、${market.amazon}でサインインして受け取り手続きを行います。` },
        { question: "Amazonのパスワード入力は必要ですか？", answer: "いいえ。このページでAmazonのログイン情報を入力することはありません。" },
        { question: "KFCクーポンはどう使いますか？", answer: "対象確認後、Amazonで利用方法と適用条件が表示されます。" },
        { question: "オファーはいつまでですか？", answer: end ? `オファーは${end}までです。在庫状況と公式条件が適用されます。` : "終了日は公式オファー条件をご確認ください。" },
      ],
      finalTitle: "Primeオファーを確認しますか？",
      finalBody: "詳細を確認してから、安全にAmazonへ移動できます。",
      terms: "利用条件",
      legal: "期間限定オファーです。対象条件、在庫状況、利用条件が適用されます。",
      modalKicker: "Prime × KFC オファー",
      modalTitle: `KFC ${offer}からのオファー`,
      modalIntro: "Amazonへ移動する前に、特典内容と対象条件をご確認ください。",
      modalPoints: ["日本の対象Prime会員向け", `対象の${market.amazon}アカウントで利用可能`, "Amazonにサインインして対象条件を確認", "在庫状況と利用条件が適用されます"],
      security: `サインインと受け取りは${market.amazon}で安全に行われます。このページはAmazonのパスワードを収集しません。`,
      continueLabel: `${market.amazon}へ進む`,
      openingLabel: `${market.amazon}を開いています…`,
      notNow: "今はしない",
      close: "閉じる",
      unavailableTitle: "現在オファーを表示できません",
      unavailableBody: "キャンペーン設定を確認できませんでした。時間をおいて再度お試しください。",
    };
  }

  if (country === "ES") {
    return {
      ...market,
      exclusive: "Oferta exclusiva para miembros Prime que cumplan los requisitos",
      eyebrow: "Oferta para miembros Prime",
      headline: `Consigue un cupón KFC desde ${offer} con Prime.`,
      lede: `Los miembros Prime de España que cumplan los requisitos pueden iniciar sesión en ${market.amazon}, comprobar su elegibilidad y acceder a esta oferta por tiempo limitado.`,
      primaryCta: "Ver oferta",
      ctaNote: `Primero verás los detalles y después continuarás de forma segura a ${market.amazon}.`,
      trust: ["Para miembros Prime elegibles", "Oferta para España", "Canje en Amazon"],
      howTitle: "Cómo conseguir la oferta",
      howIntro: "Tres pasos sencillos. Tus credenciales de Amazon permanecen en Amazon.",
      steps: [
        { title: "Revisa la oferta", body: "Consulta la ventaja y los requisitos aplicables." },
        { title: "Continúa a Amazon", body: `Abre la página oficial de la oferta en ${market.amazon}.` },
        { title: "Inicia sesión y comprueba", body: "Amazon confirmará la elegibilidad y mostrará las instrucciones de canje." },
      ],
      valueEyebrow: "Ventaja Prime × KFC",
      valueTitle: `Ventajas KFC desde ${offer}`,
      valueBody: "Una ventaja sencilla para miembros Prime elegibles, con confirmación final en Amazon.",
      valuePoints: [`Cupón KFC desde ${offer}`, "Para miembros Prime elegibles en España", `Elegibilidad confirmada en ${market.amazon}`],
      safetyTitle: "Claro y seguro",
      safetyBody: "Esta página presenta la promoción. El inicio de sesión, la confirmación y las instrucciones de canje se realizan en Amazon.",
      safetyCards: [
        { title: "Sin pagos en esta página", body: "No solicitamos datos de pago." },
        { title: "Sin contraseña de Amazon", body: "Nunca recopilamos tus credenciales de Amazon." },
        { title: "Confirmación de Amazon", body: "Amazon confirma la elegibilidad final." },
        { title: "Sujeto a condiciones", body: "Se aplican disponibilidad y condiciones de la oferta." },
      ],
      faqTitle: "Preguntas frecuentes",
      faqIntro: "Lo esencial antes de continuar a Amazon.",
      faqs: [
        { question: "¿Quién puede acceder a la oferta?", answer: `Está dirigida a miembros Prime elegibles en España. Inicia sesión en ${market.amazon} para comprobar tu elegibilidad.` },
        { question: "¿Canjeo el cupón en esta página?", answer: `No. Tras revisar los detalles, continuarás a ${market.amazon} para iniciar sesión y completar el proceso.` },
        { question: "¿Esta página pide mi contraseña de Amazon?", answer: "No. Esta página promocional no recopila credenciales de Amazon." },
        { question: "¿Cómo uso el cupón KFC?", answer: "Amazon mostrará las instrucciones de canje y las condiciones aplicables tras confirmar la elegibilidad." },
        { question: "¿Cuándo termina la oferta?", answer: end ? `La oferta termina el ${end}, sujeta a disponibilidad y a las condiciones oficiales.` : "Consulta la fecha de finalización en las condiciones oficiales." },
      ],
      finalTitle: "¿Quieres comprobar tu oferta Prime?",
      finalBody: "Revisa los detalles y continúa de forma segura a Amazon.",
      terms: "Términos y condiciones",
      legal: "Oferta por tiempo limitado. Se aplican requisitos, disponibilidad y condiciones.",
      modalKicker: "Oferta Prime × KFC",
      modalTitle: `Tu oferta KFC desde ${offer}`,
      modalIntro: "Comprueba los detalles principales antes de continuar a Amazon.",
      modalPoints: ["Para miembros Prime elegibles en España", `Disponible para cuentas de ${market.amazon} que cumplan los requisitos`, "Inicia sesión en Amazon para comprobar la elegibilidad", "Se aplican disponibilidad y condiciones"],
      security: `El inicio de sesión y el canje se realizan de forma segura en ${market.amazon}. Esta página no recopila tu contraseña de Amazon.`,
      continueLabel: `Continuar a ${market.amazon}`,
      openingLabel: `Abriendo ${market.amazon}…`,
      notNow: "Ahora no",
      close: "Cerrar",
      unavailableTitle: "La oferta no está disponible ahora",
      unavailableBody: "No hemos podido confirmar la configuración de la campaña. Inténtalo de nuevo más tarde.",
    };
  }

  if (country === "IT") {
    return {
      ...market,
      exclusive: "Offerta esclusiva per i membri Prime idonei",
      eyebrow: "Offerta per i membri Prime",
      headline: `Ottieni un buono KFC a partire da ${offer} con Prime.`,
      lede: `I membri Prime idonei in Italia possono accedere a ${market.amazon}, verificare l’idoneità e richiedere questa offerta a tempo limitato.`,
      primaryCta: "Scopri l’offerta",
      ctaNote: `Prima vedrai tutti i dettagli, poi potrai continuare in sicurezza su ${market.amazon}.`,
      trust: ["Per membri Prime idonei", "Offerta per l’Italia", "Riscatto su Amazon"],
      howTitle: "Come richiedere l’offerta",
      howIntro: "Tre semplici passaggi. Le tue credenziali Amazon restano su Amazon.",
      steps: [
        { title: "Controlla l’offerta", body: "Leggi il vantaggio e i requisiti applicabili." },
        { title: "Continua su Amazon", body: `Apri la pagina ufficiale dell’offerta su ${market.amazon}.` },
        { title: "Accedi e verifica", body: "Amazon confermerà l’idoneità e mostrerà le istruzioni per il riscatto." },
      ],
      valueEyebrow: "Vantaggio Prime × KFC",
      valueTitle: `Vantaggi KFC a partire da ${offer}`,
      valueBody: "Un vantaggio semplice per i membri Prime idonei, con conferma finale su Amazon.",
      valuePoints: [`Buono KFC a partire da ${offer}`, "Per membri Prime idonei in Italia", `Idoneità confermata su ${market.amazon}`],
      safetyTitle: "Chiaro e sicuro",
      safetyBody: "Questa pagina presenta la promozione. Accesso, verifica e istruzioni di riscatto vengono gestiti da Amazon.",
      safetyCards: [
        { title: "Nessun pagamento qui", body: "Non chiediamo dati di pagamento." },
        { title: "Nessuna password Amazon", body: "Non raccogliamo mai le credenziali Amazon." },
        { title: "Verifica di Amazon", body: "Amazon conferma l’idoneità finale." },
        { title: "Si applicano condizioni", body: "Valgono disponibilità e condizioni dell’offerta." },
      ],
      faqTitle: "Domande frequenti",
      faqIntro: "Le informazioni essenziali prima di continuare su Amazon.",
      faqs: [
        { question: "Chi può accedere all’offerta?", answer: `L’offerta è destinata ai membri Prime idonei in Italia. Accedi a ${market.amazon} per verificare l’idoneità.` },
        { question: "Riscatto il buono su questa pagina?", answer: `No. Dopo aver letto i dettagli, continuerai su ${market.amazon} per accedere e completare la procedura.` },
        { question: "Questa pagina chiede la password Amazon?", answer: "No. Questa pagina promozionale non raccoglie credenziali Amazon." },
        { question: "Come posso usare il buono KFC?", answer: "Amazon mostrerà le istruzioni di riscatto e le condizioni applicabili dopo la verifica." },
        { question: "Quando termina l’offerta?", answer: end ? `L’offerta termina il ${end}, salvo disponibilità e secondo le condizioni ufficiali.` : "Consulta la data di termine nelle condizioni ufficiali." },
      ],
      finalTitle: "Vuoi verificare la tua offerta Prime?",
      finalBody: "Controlla i dettagli e continua in sicurezza su Amazon.",
      terms: "Termini e condizioni",
      legal: "Offerta a tempo limitato. Si applicano requisiti, disponibilità e condizioni.",
      modalKicker: "Offerta Prime × KFC",
      modalTitle: `La tua offerta KFC a partire da ${offer}`,
      modalIntro: "Controlla le informazioni principali prima di continuare su Amazon.",
      modalPoints: ["Per membri Prime idonei in Italia", `Disponibile per account ${market.amazon} idonei`, "Accedi ad Amazon per verificare l’idoneità", "Si applicano disponibilità e condizioni"],
      security: `Accesso e riscatto avvengono in sicurezza su ${market.amazon}. Questa pagina non raccoglie la tua password Amazon.`,
      continueLabel: `Continua su ${market.amazon}`,
      openingLabel: `Apertura di ${market.amazon}…`,
      notNow: "Non ora",
      close: "Chiudi",
      unavailableTitle: "L’offerta non è disponibile al momento",
      unavailableBody: "Non è stato possibile confermare la configurazione della campagna. Riprova più tardi.",
    };
  }

  return {
    ...market,
    exclusive: "A Prime member perk, served by KFC",
    eyebrow: "Prime member exclusive",
    headline: `Prime members, KFC perks start at ${offer}.`,
    lede: `See if your account qualifies for a KFC coupon starting at ${offer}, then claim it securely on ${market.amazon}.`,
    primaryCta: "Check eligibility & claim",
    ctaNote: `You’ll review the offer details before continuing to ${market.amazon}.`,
    trust: ["Eligible Prime members", `Made for ${country}`, `Secure claim on ${market.amazon}`],
    howTitle: "Dinner plans, upgraded in three quick steps.",
    howIntro: "No forms here. We’ll show the details, then Amazon confirms your account.",
    steps: [
      { title: "Review your Prime perk", body: "See the coupon value, eligibility details and official terms before you leave this page." },
      { title: "Check on Amazon", body: `Continue to ${market.amazon} and sign in through Amazon’s secure experience.` },
      { title: "Bring on KFC", body: "If your account qualifies, follow Amazon’s instructions to claim and redeem your coupon." },
    ],
    valueEyebrow: "Prime × KFC benefit",
    valueTitle: "Cravings meet Prime perks.",
    valueBody: `Member offers start at ${offer}, ready for buckets, fries, biscuits and whatever your next KFC order calls for.`,
    valuePoints: [`KFC coupons from ${offer}`, `For eligible Prime members in ${market.countryName}`, `Final eligibility confirmed on ${market.amazon}`],
    safetyTitle: "Your Amazon sign-in stays on Amazon.",
    safetyBody: "This page introduces the promotion. Amazon handles your sign-in, confirms eligibility and provides the redemption instructions.",
    safetyCards: [
      { title: "No payment on this page", body: "We do not ask for payment details here." },
      { title: "No Amazon password", body: "This page never collects Amazon credentials." },
      { title: "Confirmed by Amazon", body: "Amazon makes the final eligibility decision." },
      { title: "Terms apply", body: "Offer availability and conditions may apply." },
    ],
    faqTitle: "Good to know before you go",
    faqIntro: "A few clear answers before you continue to Amazon.",
    faqs: [
      { question: "Who is eligible for this offer?", answer: `This offer is intended for eligible Prime members in ${market.countryName}. Sign in on ${market.amazon} to confirm your eligibility.` },
      { question: "Do I claim the coupon on this website?", answer: `No. After reviewing the details, you’ll continue to ${market.amazon} to sign in and complete the claim.` },
      { question: "Will this page ask for my Amazon password?", answer: "No. This promotional page does not collect Amazon login credentials." },
      { question: "How can I use the KFC coupon?", answer: "Amazon provides the redemption instructions and applicable conditions after eligibility is confirmed." },
      { question: "When does the offer end?", answer: end ? `The offer ends ${end}, subject to availability and the official terms.` : "Please refer to the official offer terms for the end date." },
    ],
    finalTitle: `Your next KFC night could start with ${offer} in savings.`,
    finalBody: "Check the offer details, then let Amazon confirm whether your Prime account qualifies.",
    terms: "Terms & Conditions",
    legal: "Limited-time offer. Eligibility, availability and terms apply.",
    modalKicker: "Prime × KFC offer",
    modalTitle: `Your Prime member offer starts at ${offer}`,
    modalIntro: "Here’s what to know before you continue to Amazon and check your account.",
    modalPoints: [`For eligible Prime members in ${market.countryName}`, `Available to qualifying ${market.amazon} accounts`, "Sign in on Amazon to check eligibility", "Offer availability and terms apply"],
    security: `You’ll complete sign-in and claiming securely on ${market.amazon}. This page does not collect your Amazon password.`,
    continueLabel: `Continue to ${market.amazon}`,
    openingLabel: `Opening ${market.amazon}…`,
    notNow: "Not now",
    close: "Close",
    unavailableTitle: "This offer is temporarily unavailable",
    unavailableBody: "We could not confirm the campaign configuration. Please try again later.",
  };
}

function domainMatches(url: string, domain: string) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host === domain || host.endsWith(`.${domain}`);
  } catch {
    return false;
  }
}

export default function LandingPage(props: LandingPageProps) {
  const { country, offerValue, offerCurrency, offerEndDate, campaignUrl, termsUrl, requestedCountryIsValid } = props;
  const market = marketMeta[country] || marketMeta.US;
  const offer = formatOffer(offerValue, offerCurrency, market.locale);
  const startingOffer = formatStartingOffer(country, offer);
  const copy = useMemo(() => buildCopy(country, offer, offerEndDate), [country, offer, offerEndDate]);
  const [isOpen, setIsOpen] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const heroCtaRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const isConfigured = requestedCountryIsValid && offerValue.trim().length > 0 && offerCurrency === market.currency && domainMatches(campaignUrl, market.domain);
  const termsHref = termsUrl || "#terms";

  useEffect(() => {
    const cta = heroCtaRef.current;
    if (!cta) return;
    const observer = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting), { threshold: 0.1 });
    observer.observe(cta);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
      if (event.key !== "Tab" || !modalRef.current) return;
      const focusable = Array.from(modalRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]"));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [isOpen]);

  const openOffer = () => {
    if (isConfigured) setIsOpen(true);
  };

  const continueToAmazon = () => {
    if (!isConfigured || isRedirecting) return;
    setIsRedirecting(true);
    window.setTimeout(() => window.location.assign(campaignUrl), 450);
  };

  if (!isConfigured) {
    return (
      <main className="configuration-state">
        <div className="configuration-card">
          <div className="brand brand-dark"><span className="prime-word">prime</span><span className="brand-divider" /><span className="kfc-word">KFC</span></div>
          <h1>{copy.unavailableTitle}</h1>
          <p>{copy.unavailableBody}</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <header className="trust-header">
        <a className="brand" href="#offer" aria-label="Prime and KFC offer">
          <span className="prime-word">prime</span><span className="brand-divider" aria-hidden="true" /><span className="kfc-word">KFC</span>
        </a>
        <p>{copy.exclusive}</p>
        <span className="market-label">{country}</span>
      </header>

      <section className={`hero hero-${country.toLowerCase()}`} id="offer">
        <div className={`hero-media ${country !== "US" && country !== "CA" ? "product-crop" : ""}`}>
          <img
            className="campaign-hero-image"
            src={country === "CA" ? "/assets/kfc-prime-ca-from-30.png" : "/assets/prime-kfc-hero-from-30.png"}
            alt={country === "CA" ? `${startingOffer} Prime and KFC member offer in Canada` : "KFC fried chicken, fries and cola with a Prime member coupon starting at $30"}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="hero-shade" aria-hidden="true" />
        </div>
        <div className="hero-copy">
          <span className="eyebrow">{copy.eyebrow}</span>
          <h1>{copy.headline}</h1>
          <p className="hero-lede">{copy.lede}</p>
          <button ref={heroCtaRef} className="primary-cta" onClick={openOffer}>{copy.primaryCta}</button>
          <p className="cta-note">{copy.ctaNote}</p>
          <div className="trust-row" aria-label="Offer highlights">
            {copy.trust.map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>

      </section>

      <section className="steps-section">
        <div className="section-heading">
          <span className="eyebrow">Prime × KFC</span>
          <h2>{copy.howTitle}</h2>
          <p>{copy.howIntro}</p>
        </div>
        <div className="steps-grid">
          {copy.steps.map((step, index) => (
            <article className="step-card" key={step.title}>
              <span className="step-number">0{index + 1}</span><h3>{step.title}</h3><p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="value-section">
        <div className="value-art real-value-art">
          <img src="/assets/prime-kfc-hero-from-30.png" alt="Fresh KFC fried chicken, fries and cola beside a Prime member offer starting at $30" />
          <div className="value-photo-shade" aria-hidden="true" />
          <div className="floating-proof" aria-label={`${startingOffer} KFC member coupon`}>
            <span>{copy.valueEyebrow}</span><strong>{startingOffer}</strong><b>KFC coupon</b>
          </div>
        </div>
        <div className="value-copy">
          <span className="eyebrow">{copy.valueEyebrow}</span>
          <h2>{copy.valueTitle}</h2>
          <p>{copy.valueBody}</p>
          <ul>{copy.valuePoints.map((point) => <li key={point}>{point}</li>)}</ul>
          <button className="secondary-cta" onClick={openOffer}>{copy.primaryCta}</button>
        </div>
      </section>

      <section className="safety-section">
        <div className="section-heading light-heading"><span className="eyebrow">Prime × KFC</span><h2>{copy.safetyTitle}</h2><p>{copy.safetyBody}</p></div>
        <div className="safety-grid">
          {copy.safetyCards.map((card, index) => <article key={card.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{card.title}</h3><p>{card.body}</p></article>)}
        </div>
      </section>

      <section className="faq-section">
        <div className="section-heading"><span className="eyebrow">Prime member help</span><h2>{copy.faqTitle}</h2><p>{copy.faqIntro}</p></div>
        <div className="faq-list">
          {copy.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}
        </div>
      </section>

      <section className="final-section">
        <div><span className="eyebrow">Prime × KFC</span><h2>{copy.finalTitle}</h2><p>{copy.finalBody}</p></div>
        <button className="primary-cta" onClick={openOffer}>{copy.primaryCta}</button>
      </section>

      <footer id="terms">
        <div className="brand"><span className="prime-word">prime</span><span className="brand-divider" /><span className="kfc-word">KFC</span></div>
        <p>{copy.legal}</p>
        <a href={termsHref}>{copy.terms}</a>
      </footer>

      <div className={`sticky-cta ${showSticky && !isOpen ? "is-visible" : ""}`} aria-hidden={!showSticky || isOpen}>
        <div><strong>{startingOffer} KFC</strong><span>{copy.trust[0]}</span></div>
        <button onClick={openOffer} tabIndex={showSticky && !isOpen ? 0 : -1}>{copy.primaryCta}</button>
      </div>

      {isOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setIsOpen(false)}>
          <section ref={modalRef} className="offer-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.stopPropagation()}>
            <button ref={closeButtonRef} className="modal-close" onClick={() => setIsOpen(false)} aria-label={copy.close}>{copy.close}</button>
            <span className="modal-kicker">{copy.modalKicker}</span>
            <h2 id="modal-title">{copy.modalTitle}</h2>
            <p>{copy.modalIntro}</p>
            <ul>{copy.modalPoints.map((point) => <li key={point}>{point}</li>)}</ul>
            <div className="security-note"><span aria-hidden="true" /><p>{copy.security}</p></div>
            <button className="primary-cta modal-cta" onClick={continueToAmazon} disabled={isRedirecting}>{isRedirecting ? copy.openingLabel : copy.continueLabel}</button>
            <button className="text-action" onClick={() => setIsOpen(false)}>{copy.notNow}</button>
            <a className="terms-link" href={termsHref}>{copy.terms}</a>
          </section>
        </div>
      )}
    </main>
  );
}
