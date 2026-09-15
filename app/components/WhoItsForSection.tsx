'use client'

import React, { useEffect, useRef, useLayoutEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

export default function WhoItsForSection() {
  const containerRef = useRef<HTMLElement>(null)
  const textWrapperRef = useRef<HTMLDivElement>(null)
  const videoPaddingRef = useRef<HTMLDivElement>(null)
  const videoBoxRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [videoUrl, setVideoUrl] = useState<string>('')

  const introText = "Some thoughts need time, space, and a physical trace to exist. Writing by hand creates focus, presence, and a deeper connection with ideas. This tool is built around that simple truth."
  const words = introText.split(" ")

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${STRAPI_URL}/api/homepages?populate=*`)
        const json = await res.json()
        const attrs = json?.data?.[0]?.attributes || json?.data?.attributes || json?.data?.[0]

        if (attrs) {
          const resolveMediaUrl = (mediaObj: any) => {
            if (!mediaObj) return null
            let url = mediaObj?.url || mediaObj?.data?.attributes?.url
            if (!url && Array.isArray(mediaObj)) url = mediaObj[0]?.url
            if (!url && Array.isArray(mediaObj?.data)) url = mediaObj?.data[0]?.attributes?.url
            return url ? (url.startsWith('http') ? url : `${STRAPI_URL}${url}`) : null
          }

          const vid = resolveMediaUrl(attrs.whoItsForVideo)
          if (vid) {
            setVideoUrl(vid)
          }
        }
      } catch (err) {
        console.error("Strapi fetch error in WhoItsForSection:", err)
      }
    }
    fetchData()
  }, [])

  useIsomorphicLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.set(textWrapperRef.current, { autoAlpha: 0 })

      let mm = gsap.matchMedia()

      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=8000",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          }
        })

        tl.to(textWrapperRef.current, {
          autoAlpha: 1,
          duration: 1.2,
          ease: "power2.out",
        })

        tl.to(".intro-word", {
          color: "#ffffff",
          stagger: 0.05,
          duration: 1.5,
          ease: "none"
        }, "+=0.2")

        tl.fromTo(".fade-para",
          { autoAlpha: 0, y: 30 },
          { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out" }
        )

        tl.to(textWrapperRef.current, { y: "-15vh", duration: 1 }, "+=0.4")
        tl.fromTo(".audience-1",
          { autoAlpha: 0, x: 80 },
          { autoAlpha: 1, x: 0, duration: 1, ease: "power2.out" },
          "<"
        )

        tl.to(textWrapperRef.current, { y: "-35vh", duration: 1 }, "+=0.4")
        tl.fromTo(".audience-2",
          { autoAlpha: 0, x: 80 },
          { autoAlpha: 1, x: 0, duration: 1, ease: "power2.out" },
          "<"
        )

        tl.to(textWrapperRef.current, { y: "-55vh", duration: 1 }, "+=0.4")
        tl.fromTo(".audience-3",
          { autoAlpha: 0, x: 80 },
          { autoAlpha: 1, x: 0, duration: 1, ease: "power2.out" },
          "<"
        )

        tl.to(textWrapperRef.current, {
          y: () => -(videoPaddingRef.current?.offsetTop || 0),
          duration: 3,
          ease: "power2.inOut"
        }, "+=0.6")

        tl.to(videoPaddingRef.current, {
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 0,
          duration: 3,
          ease: "power2.inOut"
        }, "<")

        tl.to(videoBoxRef.current, {
          maxWidth: "100vw",
          height: "100vh",
          borderRadius: "0px",
          duration: 3,
          ease: "power2.inOut"
        }, "<")

        tl.to({}, { duration: 2 })

        tl.to(videoBoxRef.current, {
          autoAlpha: 0,
          duration: 1.5,
          ease: "power2.inOut"
        })
      })

      mm.add("(max-width: 767px)", () => {
        gsap.set(textWrapperRef.current, { autoAlpha: 1, position: 'relative' })
        gsap.set(".intro-word, .fade-para, .audience-1, .audience-2, .audience-3", { autoAlpha: 1, color: "#ffffff", x: 0, y: 0 })
      })

    }, containerRef)

    const timer = setTimeout(() => {
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
    }, 700)

    return () => {
      clearTimeout(timer)
      ctx.revert()
    }
  }, [videoUrl])

  return (
    <section id='who-its-for' ref={containerRef} className="relative min-h-screen md:h-screen w-full bg-black text-white overflow-x-hidden md:overflow-hidden selection:bg-white selection:text-black">
      <div
        ref={textWrapperRef}
        className="md:absolute top-0 inset-x-0 w-full flex flex-col items-center invisible md:visible will-change-transform"
      >
        <div className="w-full max-w-[1500px] px-6 sm:px-10 lg:px-16 pt-20 md:pt-28 pb-12 md:pb-16">
          <div className="mb-12 md:mb-20 pointer-events-auto">
            <p className="font-['Instrument_Serif'] text-[clamp(2.2rem,7vw,3.5rem)] md:text-[clamp(1.9rem,3vw,3.5rem)] leading-tight tracking-tight max-w-[1200px]">
              {words.map((word, index) => (
                <span
                  key={index}
                  className="intro-word text-white md:text-[#555555] inline-block mr-[0.25em]"
                >
                  {word}
                </span>
              ))}
            </p>
          </div>

          <div className="border-t border-white/10 pt-10 md:pt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 items-start pointer-events-auto">
            <div className="lg:col-span-6">
              <h2 className="text-xs uppercase tracking-[0.25em] font-bold text-white/40">
                Who it's for:
              </h2>
            </div>

            <div className="lg:col-span-6 space-y-12 md:space-y-16 max-w-2xl pb-10">
              <div className="fade-para space-y-6">
                <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed font-normal">
                  This tool is made for people who think on paper. It keeps handwriting natural and focused, letting you write the way you always have without distractions or screens getting in the way.
                </p>
                <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed font-normal">
                  Everything you write syncs to the app, where your notes are organized, searchable, and ready to work with AI when you need more clarity or structure.
                </p>
              </div>

              <div className="space-y-10 md:space-y-12 pt-4 pl-0 sm:pl-20 lg:pl-60">
                <div className="audience-1 space-y-2">
                  <h3 className="font-serif text-xl md:text-2xl text-white">Students & Learners</h3>
                  <p className="text-white/60 text-sm md:text-base leading-relaxed pl-4 sm:pl-8">
                    Handwritten notes stay personal and intuitive, but become searchable, organized, and easy to study. Lectures, ideas, and revisions are captured as they are then supported by AI summaries, text recognition, and quick navigation when it matters most.
                  </p>
                </div>
                <div className="audience-2 space-y-2">
                  <h3 className="font-serif text-xl md:text-2xl text-white">Creators, Designers & Architects</h3>
                  <p className="text-white/60 text-sm md:text-base leading-relaxed pl-4 sm:pl-8">
                    Sketches, diagrams, concepts, and fragments of ideas belong on paper. This tool makes sure they don't disappear. Everything drawn or written is safely stored, easy to revisit, and ready to evolve into something bigger — without interrupting the creative flow.
                  </p>
                </div>
                <div className="audience-3 space-y-2">
                  <h3 className="font-serif text-xl md:text-2xl text-white">Managers & Product Thinkers</h3>
                  <p className="text-white/60 text-sm md:text-base leading-relaxed pl-4 sm:pl-8">
                    Meetings start on paper and end with structure. Notes turn into clear summaries, tasks, and follow-ups. The pen captures everything quietly, while the app helps organize decisions without pulling attention away from the room.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div 
          ref={videoPaddingRef} 
          className="w-full px-6 sm:px-10 lg:px-16 pb-16 md:pb-12 mt-6 md:mt-12 will-change-[padding]"
        >
          <div
            ref={videoBoxRef}
            className="w-full max-w-[1440px] mx-auto h-[35vh] sm:h-[50vh] bg-[#111] rounded-[20px] md:rounded-[24px] overflow-hidden will-change-[max-width,height,border-radius]"
          >
            {videoUrl ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                src={videoUrl}
                playsInline
                muted
                loop
                autoPlay
              />
            ) : (
              <video
                className="w-full h-full object-cover"
                src="/pen-showcase.mp4"
                playsInline
                muted
                loop
                autoPlay
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}