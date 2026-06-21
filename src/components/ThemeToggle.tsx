/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ darkMode, onToggle }) => {
  return (
    <button
      id="theme-toggle-btn"
      onClick={onToggle}
      className={`p-2 rounded-xl transition-all duration-300 flex items-center justify-center border ${
        darkMode
          ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700 hover:text-amber-300 shadow-lg shadow-amber-950/10'
          : 'bg-white border-slate-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 shadow-md shadow-indigo-100/30'
      }`}
      aria-label="Karanlık/Aydınlık mod değiştir"
      title={darkMode ? 'Aydınlık Moda Geç' : 'Karanlık Moda Geç'}
    >
      {darkMode ? (
        <Sun className="w-5 h-5 animate-pulse" />
      ) : (
        <Moon className="w-5 h-5 transition-transform hover:rotate-12" />
      )}
    </button>
  );
};
