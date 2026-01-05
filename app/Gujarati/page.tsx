'use client';

import { useState, useEffect } from 'react';
import { MenuItem, MenuCategory } from '../lib/types';
import { fetchMenuFromGoogleSheet } from '../lib/fetch-google-sheet-guj';
import Image from 'next/image';

// --- NEW CATEGORY STRUCTURE ---
type SubCategory = {
  id: string; // Should match the 'category' field in your Gujarati MenuItem data
  name: string; // Display name (in Gujarati)
};

type ParentCategory = {
  id: string; 
  name: string; // Display name (in Gujarati)
  icon: string;
  subCategories: SubCategory[];
};

// Define the new, hierarchical categories with Gujarati translations
const parentCategories: ParentCategory[] = [
  {
    id: 'drinks',
    name: 'પેય',
    icon: '🥤',
    subCategories: [
      { id: 'Fiz Drinks', name: 'બધા ફિઝ ડ્રિંક્સ' },
      { id: 'Float', name: 'બધા ફ્લોટ' }
    ]
  },
  {
    id: 'coffee',
    name: 'કોફી',
    icon: '☕',
    subCategories: [
      { id: 'Cold Coffee', name: 'બધી કોલ્ડ કોફી' },
      { id: 'Hot Coffee', name: 'બધી હોટ કોફી' }
    ]
  },
  {
    id: 'milkshakes',
    name: 'મિલ્કશેક',
    icon: '🥛',
    subCategories: [{ id: 'Milkshakes', name: 'બધા મિલ્કશેક' }]
  },
  {
    id: 'ice cream',
    name: 'આઇસક્રીમ',
    icon: '🍦',
    subCategories: [{ id: 'Ice Cream', name: 'બધી આઇસક્રીમ' }]
  },
  {
    id: 'burger',
    name: 'બર્ગર',
    icon: '🍔',
    subCategories: [{ id: 'Burger', name: 'બધા બર્ગર' }]
  },
  {
    id: 'sandwiches',
    name: 'સેન્ડવિચ',
    icon: '🥪',
    subCategories: [
      { id: 'Soft Bread Sandwich', name: 'બધા સોફ્ટ બ્રેડ સેન્ડવિચ' },
      { id: 'Grilled Sandwich', name: 'બધા વેજ ગ્રિલ્ડ સેન્ડવિચ' },
      { id: 'Toast Sandwich', name: 'બધા ટોસ્ટ સેન્ડવિચ' },
      { id: 'Chicken Grilled Sandwich', name: 'બધા ચિકન ગ્રિલ્ડ સેન્ડવિચ' }
    ]
  },
  {
    id: 'french fires',
    name: 'ફ્રેન્ચ ફ્રાઇઝ',
    icon: '🍟',
    subCategories: [{ id: 'French Fries', name: 'બધી ફ્રેન્ચ ફ્રાઇઝ' }]
  },
  {
    id: 'frankie',
    name: 'ફ્રેન્કી',
    icon: '🌯',
    subCategories: [
      { id: 'Veg Frankie', name: 'બધી વેજ ફ્રેન્કી' },
      { id: 'Egg Frankie', name: 'બધી એગ ફ્રેન્કી' },
      { id: 'Chicken Frankie', name: 'બધી ચિકન ફ્રેન્કી' }
    ]
  }
];

const getFirstSubCategory = (parentId: string): string => {
  const parent = parentCategories.find(p => p.id === parentId);
  return parent?.subCategories[0]?.id || '';
};

