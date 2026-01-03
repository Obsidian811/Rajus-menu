'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { TransitionState } from './lib/types';

export default function Home() {
  const router = useRouter();
  const [transition, setTransition] = useState<TransitionState>({ 
    current: 'hotel',
    opacity: 0
  });

  useEffect(() => {
    // Check if we're coming back from a language menu
    const fromLanguageMenu: boolean = sessionStorage.getItem('fromLanguageMenu') === 'true';
    
    if (!fromLanguageMenu) {
      // Run transition sequence for fresh loads and reloads
      sessionStorage.removeItem('fromLanguageMenu');
      const transitionSequence = async () => {
        // Start with hotel name
        setTransition({ current: 'hotel', opacity: 1 });
        
        // Hotel name transition
        await new Promise(resolve => setTimeout(resolve, 2000));
        setTransition({ current: 'hotel', opacity: 0 });
        
        await new Promise(resolve => setTimeout(resolve, 500)); // Fade out time
        setTransition({ current: 'ad', opacity: 1 });
        
        // Advertisement transition
        await new Promise(resolve => setTimeout(resolve, 2000));
        setTransition({ current: 'ad', opacity: 0 });
        
        await new Promise(resolve => setTimeout(resolve, 500)); // Fade out time
        setTransition({ current: 'language', opacity: 1 });
      };

      transitionSequence();
    } else {
      // Skip transition for back navigation
      setTransition({ current: 'language', opacity: 1 });
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleLanguageSelect = (language: string) => {
    router.push(`/${language}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-900 to-rose-950 text-white">
      <div className="w-full max-w-4xl p-8">
        {/* Hotel Name Section */}
        {transition.current === 'hotel' && (
          <div 
            className="transition-opacity duration-500 ease-in-out text-center"
            style={{ opacity: transition.opacity }}
          >
            <h1 className="text-6xl font-bold mb-4">Aaron'S</h1>
            <p className="text-lg"></p>
          </div>
        )}

        {/* Advertisement Section */}
        {transition.current === 'ad' && (
          <div 
            className="transition-opacity duration-500 ease-in-out text-center"
            style={{ opacity: transition.opacity }}
          >
            <div className="relative w-full h-96">
              <Image
                src="/images/ad-placeholder.jpg"
                alt="Photo"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          </div>
        )}

        {/* Language Selection Section */}
        {transition.current === 'language' && (
          <div 
            className="transition-opacity duration-500 ease-in-out"
            style={{ opacity: transition.opacity }}
          >
            <h2 className="text-4xl font-bold text-center mb-8">Choose Your Language</h2>
            <div className="grid grid-cols-2 gap-6">
              <button
                onClick={() => handleLanguageSelect('English')}
                className="p-6 text-xl font-semibold bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
              >
                English
              </button>
              <button
                onClick={() => handleLanguageSelect('Hindi')}
                className="p-6 text-xl font-semibold bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
              >
                हिंदी
              </button>
              <button
                onClick={() => handleLanguageSelect('Gujarati')}
                className="p-6 text-xl font-semibold bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
              >
                ગુજરાતી
              </button>
              <button
                onClick={() => handleLanguageSelect('Marathi')}
                className="p-6 text-xl font-semibold bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
              >
                मराठी
              </button>
            </div>
          </div>
        )}
        
        {/* Debug button - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <button
            onClick={() => {
              localStorage.removeItem('hasSeenIntro');
              window.location.reload();
            }}
            className="fixed bottom-4 right-4 px-4 py-2 bg-gray-800 text-white rounded-lg opacity-50 hover:opacity-100"
          >
            Reset Intro
          </button>
        )}
      </div>
    </div>
  );
}
