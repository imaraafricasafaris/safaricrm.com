// Define image paths
const Images = {
  // Core images
  favicon: '/img/logos/favicon-32x32.png',
  logo: '/img/logos/logo.png',
  branchManagement: '/img/branch_managemnet.png',
  iphone: '/img/iphone.png',
  landingDark: '/img/landing_dark.png',
  landingWhite: '/img/landing_white.png',
  leadFunnel: '/img/lead_funnel.png',
  leads1: '/img/leads_1.png',
  leads2: '/img/leads_2.png',
  staff: '/img/staff.png',

  // Partner logos
  tripAdvisor: '/img/partners/tripadvisor.png',
  kenyaAirways: '/img/partners/Kenya_Airways-Logo.wine.svg',
  serenaHotels: '/img/partners/serena-hotel-colored-logo.svg',
  safariBookings: '/img/partners/safari-bookings.png',
  kws: '/img/partners/KWS.png',
  ecoTourismKenya: '/img/partners/Eco-tourism_Kenya.png',
  trustpilot: '/img/partners/trustpilot.png',
  tra: '/img/partners/tra.png',

  // Integration logos
  stripe: '/img/integrations/stripe.png',
  salesforce: '/img/integrations/salesforce.png',
  hubspot: '/img/integrations/hubspot.png',
  mailchimp: '/img/integrations/mailchimp.png',
  slack: '/img/integrations/slack.png',
  zendesk: '/img/integrations/zendesk.png',
  zapier: '/img/integrations/zapier.png',
  google: '/img/integrations/google.png',
  microsoft: '/img/integrations/microsoft.png',
  zoom: '/img/integrations/zoom.png',
  dropbox: '/img/integrations/dropbox.png',
  quickbooks: '/img/integrations/quickbooks.png',
  xero: '/img/integrations/xero.png',
  sage: '/img/integrations/sage.png',
  freshbooks: '/img/integrations/freshbooks.png',
  twilio: '/img/integrations/twilio.png',
  sendgrid: '/img/integrations/sendgrid.png'
} as const;

export type ImageKey = keyof typeof Images;

// Helper function to get image URL
export const getImageUrl = (key: ImageKey): string => Images[key];

export { Images };