export default function GujaratiMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categoryItems, setCategoryItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('breakfast');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>(getFirstSubCategory('breakfast'));
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const GOOGLE_CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSU3feEUr0Rekmp_o-x5zoaH-1X9KQbNqAgRFQhuJ1brX_ygTVhLDfIujd3DC4HsE7xMBNWuu0UeUr_/pub?gid=899101026&single=true&output=csv";

  const handleBack = () => {
    sessionStorage.setItem('fromLanguageMenu', 'true');
    window.location.href = '/';
  };

  // LOAD CSV MENU ITEMS
  useEffect(() => {
    async function loadMenuItems() {
      const items = await fetchMenuFromGoogleSheet(GOOGLE_CSV_URL);

      const formatted: MenuItem[] = items
        .filter((item: any) => (item.language || 'english').toLowerCase() === "gujarati")
        .map((item: any) => ({
          id: String(item.id).trim(),
          name: String(item.name).trim(),
          category: String(item.category).trim(),
          price: Number(item.price) || 0,
          type: String(item.type).toLowerCase().trim() as 'veg' | 'non-veg',
          description: String(item.description || "").trim(),
          longDescription: String(item.longDescription || "").trim(),
          image: String(item.image || "").trim(),
          language: "Gujarati",
        }));

      setMenuItems(formatted);
    }

    loadMenuItems();
  }, []);

  // FILTER ITEMS BY SUB-CATEGORY
  useEffect(() => {
    if (menuItems.length === 0 || !selectedSubCategory) {
      setCategoryItems([]);
      return;
    }

    const filtered = menuItems.filter(
      (item) => item.category.toLowerCase() === selectedSubCategory.toLowerCase()
    );

    setCategoryItems(filtered);
  }, [menuItems, selectedSubCategory]);

  // HANDLE MAIN CATEGORY CHANGE
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory(getFirstSubCategory(categoryId));
  };
  
  const currentSubCategories = parentCategories.find(p => p.id === selectedCategory)?.subCategories || [];


  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 to-rose-950 text-white">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center w-full">
        <h1 className="pt-5 text-5xl font-bold mb-4 text-center bg-gradient-to-r from-amber-200 to-yellow-400 text-transparent bg-clip-text sm:mb-8 sm:w-auto">
          અમારું મેનુ
        </h1>

        <button
          onClick={handleBack}
          className="mx-auto mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors z-50 sm:fixed sm:top-4 sm:right-4 sm:mx-0 sm:mb-0"
        >
          ભાષા પસંદગી પર પાછા
        </button>
      </div>

      {/* CATEGORY TABS (Parent Categories) */}
      <header className="bg-black/30 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {parentCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="text-xl">{category.icon}</span>
                <span className="font-medium whitespace-nowrap">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {/* SUB-CATEGORY TABS */}
        {currentSubCategories.length > 1 && (
          <div className="max-w-7xl mx-auto px-4 py-3 border-t border-gray-700 bg-gray-900/50">
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {currentSubCategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubCategory(sub.id)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium whitespace-nowrap ${
                    selectedSubCategory === sub.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* MENU ITEMS */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-4">
          {selectedSubCategory && (
            <h2 className="text-3xl font-bold text-center text-amber-400 mb-6">
                {currentSubCategories.find(sub => sub.id === selectedSubCategory)?.name}
            </h2>
          )}

          {categoryItems.map((item) => (
            <div
              key={item.id}
              className="bg-gray-800 rounded-xl p-6 flex justify-between items-center transition-all duration-300 border border-gray-700 hover:border-amber-500"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center mb-2">
                  <h3 className="text-xl font-semibold mr-3">{item.name}</h3>

                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.type === 'veg'
                        ? 'bg-green-500/90 text-white'
                        : 'bg-red-500/90 text-white'
                    }`}
                  >
                    {item.type === 'veg' ? 'Veg' : 'Non-veg'}
                  </span>
                </div>

                <p className="text-gray-400 mb-2 line-clamp-2">
                  {item.description}
                </p>

                <span className="text-xl font-bold text-amber-400">
                  ₹{item.price.toFixed(2)}
                </span>
              </div>

              {(item.image || item.longDescription) && (
                <button
                  onClick={() => setSelectedItem(item)}
                  className="ml-6 flex-shrink-0 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
                >
                  વિગતો જુઓ
                </button>
              )}
            </div>
          ))}

          {categoryItems.length === 0 && (
            <p className="text-center text-gray-400 py-10 text-lg">
              Select a category to view menu items
            </p>
          )}
        </div>
      </main>

      {/* ITEM DETAILS MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl">
            {/* Image Container */}
            {selectedItem.image && selectedItem.image.trim() !== '' ? (
              <div className="relative h-96 bg-gray-900">
                <Image
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Fallback if image fails to load
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                  }}
                  priority
                />
              </div>
            ) : (
              <div className="relative h-96 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4 opacity-30">📷</div>
                  <p className="text-gray-400 text-lg">No image available</p>
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            >
              ✕
            </button>

            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-3xl font-bold">{selectedItem.name}</h2>

                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium ${
                    selectedItem.type === 'veg'
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}
                >
                  {selectedItem.type === 'veg' ? 'Veg' : 'Non-veg'}
                </span>
              </div>

              <p className="text-gray-400 mb-6">
                {selectedItem.longDescription ||
                  selectedItem.description}
              </p>

              <span className="text-3xl font-bold text-amber-400">
                ₹{selectedItem.price.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}