export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  type: 'veg' | 'non-veg';
  image: string;
  longDescription?: string;
  language: 'English' | 'Hindi' | 'Gujarati' | 'Marathi';
}

export type MenuCategory = 'soup'|'starters' | 'Snacks' | 'Sandwich'| 'Hot beverages' |'roti-parotha-naan' | 'cold-drinks' | 'rice' | 'milk-shakes'| 'ice-creams-desserts'| 'Punjabi Items' | 'Spl. Punjabi Varieties' | 'Sizzlers' | 'Papad / Salad Items' | 'Veg. Chinese Varieties (Gravy)' | 'Veg. Chinese Varieties' | 'Veg. Chinese Rice Items' | 'Thali' | 'alcohol' | 'desserts' ;

export interface TransitionState {
  current: 'hotel' | 'ad' | 'language';
  opacity: number;
}