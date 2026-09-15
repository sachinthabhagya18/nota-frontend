'use client'

import React, { useEffect, useRef, useLayoutEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

interface ColorVariant {
  id?: string;
  leftText: string;
  rightText: string;
  bgColor: string;
  textColor: string;
  penImage: string;
}

const defaultVariants: ColorVariant[] = [
  {
    id: 'initial',
    leftText: 'Impossible to',
    rightText: 'overthink',
    bgColor: '#f1f0ec',
    textColor: '#ffffff',
    penImage: '/nota-pen-vertical.png'
  },
  {
    id: 'graphite',
    leftText: 'Graphite Black.',
    rightText: 'Clarity in silence.',
    bgColor: '#080808',
    textColor: '#ffffff',
    penImage: '/nota-pen-graphite.png'
  },
  {
    id: 'mist-blue',
    leftText: 'Mist Blue.',
    rightText: 'Light thinking.',
    bgColor: '#1a2b3c',
    textColor: '#ffffff',
    penImage: '/nota-pen-blue.png'
  },
  {
    id: 'precision-red',
    leftText: 'Precision Red.',
    rightText: 'Form follows thought.',
    bgColor: '#3d0a0a',
    textColor: '#ffffff',
    penImage: '/nota-pen-red.png'
  },
  {
    id: 'bright-orange',
    leftText: 'Bright Orange.',
    rightText: 'Steady focus.',
    bgColor: '#7c2d12',
    textColor: '#ffffff',
    penImage: '/nota-pen-orange.png'
  }
]

export default function ColorShowcase() {
  const containerRef = useRef<HTMLElement>(null)
  const [variants, setVariants] = useState<ColorVariant[]>(defaultVariants)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    async function fetchColorData() {
      try {
        const fetchUrl = `${STRAPI_URL}/api/homepages?populate=colorVariants.penImage`;
        const res = await fetch(fetchUrl);
        const json = await res.json();
        const attrs = json?.data?.[0]?.attributes || json?.data?.attributes || json?.data?.[0];

        if (attrs && attrs.colorVariants) {
          const resolveImg = (imgObj: any) => {
            if (!imgObj) return null;
            let url = imgObj?.url || imgObj?.attributes?.url || imgObj?.data?.attributes?.url;
            if (!url && Array.isArray(imgObj)) url = imgObj[0]?.url;
            if (!url && Array.isArray(imgObj?.data)) url = imgObj?.data[0]?.attributes?.url;

            return url ? (url.startsWith("http") ? url : `${STRAPI_URL}${url}`) : null;
          };

          const mapped = attrs.colorVariants.map((item: any, idx: number) => ({
            id: item.id?.toString() || idx.toString(),
            leftText: item.leftText || defaultVariants[idx]?.leftText || '',
            rightText: item.rightText || defaultVariants[idx]?.rightText || '',
            bgColor: item.bgColor || defaultVariants[idx]?.bgColor || '#080808',
            textColor: item.textColor || defaultVariants[idx]?.textColor || '#ffffff', 
            penImage: resolveImg(item.penImage) || defaultVariants[idx]?.penImage || ''
          }));

          if (mapped.length > 0) {
            setVariants(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to load color variants from Strapi:", err);
      }
    }
    fetchColorData();
  }, []);

  useIsomorphicLayoutEffect(() => {
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: `+=${variants.length * 1000}`,
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
              const progress = self.progress;
              const idx = Math.min(
                variants.length - 1,
                Math.floor(progress * variants.length)
              );
              setCurrentIndex(idx);
            }
          }
        });

        variants.forEach((variant, index) => {
          if (index === 0) return;

          tl.to(".variant-text", {
            opacity: 0,
            y: -20,
            duration: 0.4,
          }, `state-${index}`)

          tl.call(() => {
            setCurrentIndex(index);
          }, undefined, `state-${index}+=0.4`)

          tl.to(".variant-text", {
            opacity: 1,
            y: 0,
            duration: 0.4,
          }, `state-${index}+=0.5`)
        });
      });

      mm.add("(max-width: 767px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: `+=${variants.length * 800}`,
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
              const progress = self.progress;
              const idx = Math.min(
                variants.length - 1,
                Math.floor(progress * variants.length)
              );
              setCurrentIndex(idx);
            }
          }
        });

        variants.forEach((variant, index) => {
          if (index === 0) return;

          tl.to(".variant-text", {
            opacity: 0,
            y: -15,
            duration: 0.4,
          }, `state-${index}`)

          tl.call(() => {
            setCurrentIndex(index);
          }, undefined, `state-${index}+=0.4`)

          tl.to(".variant-text", {
            opacity: 1,
            y: 0,
            duration: 0.4,
          }, `state-${index}+=0.5`)
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, [variants]);

  const activeVariant = variants[currentIndex] || variants[0];

  return (
    <section 
      ref={containerRef} 
      className="relative h-screen w-full flex items-center justify-center overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: activeVariant.bgColor }}
    >
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
        {variants.map((variant, index) => (
          <img 
            key={variant.id || index}
            src={variant.penImage} 
            alt={`Nota Pen Variant ${index}`} 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-[1300px] mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center h-full pointer-events-none pt-12 md:pt-0">
        
        <div className="w-full md:flex-1 flex justify-center md:justify-end pr-0 md:pr-12 lg:pr-20 text-center md:text-right">
          <h2 
            className="variant-text font-['Instrument_Serif'] text-[clamp(2rem,8vw,3.8rem)] md:text-[clamp(2.5rem,5.5vw,5.5rem)] tracking-tight leading-tight md:leading-none transition-colors duration-300 drop-shadow-md"
            style={{ color: activeVariant.textColor }}
          >
            {activeVariant.leftText}
          </h2>
        </div>

        <div className="hidden md:block w-[80px] md:w-[150px] lg:w-[200px] shrink-0" aria-hidden="true"></div>

        <div className="w-full md:flex-1 flex justify-center md:justify-start pl-0 md:pl-12 lg:pl-20 text-center md:text-left mt-2 md:mt-0">
          <h2 
            className="variant-text font-['Instrument_Serif'] text-[clamp(2rem,8vw,3.8rem)] md:text-[clamp(2.5rem,5.5vw,5.5rem)] tracking-tight leading-tight md:leading-none transition-colors duration-300 drop-shadow-md"
            style={{ color: activeVariant.textColor }}
          >
            {activeVariant.rightText}
          </h2>
        </div>

      </div>

      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-30">
        {variants.map((_, i) => (
          <div 
            key={i} 
            className="h-[2px] w-8 md:w-20 transition-all duration-300"
            style={{ 
              backgroundColor: activeVariant.textColor, 
              opacity: i === currentIndex ? 1 : 0.3 
            }}
          />
        ))}
      </div>
    </section>
  )
}