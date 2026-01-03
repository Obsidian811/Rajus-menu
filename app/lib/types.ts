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

export type MenuCategory = 'chicken'| 'chicken shawarma' | 'mutton'|'biryani' |'momos' ;

export interface TransitionState {
  current: 'hotel' | 'ad' | 'language';
  opacity: number;
}