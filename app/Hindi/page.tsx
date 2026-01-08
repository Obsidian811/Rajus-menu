'use client';

import { useState, useEffect } from 'react';
import { MenuItem } from '../lib/types';
import { fetchMenuFromGoogleSheet } from '../lib/fetch-google-sheet-hin';

// ---------------- TYPES ----------------
type SubCategory = {
  id: string;
  name: string;
};

type ParentCategory = {
  id: string;
  name: string;
  icon: string;
  subCategories: SubCategory[];
};

// ---------------- CATEGORIES ----------------
const parentCategories: ParentCategory[] = [
  {
    id: 'drinks',
    name: 'पेय',
    icon: '🥤',
    subCategories: [
      { id: 'Fizz Drinks', name: 'फिज ड्रिंक्स' },
      { id: 'Float', name: 'फ्लोट' }
    ]
  },
  {
    id: 'coffee',
    name: 'कॉफी',
    icon: '☕',
    subCategories: [
      { id: 'Cold Coffee', name: 'कोल्ड कॉफी' },
      { id: 'Hot Coffee', name: 'हॉट कॉफी' }
    ]
  },
  {
    id: 'milkshakes',
    name: 'मिल्कशेक',
    icon: '🥛',
    subCategories: [{ id: 'Milkshakes', name: 'मिल्कशेक' }]
  },
  {
    id: 'ice cream',
    name: 'आइसक्रीम',
    icon: '🍦',
    subCategories: [{ id: 'Ice Cream', name: 'आइसक्रीम' }]
  },
  {
    id: 'burger',
    name: 'बर्गर',
    icon: '🍔',
    subCategories: [{ id: 'Burger', name: 'बर्गर' }]
  },
  {
    id: 'sandwiches',
    name: 'सैंडविच',
    icon: '🥪',
    subCategories: [
      { id: 'Soft Bread Sandwich', name: 'सॉफ्ट ब्रेड सैंडविच' },
      { id: 'Grilled Sandwich', name: 'वेज ग्रिल्ड सैंडविच' },
      { id: 'Toast Sandwich', name: 'टोस्ट सैंडविच' },
      { id: 'Chicken Grilled Sandwich', name: 'चिकन ग्रिल्ड सैंडविच' }
    ]
  },
  {
    id: 'french fires',
    name: 'फ्रेंच फ्राइज',
    icon: '🍟',
    subCategories: [{ id: 'French Fries', name: 'फ्रेंच फ्राइज' }]
  },
  {
    id: 'frankie',
    name: 'फ्रैंकी',
    icon: '🌯',
    subCategories: [
      { id: 'Veg Frankie', name: 'वेज फ्रैंकी' },
      { id: 'Egg Frankie', name: 'एग फ्रैंकी' },
      { id: 'Chicken Frankie', name: 'चिकन फ्रैंकी' }
    ]
  }
];

const getFirstSubCategory = (parentId: string) =>
  parentCategories.find(p => p.id === parentId)?.subCategories[0]?.id || '';

// ---------------- COMPONENT ----------------
export default function HindiMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categoryItems, setCategoryItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('drinks');
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    getFirstSubCategory('drinks')
  );

  const GOOGLE_CSV_URL =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vSU3feEUr0Rekmp_o-x5zoaH-1X9KQbNqAgRFQhuJ1brX_ygTVhLDfIujd3DC4HsE7xMBNWuu0UeUr_/pub?output=csv&gid=996455318';

  const handleBack = () => {
    sessionStorage.setItem('fromLanguageMenu', 'true');
    window.location.href = '/';
  };

  // -------- LOAD MENU --------
  useEffect(() => {
    async function loadMenu() {
      const items = await fetchMenuFromGoogleSheet(GOOGLE_CSV_URL);

      const formatted = items
        .filter(
          (item: any) =>
            (item.language || '').toLowerCase() === 'hindi'
        )
        .map((item: any) => ({
          id: String(item.id),
          name: String(item.name),
          category: String(item.category),
          price: Number(item.price) || 0,
          type: item.type.toLowerCase() as 'veg' | 'non-veg',
          description: String(item.description || ''),
          image: String(item.image || ''),
          language: 'Hindi' as const
        }));

      setMenuItems(formatted);
    }

    loadMenu();
  }, []);

  // -------- FILTER --------
  useEffect(() => {
    const filtered = menuItems.filter(
      item =>
        item.category.toLowerCase() ===
        selectedSubCategory.toLowerCase()
    );
    setCategoryItems(filtered);
  }, [menuItems, selectedSubCategory]);

  const handleCategoryChange = (id: string) => {
    setSelectedCategory(id);
    setSelectedSubCategory(getFirstSubCategory(id));
  };

  const currentSubCategories =
    parentCategories.find(p => p.id === selectedCategory)?.subCategories || [];

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-amber-100 text-black">

      {/* HEADER */}
      <div className="relative flex flex-col sm:flex-row sm:justify-center sm:items-center">
        <h1 className="text-3xl font-bold -rotate-12 text-blue-800 sm:fixed sm:top-4 sm:left-4">
          Raju's
        </h1>

        <h1
          className="pt-6 text-5xl font-bold text-center text-blue-900"
          style={{ WebkitTextStroke: '0.5px white' }}
        >
          हमारा मेनू
        </h1>

        <button
          onClick={handleBack}
          className="mx-auto mt-4 sm:mt-0 sm:fixed sm:top-4 sm:right-4 px-4 py-2 bg-blue-800 text-white rounded-md"
        >
          भाषा चयन पर वापस
        </button>
      </div>

      {/* CATEGORY TABS (UNCHANGED) */}
      <header className="bg-black/20 backdrop-blur-sm sticky top-0 z-10 mt-6">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {parentCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-800 text-gray-300'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {currentSubCategories.length > 1 && (
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {currentSubCategories.map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubCategory(sub.id)}
                  className={`px-4 py-2 rounded-md text-sm ${
                    selectedSubCategory === sub.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* SIMPLE LIST MENU */}
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
          {currentSubCategories.find(s => s.id === selectedSubCategory)?.name}
        </h2>

        <div className="space-y-5">
          {categoryItems.map(item => (
            <div key={item.id} className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`h-3 w-3 rounded-full ${
                      item.type === 'veg'
                        ? 'bg-green-600'
                        : 'bg-red-600'
                    }`}
                  />
                  <h3 className="text-lg font-medium">{item.name}</h3>
                </div>

                {item.description && (
                  <p className="text-sm text-gray-600 ml-5">
                    {item.description}
                  </p>
                )}
              </div>

              <span className="text-lg font-semibold">
                ₹{item.price.toFixed(2)}
              </span>
            </div>
          ))}

          {categoryItems.length === 0 && (
            <p className="text-center text-gray-500">
              कोई आइटम उपलब्ध नहीं है
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
