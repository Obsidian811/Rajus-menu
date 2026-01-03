'use client';

import { useState, useEffect } from 'react';
import { MenuItem, MenuCategory } from '../lib/types'; 
import { fetchMenuFromGoogleSheet } from '../lib/fetch-google-sheet-eng';
import Image from 'next/image';

// --- NEW CATEGORY STRUCTURE ---
// Note: The 'id' in the subCategories should match the 'category' field in your MenuItem data
// fetched from the Google Sheet, as this is what the filtering logic relies on.
type SubCategory = {
  id: string;
  name: string;
};

type ParentCategory = {
  id: string; // Used for the main tab ID
  name: string;
  icon: string;
  subCategories: SubCategory[];
};

// Define the new, hierarchical categories
const parentCategories: ParentCategory[] = [
  { id: 'breakfast', 
    name: 'Breakfast', 
    icon: '🍳', 
    subCategories: [{ id: 'Breakfast', name: 'All Day Breakfast' }] 
  },
  { id: 'beverage', 
    name: 'Beverage', 
    icon: '🥤', 
    subCategories: [{ id: 'Beverage', name: 'All Beverages' }] 
  },
  { id: 'soup', 
    name: 'Soup', 
    icon: '🍲', 
    subCategories: [
      { id: 'Soup', name: 'All Soups' }
    ] 
  },
  {
    id: 'special-starters',
    name: "Freddy's Special Starters",
    icon: '🍤',
    subCategories: [
      { id: 'Special Starters (Veg)', name: 'Veg' },
      { id: 'Special Starters (Non-veg)', name: 'Non-veg' },
      { id: 'Special Starters (Seafood)', name: 'Seafood' },
    ],
  },
  {
    id: 'chinese-starters',
    name: 'Chinese Starters',
    icon: '🥟',
    subCategories: [
      { id: 'Chinese Starters (Veg)', name: 'Veg' },
      { id: 'Chinese Starters (Chicken)', name: 'Chicken' },
      { id: 'Chinese Starters (Mutton)', name: 'Mutton' },
      { id: 'Chinese Starters (Seafood)', name: 'Seafood' },
    ],
  },
  {
    id: 'main-course',
    name: 'Main Course',
    icon: '🍛',
    subCategories: [
      { id: 'Fish Fry', name: 'Fish Fry' },
      { id: "Freddy's Special", name: "Freddy's Special" },
      { id: 'Biryani', name: 'Biryani' },
      { id: 'Thali', name: 'Thali' },
    ],
  },
  {
    id: 'chinese-dishes',
    name: 'Chinese Dishes',
    icon: '🍜',
    subCategories: [
      { id: 'Chinese (Rice)', name: 'Rice' },
      { id: 'Chinese (Noodles)', name: 'Noodles' },
    ],
  },
  {
    id: 'indian-gravy',
    name: 'Indian Gravy',
    icon: '🥘',
    subCategories: [
      { id: 'Indian Gravy (Veg)', name: 'Veg' },
      { id: 'Indian Gravy (Chicken)', name: 'Chicken' },
      { id: 'Indian Gravy (Mutton)', name: 'Mutton' },
      { id: 'Indian Gravy (Seafood)', name: 'Seafood' },
    ],
  },
  { id: 'breads', name: 'Breads', icon: '🫓', subCategories: [{ id: 'Breads', name: 'Roti/Naan/Parotha' }] },
  { id: 'juice-milkshakes', name: 'Juice & Milkshakes', icon: '🥛', subCategories: [{ id: 'Juice & Milkshakes', name: 'All Cool Drinks' }] },
];

// Helper function to get the first sub-category ID of a parent category
const getFirstSubCategory = (parentId: string): string => {
  const parent = parentCategories.find(p => p.id === parentId);
  return parent?.subCategories[0]?.id || '';
};

export default function EnglishMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categoryItems, setCategoryItems] = useState<MenuItem[]>([]);
  // Use a string for selectedCategory based on the 'id' in parentCategories
  const [selectedCategory, setSelectedCategory] = useState<string>('breakfast');
  // New state for selected sub-category. Initialize with the first sub-category of 'breakfast'
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>(getFirstSubCategory('breakfast'));
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const GOOGLE_CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQdPLFc73XvKGEZUYTGjJto0nfXBrt85rIDILZr1lil_-vr_RM_mFg5OgSpyRirX3zVKhNNOs8yy_AH/pub?output=csv";

  const handleBack = () => {
    sessionStorage.setItem('fromLanguageMenu', 'true');
    window.location.href = '/';
  };

  // --------------------------
  // LOAD CSV MENU ITEMS
  // --------------------------
  useEffect(() => {
    async function loadMenuItems() {
      const items = await fetchMenuFromGoogleSheet(GOOGLE_CSV_URL);

      const formatted: MenuItem[] = items
        .filter((item: any) => ((item.language || 'english').toLowerCase() === "english")) // Treat missing language as English
        .map((item: any) => ({
          id: String(item.id).trim(),
          name: String(item.name).trim(),
          // The 'category' from the CSV is now treated as the 'sub-category'
          category: String(item.category).trim(),
          price: Number(item.price) || 0,
          type: String(item.type).toLowerCase().trim() as 'veg' | 'non-veg',
          description: String(item.description || "").trim(),
          longDescription: String(item.longDescription || "").trim(),
          image: String(item.image || "").trim(),
          language: "English",
        }));

      console.log("Loaded items:", formatted); // Debug log
      setMenuItems(formatted);
    }

    loadMenuItems();
  }, []);

  // --------------------------
  // FILTER ITEMS BY SUB-CATEGORY
  // --------------------------
  useEffect(() => {
    if (menuItems.length === 0 || !selectedSubCategory) {
      setCategoryItems([]);
      return;
    }

    // Filter by the selectedSubCategory ID, which should match the item.category
    // Trim and lowercase for comparison to handle spacing issues
    const filtered = menuItems.filter(
      (item) => item.category.toLowerCase() === selectedSubCategory.toLowerCase()
    );

    console.log(`Filtered items for ${selectedSubCategory}:`, filtered); // Debug log
    setCategoryItems(filtered);
  }, [menuItems, selectedSubCategory]);

  // --------------------------
  // HANDLE MAIN CATEGORY CHANGE
  // --------------------------
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Automatically switch to the first sub-category of the newly selected main category
    setSelectedSubCategory(getFirstSubCategory(categoryId));
  };
  
  // Get the sub-categories for the currently selected main category
  const currentSubCategories = parentCategories.find(p => p.id === selectedCategory)?.subCategories || [];


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center w-full">
        <h1 className="pt-5 text-5xl font-bold mb-4 text-center bg-gradient-to-r from-amber-200 to-yellow-400 text-transparent bg-clip-text sm:mb-8 sm:w-auto">
          Our Menu
        </h1>

        <button
          onClick={handleBack}
          className="mx-auto mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors z-50 sm:fixed sm:top-4 sm:right-4 sm:mx-0 sm:mb-0"
        >
          Back to Languages
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
        
        {/* SUB-CATEGORY TABS (Only visible if there are sub-categories) */}
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
          {/* Display current sub-category name as a heading */}
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
                    {item.type}
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
                  View Details
                </button>
              )}
            </div>
          ))}

          {categoryItems.length === 0 && (
            <p className="text-center text-gray-400 py-10 text-lg">
              No items found in the **{selectedSubCategory}** section.
            </p>
          )}
        </div>
      </main>

      {/* ITEM DETAILS MODAL (UNCHANGED) */}
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
                  {selectedItem.type}
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