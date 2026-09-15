'use client'

import React, { useEffect, useRef, useLayoutEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

export default function DetailSpecificationsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const introTextRef = useRef<HTMLParagraphElement>(null)

  const [isAdapterHovered, setIsAdapterHovered] = useState(false)

  const [data, setData] = useState({
    intro: "A precision smart pen with a solid aluminum body, designed for natural handwriting and accurate digital capture. Seamlessly connects to smart paper, translating every stroke into structured digital data — no screens, no distractions, just writing.",
    pen: {
      title: "The NŌTA Smart Pen",
      desc1: "Aluminum body, USB-C charging, physical control button, and Bluetooth connectivity.",
      desc2: "Up to 8 hours of active use with a lightweight, balanced design for everyday writing.",
      img: "/pen_tip_close.jpg"
    },
    adapter: {
      title: "Charging Adapter",
      desc1: "Compact USB-C power adapter with stable output for everyday charging.",
      desc2: "Designed for safe, efficient power delivery with minimal heat.",
      img1: "/adapter_detail.jpg",
      img2: "/adapter_hover.jpg"
    },
    grid: [
      { title: "Flush-fit precision cap", media: "/cap_detail.jpg", type: "image" },
      { title: "Refined colors. Personal expression", media: "/colored_pens.jpg", type: "image" },
      { title: "Durable metal nib, low-profile control button", media: "/nib_video.mp4", type: "video" },
      { title: "Aluminum body", media: "/body_detail.jpg", type: "image" },
      { title: "", media: "/button_detail.jpg", type: "image" },
      { title: "Seamless connection", media: "/extra_detail.jpg", type: "image" }
    ]
  })

  const words = data.intro.split(" ")

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${STRAPI_URL}/api/homepages?populate=*`)
        const json = await res.json()

        const attrs = json?.data?.[0]?.attributes || json?.data?.attributes || json?.data?.[0] || json?.data;

        if (attrs) {

          const resolveMedia = (mediaObj: any) => {
            if (!mediaObj) return null;
            let url = mediaObj?.url ||
              mediaObj?.attributes?.url ||
              mediaObj?.data?.attributes?.url ||
              mediaObj?.data?.[0]?.attributes?.url ||
              mediaObj?.data?.[0]?.url ||
              (Array.isArray(mediaObj) ? mediaObj[0]?.url : null);
            return url ? (url.startsWith('http') ? url : `${STRAPI_URL}${url}`) : null;
          }

          const checkIsVideo = (mediaObj: any) => {
            if (!mediaObj) return false;
            let mime = mediaObj?.mime ||
              mediaObj?.attributes?.mime ||
              mediaObj?.data?.attributes?.mime ||
              mediaObj?.data?.[0]?.attributes?.mime ||
              (Array.isArray(mediaObj) ? mediaObj[0]?.mime : null);

            if (mime && mime.includes('video')) return true;

            const url = resolveMedia(mediaObj);
            if (url && (url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.webm') || url.toLowerCase().endsWith('.mov'))) return true;

            return false;
          }

          setData(prev => {
            const media1 = resolveMedia(attrs.grid1Media);
            const media2 = resolveMedia(attrs.grid2Media);
            const media3 = resolveMedia(attrs.grid3Media);
            const media4 = resolveMedia(attrs.grid4Media);
            const media5 = resolveMedia(attrs.grid5Media);
            const media6 = resolveMedia(attrs.grid6Media);

            return {
              ...prev,
              pen: {
                title: attrs.penTitle || prev.pen.title,
                desc1: attrs.penDesc1 || prev.pen.desc1,
                desc2: attrs.penDesc2 || prev.pen.desc2,
                img: resolveMedia(attrs.spenImage || attrs.penImage) || prev.pen.img
              },
              adapter: {
                title: attrs.adapterTitle || prev.adapter.title,
                desc1: attrs.adapterDesc1 || prev.adapter.desc1,
                desc2: attrs.adapterDesc2 || prev.adapter.desc2,
                img1: resolveMedia(attrs.adapterImage1) || prev.adapter.img1,
                img2: resolveMedia(attrs.adapterImage2) || prev.adapter.img2
              },
              grid: [
                {
                  title: attrs.grid1Title !== undefined ? attrs.grid1Title : prev.grid[0].title,
                  media: media1 || prev.grid[0].media,
                  type: media1 ? (checkIsVideo(attrs.grid1Media) ? 'video' : 'image') : prev.grid[0].type
                },
                {
                  title: attrs.grid2Title !== undefined ? attrs.grid2Title : prev.grid[1].title,
                  media: media2 || prev.grid[1].media,
                  type: media2 ? (checkIsVideo(attrs.grid2Media) ? 'video' : 'image') : prev.grid[1].type
                },
                {
                  title: attrs.grid3Title !== undefined ? attrs.grid3Title : prev.grid[2].title,
                  media: media3 || prev.grid[2].media,
                  type: media3 ? (checkIsVideo(attrs.grid3Media) ? 'video' : 'image') : 'video'
                },
                {
                  title: attrs.grid4Title !== undefined ? attrs.grid4Title : prev.grid[3].title,
                  media: media4 || prev.grid[3].media,
                  type: media4 ? (checkIsVideo(attrs.grid4Media) ? 'video' : 'image') : prev.grid[3].type
                },
                {
                  title: attrs.grid5Title !== undefined ? attrs.grid5Title : prev.grid[4].title,
                  media: media5 || prev.grid[4].media,
                  type: media5 ? (checkIsVideo(attrs.grid5Media) ? 'video' : 'image') : prev.grid[4].type
                },
                {
                  title: attrs.grid6Title !== undefined ? attrs.grid6Title : prev.grid[5].title,
                  media: media6 || prev.grid[5].media,
                  type: media6 ? (checkIsVideo(attrs.grid6Media) ? 'video' : 'image') : prev.grid[5].type
                }
              ]
            }
          })
        }
      } catch (err) {
        console.error("Strapi fetch error:", err)
      }
    }
    fetchData()
  }, [])

  useIsomorphicLayoutEffect(() => {
    let ctx = gsap.context(() => {
      if (introTextRef.current) {
        gsap.to(".spec-word", {
          color: "#000000",
          stagger: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: introTextRef.current,
            start: "top 75%",
            end: "bottom 40%",
            scrub: true,
          }
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [data])

  return (
    <div ref={containerRef} className="w-full flex flex-col bg-[#000000]">

      {/* White Background & Text Highlight */}
      <section id="inside-the-box" className="w-full bg-white text-black pt-32 md:pt-40 pb-16 md:pb-24 px-6 md:px-16 selection:bg-black selection:text-white">
        <div className="max-w-[1200px] mx-auto flex justify-center">
          <p
            ref={introTextRef}
            className="font-['Instrument_Serif'] text-[clamp(1.8rem,3.5vw,3.5rem)] leading-[1.1] tracking-tight text-center"
          >
            {words.map((word, i) => (
              <span key={i} className="spec-word text-[#d1d1d1] inline-block mr-[0.25em] transition-colors duration-300">
                {word}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/*PEN & ADAPTER */}
      <section className="w-full bg-[#f4f4f4] text-black">
        <div className="grid grid-cols-1 md:grid-cols-2">

          <div className="relative w-full h-[500px] md:h-[800px] overflow-hidden">
            <img src={data.pen.img} alt={data.pen.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute top-8 md:top-12 right-6 md:right-12 text-right max-w-[280px] md:max-w-sm z-10 pointer-events-none">
              <h3 className="font-semibold text-xl md:text-[1.8rem] mb-2 md:mb-3 tracking-tight">{data.pen.title}</h3>
              <p className="text-black/80 text-[0.9rem] md:text-[1.05rem] leading-relaxed mb-2">{data.pen.desc1}</p>
              <p className="text-black/80 text-[0.9rem] md:text-[1.05rem] leading-relaxed">{data.pen.desc2}</p>
            </div>
          </div>

          <div
            className="relative w-full h-[500px] md:h-[800px] overflow-hidden cursor-pointer group"
            onMouseEnter={() => setIsAdapterHovered(true)}
            onMouseLeave={() => setIsAdapterHovered(false)}
          >
            <img
              src={data.adapter.img1}
              alt={data.adapter.title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isAdapterHovered ? 'opacity-0' : 'opacity-100'}`}
            />
            {data.adapter.img2 && (
              <img
                src={data.adapter.img2}
                alt={`${data.adapter.title} Hover`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isAdapterHovered ? 'opacity-100' : 'opacity-0'}`}
              />
            )}
            <div className="absolute top-8 md:top-12 right-6 md:right-12 text-right max-w-[280px] md:max-w-sm z-10 pointer-events-none">
              <h3 className="font-semibold text-xl md:text-[1.8rem] mb-2 md:mb-3 tracking-tight">{data.adapter.title}</h3>
              <p className="text-black/80 text-[0.9rem] md:text-[1.05rem] leading-relaxed mb-2">{data.adapter.desc1}</p>
              <p className="text-black/80 text-[0.9rem] md:text-[1.05rem] leading-relaxed">{data.adapter.desc2}</p>
            </div>
          </div>

        </div>
      </section>

      <section className="w-full bg-[#000000] py-10 md:py-16 px-4 md:px-8">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-4 md:gap-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 md:h-[75vh] md:min-h-[600px]">
            
            <div className="bg-[#111111] rounded-[32px] md:rounded-[48px] overflow-hidden relative flex items-center justify-center w-full h-[350px] md:h-full">
              {data.grid[0].type === 'video' ? (
                <video key={data.grid[0].media} src={data.grid[0].media} className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline />
              ) : (
                <img src={data.grid[0].media} className="absolute inset-0 w-full h-full object-cover" alt="" />
              )}
              {data.grid[0].title?.trim() && (
                <div className="absolute z-10 bg-[#1c1c1c]/70 backdrop-blur-lg px-5 md:px-6 py-2.5 md:py-3 rounded-full border border-white/5">
                  <p className="text-white text-xs md:text-base font-medium m-0">{data.grid[0].title}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 md:gap-8 w-full h-full">
              
              <div className="flex-1 bg-[#111111] rounded-[32px] md:rounded-[48px] overflow-hidden relative flex items-center justify-center w-full h-[250px] md:h-auto min-h-[200px]">
                {data.grid[1].type === 'video' ? (
                  <video key={data.grid[1].media} src={data.grid[1].media} className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline />
                ) : (
                  <img src={data.grid[1].media} className="absolute inset-0 w-full h-full object-cover" alt="" />
                )}
                {data.grid[1].title?.trim() && (
                  <div className="absolute z-10 bg-[#1c1c1c]/70 backdrop-blur-lg px-5 md:px-6 py-2.5 md:py-3 rounded-full border border-white/5">
                    <p className="text-white text-xs md:text-base font-medium m-0">{data.grid[1].title}</p>
                  </div>
                )}
              </div>
              
              <div className="flex-1 bg-[#111111] rounded-[32px] md:rounded-[48px] overflow-hidden relative flex items-center justify-center w-full h-[250px] md:h-auto min-h-[200px]">
                {data.grid[3].type === 'video' ? (
                  <video key={data.grid[3].media} src={data.grid[3].media} className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline />
                ) : (
                  <img src={data.grid[3].media} className="absolute inset-0 w-full h-full object-cover" alt="" />
                )}
                {data.grid[3].title?.trim() && (
                  <div className="absolute z-10 bg-[#1c1c1c]/70 backdrop-blur-lg px-5 md:px-6 py-2.5 md:py-3 rounded-full border border-white/5">
                    <p className="text-white text-xs md:text-base font-medium m-0">{data.grid[3].title}</p>
                  </div>
                )}
              </div>

            </div>
          </div>

          <div className="w-full h-[350px] md:h-[80vh] bg-[#111111] rounded-[32px] md:rounded-[100px] overflow-hidden relative flex items-center justify-center">
            {data.grid[2].type === 'video' ? (
              <video 
                key={data.grid[2].media}
                src={data.grid[2].media} 
                className="absolute inset-0 w-full h-full object-cover" 
                autoPlay 
                loop 
                muted 
                playsInline 
              />
            ) : (
              <img src={data.grid[2].media} className="absolute inset-0 w-full h-full object-cover" alt="" />
            )}

            {data.grid[2].title?.trim() && (
              <div className="absolute z-10 bg-[#1c1c1c]/70 backdrop-blur-lg px-6 md:px-8 py-3 md:py-4 rounded-full border border-white/5">
                <p className="text-white text-sm md:text-lg font-medium m-0">{data.grid[2].title}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 h-auto md:h-[60vh] md:min-h-[400px]">
            
            <div className="md:col-span-8 bg-[#111111] rounded-[32px] md:rounded-[48px] overflow-hidden relative flex items-center justify-center w-full h-[300px] md:h-full">
              {data.grid[4].type === 'video' ? (
                <video key={data.grid[4].media} src={data.grid[4].media} className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline />
              ) : (
                <img src={data.grid[4].media} className="absolute inset-0 w-full h-full object-cover" alt="" />
              )}
              {data.grid[4].title?.trim() && (
                <div className="absolute z-10 bg-[#1c1c1c]/70 backdrop-blur-lg px-5 md:px-6 py-2.5 md:py-3 rounded-full border border-white/5">
                  <p className="text-white text-xs md:text-base font-medium m-0">{data.grid[4].title}</p>
                </div>
              )}
            </div>
            <div className="md:col-span-4 bg-[#111111] rounded-[32px] md:rounded-[48px] md:rounded-bl-none overflow-hidden relative flex items-center justify-center w-full h-[300px] md:h-full">
              {data.grid[5].type === 'video' ? (
                <video key={data.grid[5].media} src={data.grid[5].media} className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline />
              ) : (
                <img src={data.grid[5].media} className="absolute inset-0 w-full h-full object-cover" alt="" />
              )}
              {data.grid[5].title?.trim() && (
                <div className="absolute z-10 bg-[#1c1c1c]/70 backdrop-blur-lg px-5 md:px-6 py-2.5 md:py-3 rounded-full border border-white/5">
                  <p className="text-white text-xs md:text-base font-medium m-0">{data.grid[5].title}</p>
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

    </div>
  )
}