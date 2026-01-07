'use client';

import { useState, useEffect } from 'react';
import { MenuItem } from '../lib/types';
import { fetchMenuFromGoogleSheet } from '../lib/fetch-google-sheet-eng';
import Image from 'next/image';

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

const parentCategories: ParentCategory[] = [
  {
    id: 'drinks',
    name: 'Drinks',
    icon: '🥤',
    subCategories: [
      { id: 'Fiz Drinks', name: 'Fizz Drinks' },
      { id: 'Float', name: 'Float' }
    ]
  },
  {
    id: 'coffee',
    name: 'Coffee',
    icon: '☕',
    subCategories: [
      { id: 'Cold Coffee', name: 'Cold Coffee' },
      { id: 'Hot Coffee', name: 'Hot Coffee' }
    ]
  },
  {
    id: 'milkshakes',
    name: 'Milkshakes',
    icon: '🥛',
    subCategories: [{ id: 'Milkshakes', name: 'Milkshakes' }]
  },
  {
    id: 'ice cream',
    name: 'Ice Cream',
    icon: '🍦',
    subCategories: [{ id: 'Ice Cream', name: 'Ice Cream' }]
  },
  {
    id: 'burger',
    name: 'Burgers',
    icon: '🍔',
    subCategories: [{ id: 'Burger', name: 'Burgers' }]
  },
  {
    id: 'sandwiches',
    name: 'Sandwiches',
    icon: '🥪',
    subCategories: [
      { id: 'Soft Bread Sandwich', name: 'Soft Bread Sandwiches' },
      { id: 'Grilled Sandwich', name: 'Veg Grilled Sandwiches' },
      { id: 'Toast Sandwich', name: 'Toast Sandwiches' },
      { id: 'Chicken Grilled Sandwich', name: 'Chicken Grilled Sandwiches' }
    ]
  },
  {
    id: 'french fires',
    name: 'French Fries',
    icon: '🍟',
    subCategories: [{ id: 'French Fries', name: 'French Fries' }]
  },
  {
    id: 'frankie',
    name: 'Frankie',
    icon: '🌯',
    subCategories: [
      { id: 'Veg Frankie', name: 'Veg Frankie' },
      { id: 'Egg Frankie', name: 'Egg Frankie' },
      { id: 'Chicken Frankie', name: 'Chicken Frankie' }
    ]
  }
];

const getFirstSubCategory = (parentId: string): string => {
  const parent = parentCategories.find(p => p.id === parentId);
  return parent?.subCategories[0]?.id || '';
};

export default function EnglishMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categoryItems, setCategoryItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('drinks');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>(
    getFirstSubCategory('drinks')
  );

  const GOOGLE_CSV_URL =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vSU3feEUr0Rekmp_o-x5zoaH-1X9KQbNqAgRFQhuJ1brX_ygTVhLDfIujd3DC4HsE7xMBNWuu0UeUr_/pub?output=csv';

  const handleBack = () => {
    sessionStorage.setItem('fromLanguageMenu', 'true');
    window.location.href = '/';
  };

  // LOAD MENU
  useEffect(() => {
    async function loadMenuItems() {
      const items = await fetchMenuFromGoogleSheet(GOOGLE_CSV_URL);

      const formatted: MenuItem[] = items
        .filter(
          (item: any) =>
            ((item.language || 'english').toLowerCase() === 'english')
        )
        .map((item: any) => ({
          id: String(item.id).trim(),
          name: String(item.name).trim(),
          category: String(item.category).trim(),
          price: Number(item.price) || 0,
          type: String(item.type).toLowerCase().trim() as 'veg' | 'non-veg',
          description: String(item.description || '').trim(),
          longDescription: String(item.longDescription || '').trim(),
          image: String(item.image || '').trim(),
          language: 'English'
        }));

      setMenuItems(formatted);
    }

    loadMenuItems();
  }, []);

  // FILTER ITEMS
  useEffect(() => {
    if (!selectedSubCategory) return;

    const filtered = menuItems.filter(
      item =>
        item.category.toLowerCase() === selectedSubCategory.toLowerCase()
    );

    setCategoryItems(filtered);
  }, [menuItems, selectedSubCategory]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory(getFirstSubCategory(categoryId));
  };

  const currentSubCategories =
    parentCategories.find(p => p.id === selectedCategory)?.subCategories || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-amber-100 text-black">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center w-full relative">
        <h1 className="text-3xl font-bold -rotate-12 text-blue-800 sm:fixed sm:top-4 sm:left-4">
          Raju's
        </h1>

        <h1 className="pt-6 text-5xl font-bold text-center text-blue-900">
          Our Menu
        </h1>

        <button
          onClick={handleBack}
          className="mx-auto mt-4 sm:mt-0 sm:fixed sm:top-4 sm:right-4 px-4 py-2 bg-blue-800 text-white rounded-md"
        >
          Back
        </button>
      </div>

      {/* CATEGORY TABS (UNCHANGED) */}
      <header className="bg-black/20 backdrop-blur-sm sticky top-0 z-10 mt-6">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {parentCategories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full ${
                  selectedCategory === category.id
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-800 text-gray-300'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
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
                      item.type === 'veg' ? 'bg-green-600' : 'bg-red-600'
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
              No items available
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
