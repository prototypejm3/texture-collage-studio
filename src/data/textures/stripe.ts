import { TextureSwatch } from '@/types/studio';

export const stripeTextures: TextureSwatch[] = [
  {
    id: 'stripe-navy-cream',
    name: 'Navy & Cream Stripe',
    category: 'Stripe',
    cssBackground: `repeating-linear-gradient(90deg, hsl(220, 50%, 25%) 0px, hsl(220, 50%, 25%) 6px, hsl(40, 30%, 90%) 6px, hsl(40, 30%, 90%) 12px)`,
  },
  {
    id: 'stripe-blush-white',
    name: 'Blush & White Stripe',
    category: 'Stripe',
    cssBackground: `repeating-linear-gradient(90deg, hsl(350, 35%, 72%) 0px, hsl(350, 35%, 72%) 5px, hsl(0, 0%, 96%) 5px, hsl(0, 0%, 96%) 10px)`,
  },
  {
    id: 'stripe-olive-sand',
    name: 'Olive & Sand Stripe',
    category: 'Stripe',
    cssBackground: `repeating-linear-gradient(90deg, hsl(85, 25%, 38%) 0px, hsl(85, 25%, 38%) 4px, hsl(38, 30%, 78%) 4px, hsl(38, 30%, 78%) 8px)`,
  },
  {
    id: 'stripe-ticking',
    name: 'Ticking Stripe',
    category: 'Stripe',
    cssBackground: `repeating-linear-gradient(90deg, hsl(0, 0%, 95%) 0px, hsl(0, 0%, 95%) 8px, hsl(215, 30%, 35%) 8px, hsl(215, 30%, 35%) 10px)`,
  },
];
