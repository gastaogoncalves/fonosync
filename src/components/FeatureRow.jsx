import React from 'react';

export default function FeatureRow({ title, description, badge, reverse = false }) {
  return (
    <div className={`grid md:grid-cols-2 gap-12 lg:gap-24 items-center ${reverse ? 'md:flex-row-reverse' : ''}`}>
      <div className={reverse ? 'md:order-2' : ''}>
        {badge && <div className="mb-4 text-[#176B9B]">{badge}</div>}
        <h3 className="text-3xl font-bold mb-4 font-serif text-[#103D5A]">{title}</h3>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">{description}</p>
        <button className="text-[#176B9B] font-medium hover:underline flex items-center gap-2 focus:ring-2 focus:ring-amber-500 rounded px-1">
          Saiba mais <span aria-hidden="true">→</span>
        </button>
      </div>
      
      {/* Placeholder para os gráficos de aderência e fluência[cite: 8] */}
      <div className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 ${reverse ? 'md:order-1' : ''}`}>
        <div className="aspect-[4/3] bg-[#EAF2F8] rounded-xl flex items-center justify-center text-[#176B9B]">
          Ilustração / Gráfico do Painel
        </div>
      </div>
    </div>
  );
}