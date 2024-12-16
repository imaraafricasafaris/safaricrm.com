// Import all images
import favicon from '@/img/logos/favicon-32x32.png';
import logo from '@/img/logos/logo.png';
import branchManagement from '@/img/branch_managemnet.png';
import iphone from '@/img/iphone.png';
import landingDark from '@/img/landing_dark.png';
import landingWhite from '@/img/landing_white.png';
import leadFunnel from '@/img/lead_funnel.png';
import leads1 from '@/img/leads_1.png';
import leads2 from '@/img/leads_2.png';
import staff from '@/img/staff.png';

// Export all images
export const Images = {
  favicon,
  logo,
  branchManagement,
  iphone,
  landingDark,
  landingWhite,
  leadFunnel,
  leads1,
  leads2,
  staff,
} as const;

export type ImageKey = keyof typeof Images;

// Helper function to get image URL
export const getImageUrl = (key: ImageKey): string => Images[key];
