import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';

const Hero: React.FC = () => {
  // Estados para controlar la animación del degradado
  const [gradientPosition, setGradientPosition] = useState(0);

  // Efecto para animar el degradado
  useEffect(() => {
    const interval = setInterval(() => {
      setGradientPosition((prevPosition) => (prevPosition + 1) % 100);
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  // Generamos un estilo dinámico para el degradado con animación
  const gradientStyle = {
    backgroundImage: `
      linear-gradient(
        ${gradientPosition}deg,
        rgba(59, 74, 140, 0.7),
        rgba(178, 34, 52, 0.7) 33%,
        rgba(255, 255, 255, 0.7) 66%,
        rgba(59, 74, 140, 0.7) 100%
      )
    `,
    backgroundSize: '400% 400%',
    animation: 'gradient-animation 15s ease infinite',
  };

  return (
    <section className="relative py-20 md:py-28">
      {/* Imagen de fondo */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: 'url("/assets/hero-background.jpg")' }}
      ></div>
      
      {/* Degradado con los colores de la bandera de USA */}
      <div 
        className="absolute inset-0 z-10" 
        style={gradientStyle}
      ></div>
      
      {/* Contenido */}
      <div className="relative container mx-auto px-4 flex flex-col items-center z-20">
        <h1 className="text-3xl md:text-5xl font-montserrat font-bold text-white text-center mb-6 drop-shadow-lg">
          Premium Chassis Solutions for Every Need
        </h1>
        <p className="text-lg md:text-xl text-white text-center max-w-3xl mb-8 drop-shadow-md">
          Explore our wide selection of high-quality chassis from leading manufacturers in the industry
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/products" className="bg-[#E30D16] hover:bg-[#c70b13] text-white font-montserrat font-semibold px-8 py-3 rounded-md transition-all duration-300 transform hover:scale-105 text-center shadow-md">
            View Products
          </Link>
          <Link href="/contact" className="bg-white hover:bg-neutral-200 text-primary font-montserrat font-semibold px-8 py-3 rounded-md transition-all duration-300 transform hover:scale-105 text-center shadow-md">
            Request Quote
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
