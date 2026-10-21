import React from 'react';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  // Cores baseadas no Foundation UI Kit: Azul clínico (#176B9B) e Azul profundo (#103D5A)[cite: 7]
  const variants = {
    primary: "bg-[#176B9B] text-white hover:bg-[#103D5A] focus:ring-4 focus:ring-amber-500",
    secondary: "bg-white text-[#176B9B] border-2 border-[#176B9B] hover:bg-[#EAF2F8] focus:ring-4 focus:ring-amber-500",
    text: "text-[#176B9B] hover:text-[#103D5A] bg-transparent px-0 focus:ring-4 focus:ring-amber-500",
  };

  return (
    <button 
      className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-sm md:text-base inline-flex justify-center items-center ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}