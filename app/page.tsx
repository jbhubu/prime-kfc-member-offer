import LandingPage from "./landing-page";

export default function Home() {
  const allowedCountries = ["UK", "US", "DE", "CA", "JP", "ES", "IT"];
  const requestedCountry = (process.env.ACTIVE_COUNTRY || "US").toUpperCase();
  const country = allowedCountries.includes(requestedCountry) ? requestedCountry : "US";
  const offerValue = process.env.OFFER_VALUE || "30";
  const offerCurrency = process.env.OFFER_CURRENCY || "USD";
  const offerEndDate = process.env.OFFER_END_DATE || "";
  const campaignUrl = process.env.AMAZON_CAMPAIGN_URL || "https://www.amazon.com/";
  const termsUrl = process.env.TERMS_URL || "";

  return (
    <LandingPage
      country={country}
      offerValue={offerValue}
      offerCurrency={offerCurrency}
      offerEndDate={offerEndDate}
      campaignUrl={campaignUrl}
      termsUrl={termsUrl}
      requestedCountryIsValid={allowedCountries.includes(requestedCountry)}
    />
  );
}
