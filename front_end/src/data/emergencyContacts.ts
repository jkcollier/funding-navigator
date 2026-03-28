export interface EmergencyContact {
  nameEn: string;
  nameDe: string;
  address: string;
  phone: string;
  emailWebsite: string;
  descriptionEn: string;
  descriptionDe: string;
}

export interface EmergencyCategory {
  titleEn: string;
  titleDe: string;
  contacts: EmergencyContact[];
}

export const emergencyCategories: EmergencyCategory[] = [
  {
    titleEn: "District Social Services (City of Zurich)",
    titleDe: "Bezirk Zürich (Stadt Zürich)",
    contacts: [
      { nameEn: "Sozialzentrum Selnau", nameDe: "Sozialzentrum Selnau", address: "Selnaustrasse 17, 8001 Zürich", phone: "044 412 66 77", emailWebsite: "sozialzentrum.selnau@sd.stzh.ch", descriptionEn: "Districts 1, 2, 3, 7, 8 – Social assistance, personal counselling, family counselling", descriptionDe: "Kreise 1, 2, 3, 7, 8 – Sozialhilfe, persönliche Beratung, Familienberatung" },
      { nameEn: "Sozialzentrum Helvetiaplatz", nameDe: "Sozialzentrum Helvetiaplatz", address: "Molkenstrasse 5/9, 8004 Zürich", phone: "044 412 85 00", emailWebsite: "stadt-zuerich.ch/sozialzentren", descriptionEn: "Districts 3 (Sihlfeld), 4, 5 – Social assistance, personal counselling", descriptionDe: "Kreise 3 (Sihlfeld), 4, 5 – Sozialhilfe, persönliche Beratung" },
      { nameEn: "Sozialzentrum Hönggerstrasse", nameDe: "Sozialzentrum Hönggerstrasse", address: "Hönggerstrasse 24, 8037 Zürich", phone: "043 444 63 00", emailWebsite: "sozialzentrum.hoenggerstrasse@sd.stzh.ch", descriptionEn: "Districts 6, 10 – Social assistance, personal counselling", descriptionDe: "Kreise 6, 10 – Sozialhilfe, persönliche Beratung" },
      { nameEn: "Sozialzentrum Albisriederhaus", nameDe: "Sozialzentrum Albisriederhaus", address: "Albisriederstrasse 330, 8047 Zürich", phone: "044 412 77 77", emailWebsite: "sz.albisriederhaus@zuerich.ch", descriptionEn: "District 9 – Social assistance, personal counselling", descriptionDe: "Kreis 9 – Sozialhilfe, persönliche Beratung" },
      { nameEn: "Sozialzentrum Dorflinde", nameDe: "Sozialzentrum Dorflinde", address: "Thurgauerstrasse 54, 8050 Zürich", phone: "044 412 78 78", emailWebsite: "stadt-zuerich.ch/sozialzentren", descriptionEn: "Districts 11 (excl. Affoltern), 12 – Social assistance", descriptionDe: "Kreise 11 (ohne Affoltern), 12 – Sozialhilfe, persönliche Beratung" },
    ],
  },
  {
    titleEn: "District Social Services (Other Districts)",
    titleDe: "Bezirks-Sozialdienste (Weitere Bezirke)",
    contacts: [
      { nameEn: "Social Services District of Affoltern (SOBA)", nameDe: "Sozialdienst Bezirk Affoltern (SOBA)", address: "Obfelderstrasse 41b, 8910 Affoltern am Albis", phone: "044 762 45 45", emailWebsite: "info@sdaffoltern.ch", descriptionEn: "Social assistance for all municipalities in the District of Affoltern", descriptionDe: "Sozialhilfe für alle Gemeinden des Bezirks Affoltern" },
      { nameEn: "Zentrum Breitenstein", nameDe: "Zentrum Breitenstein", address: "Landstrasse 36, 8450 Andelfingen", phone: "043 258 46 11", emailWebsite: "www.zentrum-breitenstein.ch", descriptionEn: "Social services, addiction counselling for District of Andelfingen", descriptionDe: "Sozialdienst, Suchtberatung für den Bezirk Andelfingen" },
      { nameEn: "Social Services City of Bülach", nameDe: "Sozialdienst Stadt Bülach", address: "Hans-Haller-Gasse 9, 8180 Bülach", phone: "044 863 11 11", emailWebsite: "www.buelach.ch", descriptionEn: "Social assistance for the city of Bülach", descriptionDe: "Sozialhilfe für die Stadt Bülach" },
      { nameEn: "Social Services District of Dielsdorf (SDBD)", nameDe: "Sozialdienste Bezirk Dielsdorf (SDBD)", address: "Brunnwiesenstrasse 8a, 8157 Dielsdorf", phone: "043 422 20 40", emailWebsite: "www.sdbd.ch", descriptionEn: "Social assistance, KESB for 22 municipalities", descriptionDe: "Sozialhilfe, KESB, Suchtprävention für 22 Gemeinden" },
      { nameEn: "City of Dietikon, Social Services", nameDe: "Stadt Dietikon, Sozialabteilung", address: "Bremgartnerstrasse 22, 8953 Dietikon", phone: "044 744 35 35", emailWebsite: "www.dietikon.ch", descriptionEn: "Social assistance for Dietikon", descriptionDe: "Sozialhilfe, Sozialberatung für Dietikon" },
      { nameEn: "Social Services Horgen", nameDe: "Soziale Dienste Horgen", address: "Alte Landstrasse 25, 8810 Horgen", phone: "044 728 44 40", emailWebsite: "sozialedienste@horgen.ch", descriptionEn: "Social assistance for Horgen", descriptionDe: "Sozialhilfe für Horgen" },
      { nameEn: "Social Services District of Pfäffikon", nameDe: "Soziales Bezirk Pfäffikon", address: "Hochstrasse 1, 8330 Pfäffikon ZH", phone: "044 952 51 00", emailWebsite: "www.sdbp.ch", descriptionEn: "Social assistance for 10 municipalities", descriptionDe: "Sozialhilfe für Bauma, Fehraltorf, Hittnau, Illnau-Effretikon, etc." },
      { nameEn: "Social Services City of Uster", nameDe: "Soziale Dienste Stadt Uster", address: "Bahnhofstrasse 17, 8610 Uster", phone: "044 944 73 51", emailWebsite: "www.uster.ch", descriptionEn: "Social assistance for Uster", descriptionDe: "Sozialhilfe für Uster" },
      { nameEn: "Social Services City of Winterthur", nameDe: "Soziale Dienste Stadt Winterthur", address: "Pionierstrasse 5, 8400 Winterthur", phone: "052 267 56 34", emailWebsite: "sozialberatung@win.ch", descriptionEn: "Social assistance for the city of Winterthur", descriptionDe: "Sozialhilfe und Sozialberatung für die Stadt Winterthur" },
    ],
  },
  {
    titleEn: "Cantonal & Supra-Regional Contact Points",
    titleDe: "Überregionale Anlaufstellen",
    contacts: [
      { nameEn: "Cantonal Social Welfare Office Zurich", nameDe: "Kantonales Sozialamt Zürich", address: "Schaffhauserstrasse 78, 8090 Zürich", phone: "043 259 24 51", emailWebsite: "info@sa.zh.ch / www.zh.ch/sozialamt", descriptionEn: "Supervision of social assistance, asylum welfare, advisory services", descriptionDe: "Aufsicht Sozialhilfe, Asylfürsorge, Beratung der Gemeinden" },
      { nameEn: "Caritas Zürich", nameDe: "Caritas Zürich", address: "Beckenhofstrasse 16, 8035 Zürich", phone: "044 366 68 68", emailWebsite: "beratung@caritas-zuerich.ch / www.caritas-zuerich.ch", descriptionEn: "Social counselling, KulturLegi, energy cost support", descriptionDe: "Sozialberatung, KulturLegi, Unterstützung bei Energiekosten" },
      { nameEn: "Swiss Red Cross Canton of Zurich", nameDe: "SRK Kanton Zürich – Sozialberatung", address: "Thurgauerstrasse 36/38, 8050 Zürich", phone: "044 360 28 53", emailWebsite: "www.srk-zuerich.ch", descriptionEn: "Counselling in emergency situations, Meditrina for undocumented persons", descriptionDe: "Beratung in Notsituationen, Meditrina für Sans-Papiers" },
      { nameEn: "Salvation Army – Social Counselling Zurich", nameDe: "Heilsarmee – Soziale Beratungsstelle Zürich", address: "Molkenstrasse 6, 8004 Zürich", phone: "044 273 90 01", emailWebsite: "sozialberatung-zuerich.heilsarmee.ch", descriptionEn: "Free social counselling (City of Zurich and agglomeration)", descriptionDe: "Kostenlose Sozialberatung (Stadt Zürich und Agglomeration)" },
      { nameEn: "Debt Counselling Centre, Canton of Zurich", nameDe: "Fachstelle für Schuldenberatung Kt. Zürich", address: "Schaffhauserstrasse 550, 8052 Zürich", phone: "043 333 36 86", emailWebsite: "info@schulden-zh.ch", descriptionEn: "Debt counselling, budget planning, debt restructuring", descriptionDe: "Beratung bei Verschuldung, Budgetplanung, Schuldensanierung" },
      { nameEn: "Pro Senectute Kanton Zürich", nameDe: "Pro Senectute Kanton Zürich", address: "Forchstrasse 145, 8032 Zürich", phone: "058 451 51 00", emailWebsite: "info@pszh.ch / www.pszh.ch", descriptionEn: "Social counselling for people aged 60+, financial aid", descriptionDe: "Sozialberatung ab 60 Jahren, Finanzhilfe, Treuhanddienst" },
      { nameEn: "Pro Infirmis Zürich", nameDe: "Pro Infirmis Zürich", address: "Hohlstrasse 560, 8048 Zürich", phone: "058 775 25 25", emailWebsite: "www.proinfirmis.ch", descriptionEn: "Social counselling for people with disabilities, direct financial assistance", descriptionDe: "Sozialberatung für Menschen mit Behinderungen, finanzielle Direkthilfe" },
      { nameEn: "Pro Juventute", nameDe: "Pro Juventute", address: "Thurgauerstrasse 39, 8050 Zürich", phone: "044 256 77 77", emailWebsite: "info@projuventute.ch / www.projuventute.ch", descriptionEn: "Counselling and financial support for children, young people and families", descriptionDe: "Beratung und finanzielle Unterstützung für Kinder, Jugendliche und Familien" },
      { nameEn: "SVA Zurich – Premium Reduction (IPV)", nameDe: "SVA Zürich – Prämienverbilligung (IPV)", address: "Röntgenstrasse 17, 8005 Zürich", phone: "044 448 53 75", emailWebsite: "www.svazurich.ch/ipv", descriptionEn: "Individual health insurance premium reduction", descriptionDe: "Individuelle Prämienverbilligung für Krankenkassenprämien" },
      { nameEn: "Zurich Women's Centre – Moneythek", nameDe: "Zürcher Frauenzentrale – Moneythek", address: "Am Schanzengraben 29, 8002 Zürich", phone: "044 206 30 20", emailWebsite: "beratung@frauenzentrale-zh.ch", descriptionEn: "Free advice on money, budgeting and debt", descriptionDe: "Kostenlose Auskunft zu Geld, Budget und Schulden" },
    ],
  },
  {
    titleEn: "Food Distribution & Discounted Groceries",
    titleDe: "Lebensmittelabgabe und vergünstigte Lebensmittel",
    contacts: [
      { nameEn: "Tischlein deck dich", nameDe: "Tischlein deck dich", address: "Various distribution points in the Canton of Zurich", phone: "", emailWebsite: "info@tischlein.ch / www.tischlein.ch", descriptionEn: "Weekly distribution of rescued food to people affected by poverty. Recipient card required (CHF 1.–)", descriptionDe: "Wöchentliche Abgabe geretteter Lebensmittel an Armutsbetroffene. Bezugskarte erforderlich (CHF 1.–)" },
      { nameEn: "Essen für Alle", nameDe: "Essen für Alle", address: "Allmendstrasse 93, 8041 Zürich", phone: "", emailWebsite: "www.essenfueralle.org", descriptionEn: "Free food and hygiene products every Saturday. Low-threshold, regardless of residence status", descriptionDe: "Jeden Samstag kostenlose Lebensmittel und Hygieneartikel. Unabhängig vom Aufenthaltsstatus" },
      { nameEn: "Caritas-Markt Zürich Kreis 4", nameDe: "Caritas-Markt Zürich Kreis 4", address: "Reitergasse 1, 8004 Zürich", phone: "044 366 68 45", emailWebsite: "www.caritas-markt.ch", descriptionEn: "Groceries up to 70% cheaper with Caritas Market card or KulturLegi", descriptionDe: "Lebensmittel bis zu 70% günstiger mit Caritas-Markt-Karte oder KulturLegi" },
      { nameEn: "Caritas-Markt Zürich Oerlikon", nameDe: "Caritas-Markt Zürich Oerlikon", address: "Schwamendingenstrasse 41, 8050 Zürich", phone: "", emailWebsite: "www.caritas-markt.ch", descriptionEn: "Groceries up to 70% cheaper with Caritas Market card or KulturLegi", descriptionDe: "Lebensmittel bis zu 70% günstiger mit Caritas-Markt-Karte oder KulturLegi" },
      { nameEn: "Caritas-Markt Winterthur", nameDe: "Caritas-Markt Winterthur", address: "Zürcherstrasse 77, 8406 Winterthur", phone: "052 214 23 76", emailWebsite: "www.caritas-markt.ch", descriptionEn: "Groceries up to 70% cheaper with Caritas Market card or KulturLegi", descriptionDe: "Lebensmittel bis zu 70% günstiger mit Caritas-Markt-Karte oder KulturLegi" },
      { nameEn: "Sozialwerk Pfarrer Sieber – Sunestube", nameDe: "Sozialwerk Pfarrer Sieber – Sunestube", address: "Militärstrasse 4, 8004 Zürich", phone: "044 241 96 14", emailWebsite: "www.swsieber.ch", descriptionEn: "Street café with free meals for marginalised and homeless people", descriptionDe: "Gassencafé mit kostenlosen Mahlzeiten für Randständige und obdachlose Menschen" },
    ],
  },
  {
    titleEn: "Affordable Clothing & Secondhand",
    titleDe: "Günstige Kleider und Secondhand",
    contacts: [
      { nameEn: "Caritas Secondhand Shops", nameDe: "Caritas Secondhand-Läden", address: "Various locations in Zurich and Winterthur", phone: "", emailWebsite: "www.caritas-secondhand.ch", descriptionEn: "Affordable secondhand clothing, shoes and accessories. Open to everyone", descriptionDe: "Günstige Secondhand-Kleider, Schuhe und Accessoires. Einkauf für alle offen" },
      { nameEn: "Walk-in Closet", nameDe: "Walk-in Closet", address: "Various event locations", phone: "", emailWebsite: "www.walkincloset.ch", descriptionEn: "Events where well-preserved clothing can be exchanged for a small fee", descriptionDe: "Veranstaltungen mit Kleidertausch gegen kleine Gebühr" },
    ],
  },
  {
    titleEn: "Repair, Borrow & Exchange",
    titleDe: "Reparieren, Ausleihen und Tauschen",
    contacts: [
      { nameEn: "Repair Café", nameDe: "Repair Café", address: "Various locations in the Canton of Zurich", phone: "", emailWebsite: "www.repair-cafe.ch", descriptionEn: "Free repair of broken devices and items with expert help. Over 133 locations", descriptionDe: "Kostenlose Reparatur defekter Geräte mit Hilfe von Fachleuten. Über 133 Standorte" },
      { nameEn: "Pumpipumpe", nameDe: "Pumpipumpe", address: "", phone: "", emailWebsite: "www.pumpipumpe.ch", descriptionEn: "Free borrowing of tools and everyday items from neighbours", descriptionDe: "Gratis Ausleihen von Werkzeugen und Alltagsgegenständen in der Nachbarschaft" },
      { nameEn: "Zürich tauscht (Time Exchange)", nameDe: "Zürich tauscht (Zeittauschbörse)", address: "", phone: "", emailWebsite: "www.zuerichtauscht.ch", descriptionEn: "Activities exchanged based on time spent – e.g. gardening for computer help", descriptionDe: "Tätigkeiten auf Basis des Zeitaufwandes getauscht" },
    ],
  },
  {
    titleEn: "Food Rescue & Free Meals",
    titleDe: "Lebensmittelrettung und Gratis-Essen",
    contacts: [
      { nameEn: "RestEssBar (Winterthur)", nameDe: "RestEssBar (Winterthur)", address: "Winterthur", phone: "", emailWebsite: "www.restessbar.ch", descriptionEn: "Public fridges with rescued food. Free and accessible to everyone", descriptionDe: "Öffentliche Kühlschränke mit geretteten Lebensmitteln. Kostenlos und für alle zugänglich" },
      { nameEn: "Foodsharing Schweiz (Zürich)", nameDe: "Foodsharing Schweiz (Zürich)", address: "Zürich", phone: "", emailWebsite: "www.foodsharingschweiz.ch", descriptionEn: "Rescued food distributed free of charge via Fairteiler points", descriptionDe: "Gerettete Lebensmittel werden über Fairteiler gratis verteilt" },
    ],
  },
  {
    titleEn: "Discounted Leisure, Education & Culture",
    titleDe: "Vergünstigte Freizeit, Bildung und Kultur",
    contacts: [
      { nameEn: "KulturLegi Kanton Zürich", nameDe: "KulturLegi Kanton Zürich", address: "Reitergasse 1, 8004 Zürich", phone: "044 366 68 48", emailWebsite: "zuerich@kulturlegi.ch / www.kulturlegi.ch", descriptionEn: "Discounts of 30–70% on over 480 offers in culture, sports and education", descriptionDe: "Vergünstigungen von 30–70% bei über 480 Angeboten in Kultur, Sport und Bildung" },
      { nameEn: "Caritas Learning Centres", nameDe: "Caritas Lernlokale", address: "Various locations", phone: "", emailWebsite: "www.caritas-zuerich.ch", descriptionEn: "Computer support, German courses, mending workshops – access to education", descriptionDe: "Computerhilfe, Deutschkurse, Flickstuben – Zugang zu Bildung und Arbeit" },
    ],
  },
];

/** Key emergency numbers for the quick-access bell */
export const quickEmergencyContacts = [
  { nameEn: "Ambulance", nameDe: "Sanität", number: "144" },
  { nameEn: "Police", nameDe: "Polizei", number: "117" },
  { nameEn: "Fire Department", nameDe: "Feuerwehr", number: "118" },
  { nameEn: "Dargebotene Hand (24/7)", nameDe: "Dargebotene Hand (24/7)", number: "143" },
  { nameEn: "Pro Juventute (Youth)", nameDe: "Pro Juventute (Jugend)", number: "147" },
  { nameEn: "Toxicology Centre", nameDe: "Toxikologisches Zentrum", number: "145" },
  { nameEn: "Rega (Air Rescue)", nameDe: "Rega (Luftrettung)", number: "1414" },
];
