'use client'

import React, { useEffect, useRef, useLayoutEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

export default function SmartPaperSection() {
  const masterRef = useRef<HTMLDivElement>(null)
  const smartPaperRef = useRef<HTMLElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const insideBoxMasterRef = useRef<HTMLElement>(null)
  const irisCircleRef = useRef<HTMLDivElement>(null)
  const boxContentRef = useRef<HTMLDivElement>(null)

  const [data, setData] = useState({
    boxImage: "/box_set_image.png",
    smartPaper: [
      {
        img: "",
        title: "We use special paper\nwith a nearly invisible\npattern",
        sub: "For the pen, it's a precise map",
        desc: "The pattern defines exact coordinates across the page, allowing the pen to capture every stroke with precision and consistency."
      },
      {
        img: "",
        title: "Looks like paper.\nWorks like a system.",
        sub: "For you, it’s just a blank sheet",
        desc: "You write freely, without grids, guides, or visible markers. The paper feels clean and familiar, keeping your focus on ideas instead of tools."
      },
      {
        img: "",
        title: "No delays. No glitches.\nNo random effects.",
        sub: "AI-powered structure",
        desc: "Handwriting is processed in real time and enriched quietly in the background. AI recognizes text, structure, and context to organize notes."
      },
      {
        img: "",
        title: "Everything you write is synced\nto your phone in real time",
        sub: "Your notes. Already there.",
        desc: "Every note is instantly transferred to your device and safely stored in your personal space."
      }
    ]
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${STRAPI_URL}/api/homepages?populate=*`)
        const json = await res.json()
        const attrs = json?.data?.[0]?.attributes || json?.data?.attributes || json?.data?.[0]

        if (attrs) {
          const resolveImg = (imgObj: any) => {
            if (!imgObj) return null
            const url = imgObj?.attributes?.url || imgObj?.data?.attributes?.url || imgObj?.url
            return url ? (url.startsWith("http") ? url : `${STRAPI_URL}${url}`) : null
          }

          const spImages = Array.isArray(attrs.smartPaperImages)
            ? attrs.smartPaperImages
            : attrs.smartPaperImages?.data || []

          setData(prev => ({
            boxImage: resolveImg(attrs.boxImage) || prev.boxImage,
            smartPaper: [
              {
                img: resolveImg(spImages[0]) || prev.smartPaper[0].img,
                title: attrs.spTitle1 || prev.smartPaper[0].title,
                sub: attrs.spSub1 || prev.smartPaper[0].sub,
                desc: attrs.spDesc1 || prev.smartPaper[0].desc,
              },
              {
                img: resolveImg(spImages[1]) || prev.smartPaper[1].img,
                title: attrs.spTitle2 || prev.smartPaper[1].title,
                sub: attrs.spSub2 || prev.smartPaper[1].sub,
                desc: attrs.spDesc2 || prev.smartPaper[1].desc,
              },
              {
                img: resolveImg(spImages[2]) || prev.smartPaper[2].img,
                title: attrs.spTitle3 || prev.smartPaper[2].title,
                sub: attrs.spSub3 || prev.smartPaper[2].sub,
                desc: attrs.spDesc3 || prev.smartPaper[2].desc,
              },
              {
                img: resolveImg(spImages[3]) || prev.smartPaper[3].img,
                title: attrs.spTitle4 || prev.smartPaper[3].title,
                sub: attrs.spSub4 || prev.smartPaper[3].sub,
                desc: attrs.spDesc4 || prev.smartPaper[3].desc,
              }
            ]
          }))
        }
      } catch (e) {
        console.error("Strapi fetch error:", e)
      }
    }
    fetchData()
  }, [])

  useIsomorphicLayoutEffect(() => {
    let ctx = gsap.context(() => {
      
      // Smart Paper Animation Flow
      if (smartPaperRef.current) {
        const paperTl = gsap.timeline({
          scrollTrigger: {
            trigger: smartPaperRef.current,
            start: "top top",
            end: "+=5500",
            pin: true,
            scrub: 1,
            anticipatePin: 1
          }
        })

        const slides = gsap.utils.toArray('.smart-slide') as HTMLElement[]
        const lines = gsap.utils.toArray('.smart-line') as HTMLElement[]

        if (slides.length > 0) {
          gsap.set(slides, { autoAlpha: 0 })
          gsap.set(".smart-line-container", { autoAlpha: 0 })

          paperTl.to(".intro-text", { opacity: 0, y: -50, duration: 0.5 }, 0)
            .to(".intro-bar", {
              scaleY: 1,
              stagger: 0.1,
              duration: 1.5,
              ease: "power2.inOut",
              transformOrigin: "top"
            }, 0)

          paperTl.set(introRef.current, { autoAlpha: 0 })
          paperTl.to([slides[0], ".smart-line-container"], { autoAlpha: 1, duration: 1 })

          slides.forEach((slide, i) => {
            if (i === 0) return
            const prevSlide = slides[i - 1]

            paperTl.to(prevSlide, { autoAlpha: 0, duration: 1 }, `fade${i}`)
              .to(slide, { autoAlpha: 1, duration: 1 }, `fade${i}`)
              .to(lines[i - 1], { backgroundColor: "rgba(255,255,255,0.3)", duration: 0.5 }, `fade${i}`)
              .to(lines[i], { backgroundColor: "rgba(255,255,255,1)", duration: 0.5 }, `fade${i}`)
          })
        }
      }

      // Inside The Box Animation
      if (insideBoxMasterRef.current) {
        const boxTl = gsap.timeline({
          scrollTrigger: {
            trigger: insideBoxMasterRef.current,
            start: "top top",
            end: "+=4000",
            pin: true,
            scrub: 1,
          }
        })

        boxTl.fromTo(irisCircleRef.current,
          { scale: 0, opacity: 1 },
          { scale: 300, duration: 2.5, ease: "power2.inOut" }
        )

        boxTl.fromTo(".inside-box-heading",
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          "-=1"
        )

        boxTl.to(".inside-box-heading", { opacity: 0, y: -50, duration: 1 }, "+=1")

        boxTl.fromTo(".box-reveal-line",
          { scaleY: 1 },
          { scaleY: 0, stagger: 0.05, duration: 1.5, ease: "power2.inOut", transformOrigin: "top" }
        )

        boxTl.fromTo(boxContentRef.current,
          { opacity: 0, y: 100 },
          { opacity: 1, y: 0, duration: 1.5 },
          "<"
        )

        boxTl.fromTo(".final-description",
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1.5 },
          "-=1"
        )

        boxTl.to({}, { duration: 1.5 })
      }

    }, masterRef)

    const timer = setTimeout(() => {
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
    }, 500)

    return () => {
      clearTimeout(timer)
      ctx.revert()
    }
  }, [data])

  return (
    <div ref={masterRef} className="bg-[#080808]">

      {/* Smart Paper Section */}
      <section id="about" ref={smartPaperRef} className="relative h-screen w-full bg-[#111] overflow-hidden text-white">
        {data.smartPaper.map((slide, index) => (
          <div
            key={index}
            className="smart-slide absolute inset-0 w-full h-full flex items-center justify-between invisible opacity-0"
          >
            <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
              {slide.img && (
                <img
                  src={slide.img}
                  className="w-full h-full object-cover"
                  alt={slide.sub}
                />
              )}
              <div className="absolute inset-0 bg-black/20"></div>
            </div>

            <div className="max-w-[1600px] mx-auto w-full h-full relative z-10 flex flex-col md:block px-6 pt-24 pb-16 md:p-0">
              
              <div className="w-full md:absolute md:top-[5%] md:left-16 md:w-[25%]">
                <h2 className="font-['Instrument_Serif'] text-[2.4rem] md:text-[clamp(2rem,2.5vw,3.5rem)] leading-[1.05] tracking-tight whitespace-pre-line drop-shadow-lg text-white">
                  {slide.title}
                </h2>
              </div>

              <div className="flex-1 md:hidden pointer-events-none"></div>

              <div className="w-full md:absolute md:bottom-[8%] md:right-16 md:max-w-[400px] flex flex-col gap-4 md:gap-6">
                <div className="w-full bg-[#1c1c1c]/95 md:bg-[#1c1c1c]/50 rounded-[1.5rem] p-6 md:p-8 shadow-2xl border border-white/5 backdrop-blur-md">
                  <h3 className="font-serif text-[1.1rem] md:text-[1.2rem] leading-snug">{slide.sub}</h3>
                </div>
                <div className="w-full bg-[#1c1c1c]/95 md:bg-[#1c1c1c]/50 rounded-[1.5rem] p-6 md:p-8 shadow-2xl border border-white/5 backdrop-blur-md">
                  <p className="text-white/80 md:text-white/70 text-[0.9rem] md:text-[0.95rem] leading-relaxed">{slide.desc}</p>
                </div>
              </div>

            </div>
          </div>
        ))}

        <div className="smart-line-container absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-30 invisible opacity-0">
          {data.smartPaper.map((_, i) => (
            <div key={i} className={`smart-line h-[2px] w-12 md:w-20 ${i === 0 ? 'bg-white' : 'bg-white/30'}`} />
          ))}
        </div>

        <div ref={introRef} className="absolute inset-0 z-50 bg-white flex items-center justify-center overflow-hidden">
          <h1 className="intro-text font-['Instrument_Serif'] text-[clamp(4rem,8vw,7rem)] text-center leading-[0.9] tracking-tight flex flex-col z-0 relative">
            <span className="text-black/50">Works with</span>
            <span className="text-black font-medium">smart paper</span>
          </h1>

          <div className="absolute inset-0 flex z-10 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="intro-bar flex-1 bg-[#111]"
                style={{ transform: 'scaleY(0)', transformOrigin: 'top' }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Inside The Box Section */}
      <section ref={insideBoxMasterRef} className="relative h-screen w-full bg-[#111] overflow-hidden">
        
        <div
          ref={irisCircleRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#f1f0ec] rounded-full z-10 pointer-events-none"
          style={{ transform: 'scale(0)' }}
        />

        <div className="absolute inset-0 bg-transparent z-20 flex flex-col items-center justify-center px-6 lg:px-10 text-black pointer-events-none">
          
          <div className="inside-box-heading text-center z-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
            <h2 className="font-['Instrument_Serif'] text-[clamp(4rem,10vw,8rem)] text-black/20 leading-[0.9] tracking-tight">Inside <br /><span className="text-black">the box</span></h2>
          </div>

          <div ref={boxContentRef} className="relative w-full max-w-[1300px] h-full flex flex-col md:flex-row justify-center items-center opacity-0 pointer-events-auto gap-8 md:gap-0">
            
            <div className="relative w-[280px] sm:w-[350px] md:w-[450px] lg:w-[500px] aspect-[4/5] bg-[#e8e8e8] rounded-2xl overflow-hidden shadow-2xl border border-black/5 z-20">
              <div className="absolute inset-0 z-10 flex flex-col">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="box-reveal-line flex-1 bg-[#f1f0ec]" />
                ))}
              </div>
              {data.boxImage && <img src={data.boxImage} className="w-full h-full object-cover" alt="Nota Set" />}
            </div>

            <div className="static md:absolute md:right-0 md:top-1/4 lg:top-[20%] w-full max-w-[320px] lg:max-w-[350px] z-20 text-center md:text-left">
              <div className="space-y-2 md:space-y-3">
                <h3 className="text-[1.1rem] md:text-2xl font-bold tracking-tight text-black leading-snug">
                  A complete, ready-to-use set
                </h3>
                <p className="text-[0.85rem] md:text-base text-black/80 leading-relaxed font-medium md:font-normal">
                  Smart pen, Smartpaper notepad, charging cable, and instructions — carefully packaged for a hassle-free start.
                </p>
              </div>
              <div className="final-description pt-6 mt-6 md:pt-8 md:mt-8 border-t border-black/10">
                <p className="font-serif text-[1rem] md:text-xl leading-snug text-black">
                  A precision smart pen with a solid aluminum body, designed for natural handwriting and accurate digital capture.
                  <span className="text-black/40"> Seamlessly connects to smart paper, translating every stroke into structured digital data.</span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}