'use client'

import React, { useEffect, useRef, useLayoutEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Instrument_Serif } from 'next/font/google'

import Header from './components/Header'
import SmartPaperSection from './components/SmartPaperSection'
import DetailSpecificationsSection from './components/DetailSpecificationsSection'
import ColorShowcase from './components/ColorShowcase'
import Footer from './components/Footer'
import WhoItsForSection from './components/WhoItsForSection'

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-instrument-serif',
})

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

interface FeatureItem {
  id?: number
  label: string
  value?: string
  category?: string
}

function SpecificationCard({ title, items }: { title: string; items: FeatureItem[] }) {
  if (!items || items.length === 0) return null

  return (
    <article className="relative flex flex-col p-6 rounded-[1.5rem] bg-white/70 sm:bg-white/40 backdrop-blur-md shadow-[0_4px_40px_rgba(0,0,0,0.03)] border border-white/60 h-full">
      <header className="mb-5 sm:mb-6">
        <h2 className="font-sans text-[1.1rem] sm:text-[1.2rem] font-bold tracking-tight text-[#111]">{title}</h2>
      </header>
      <ul className="flex flex-col gap-y-3 mt-auto">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center justify-between gap-2 border-b border-black/5 pb-3 last:border-0">
            <span className="font-sans text-[0.85rem] sm:text-[0.9rem] leading-snug text-[#333] font-medium text-left">{item.label}</span>
            <div className="flex items-center gap-2.5 shrink-0">
              {item.value && <span className="font-sans text-[0.85rem] sm:text-[0.9rem] font-semibold text-[#111] text-right">{item.value}</span>}
              <span className="h-1.5 w-1.5 rounded-full bg-[#d1d1d1]" aria-hidden="true" />
            </div>
          </li>
        ))}
      </ul>
    </article>
  )
}

export default function Page() {
  const mainRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const specSectionRef = useRef<HTMLElement>(null)
  const specTitleRef = useRef<HTMLDivElement>(null)
  const specPenRef = useRef<HTMLDivElement>(null)

  const [data, setData] = useState({
    title: "Smart pen\nfor real thinking",
    videoUrl: "",
    heroMobileUrl: "",
    penImageUrl: "",
    penMobileImageUrl: "",
    features: [] as FeatureItem[],
  })

  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => { setIsMounted(true) }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${STRAPI_URL}/api/homepages?populate=*`)
        const json = await res.json()
        const firstItem = json?.data?.[0]
        const attrs = firstItem?.attributes || firstItem || json?.data

        if (attrs) {
          const resolveMedia = (mediaObj: any) => {
            if (!mediaObj) return null
            let url = mediaObj?.url || mediaObj?.attributes?.url || mediaObj?.data?.attributes?.url || mediaObj?.data?.[0]?.attributes?.url
            return url ? (url.startsWith("http") ? url : `${STRAPI_URL}${url}`) : null
          }

          const fetchedFeatures = attrs.Feature || attrs.feature || attrs.features || []

          setData({
            title: attrs.heroTitle || "Smart pen\nfor real thinking",
            videoUrl: resolveMedia(attrs.heroVideo) || "",
            heroMobileUrl: resolveMedia(attrs.heroMobileImage || attrs.heroMobile) || "",
            penImageUrl: resolveMedia(attrs.penImage) || "",
            penMobileImageUrl: resolveMedia(attrs.penMobileImage || attrs.penMobile) || "",
            features: Array.isArray(fetchedFeatures) ? fetchedFeatures : [],
          })
        }
      } catch (error) {
        console.error("Fetch error:", error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 1) setIsVideoLoaded(true)
    if (!data.videoUrl && data.heroMobileUrl) setIsVideoLoaded(true)
  }, [data.videoUrl, data.heroMobileUrl])

  useIsomorphicLayoutEffect(() => {
    if (!isMounted) return

    const ctx = gsap.context(() => {
      const video = videoRef.current

      gsap.set(".hero-curtain", { yPercent: 100 })
      gsap.set(".curtain-panel", { yPercent: 0 })

      let mm = gsap.matchMedia()

      mm.add({
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)"
      }, (context) => {
        let { isDesktop } = context.conditions

        // Hero timeline
        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: videoContainerRef.current,
            start: "top top",
            end: "+=3000",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        if (video && isVideoLoaded && Number.isFinite(video.duration) && video.duration > 0 && isDesktop) {
          video.pause()
          const videoProgress = { value: 0 }

          heroTl.to(videoProgress, {
            value: 1,
            duration: 3,
            ease: "none",
            onUpdate: () => {
              if (video.duration) video.currentTime = video.duration * videoProgress.value
            },
          }, 0)
        } else {
          heroTl.to({}, { duration: 3 }, 0)
        }

        heroTl.to(".hero-curtain", {
          yPercent: 0,
          duration: 1.4,
          stagger: { each: 0.10, from: "start" },
          ease: "power3.inOut",
        }, 1.6)

        // Specifications timeline
        const specTl = gsap.timeline({
          scrollTrigger: {
            trigger: specSectionRef.current,
            start: "top top",
            end: "+=4500",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        const panels = gsap.utils.toArray<HTMLElement>(".curtain-panel")
        if (panels.length > 0) {
          specTl.to(panels, {
            yPercent: -100,
            duration: 1.5,
            stagger: { each: 0.10, from: "start" },
            ease: "power3.inOut",
          })
        }

        const cards = gsap.utils.toArray<HTMLElement>(".spec-card")

        if (isDesktop) {
          if (specTitleRef.current) specTl.to(specTitleRef.current, { top: "12%", duration: 1.5, ease: "power2.out" }, "-=0.25")
          if (specPenRef.current) specTl.to(specPenRef.current, { bottom: "-5%", duration: 1.5, ease: "power2.out" }, "<0.4")
          if (cards.length > 0) specTl.fromTo(cards, { y: 150, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.2, duration: 1.5, ease: "power2.out" }, "<0.4")
        } else {
          specTl.fromTo(".mobile-spec-title", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, "-=0.5")
          specTl.fromTo(".mobile-spec-pen", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, "<0.2")
          if (cards.length > 0) specTl.fromTo(cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.15, duration: 1.2, ease: "power2.out" }, "<0.2")
        }

        specTl.to({}, { duration: 0.7 })

        // Stepped panels
        const steppedPanels = gsap.utils.toArray<HTMLElement>(".stepped-panel")
        if (steppedPanels.length > 0) {
          specTl.to(steppedPanels, {
            scaleX: 1,
            duration: 1.6,
            stagger: { each: 0.18, from: "end" },
            ease: "power3.inOut",
          })

          const specContent = [specTitleRef.current, specPenRef.current, ...cards].filter(Boolean)
          if (specContent.length > 0) {
            specTl.to(specContent, { opacity: 0, duration: 0.8, ease: "power2.inOut" }, "<0.2")
          }

          specTl.to({}, { duration: 0.5 })
        }
      })

    }, mainRef)

    const timer = setTimeout(() => {
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
    }, 700)

    return () => {
      clearTimeout(timer)
      ctx.revert()
    }
  }, [isMounted, isVideoLoaded, data.penImageUrl, data.videoUrl, data.heroMobileUrl, data.penMobileImageUrl])

  if (!isMounted) return null

  const featuresList = Array.isArray(data.features) ? data.features : []
  const dynamicColumns = [
    { title: "Writing System", items: featuresList.filter((item) => item?.category === "Writing System") },
    { title: "Capture Technology", items: featuresList.filter((item) => item?.category === "Capture Technology") },
    { title: "Digital Continuity", items: featuresList.filter((item) => item?.category === "Digital Continuity") },
  ]

  const penImageSrc = data.penImageUrl || data.penMobileImageUrl

  return (
    <main ref={mainRef} className="bg-white text-[#111] overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section ref={videoContainerRef} className="relative h-screen w-full overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 z-[5] pointer-events-none" />
        
        {data.videoUrl ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover z-[1] hidden md:block"
            src={data.videoUrl}
            playsInline
            muted
            preload="auto"
            crossOrigin="anonymous"
            onLoadedMetadata={() => setIsVideoLoaded(true)}
            onCanPlay={() => setIsVideoLoaded(true)}
          />
        ) : null}
        
        {data.heroMobileUrl ? (
          <img
            src={data.heroMobileUrl}
            className="absolute inset-0 h-full w-full object-cover z-[1] md:hidden"
            alt="Mobile Hero"
            onLoad={() => setIsVideoLoaded(true)}
          />
        ) : null}

        <div className="absolute inset-0 z-10 flex items-end justify-center md:justify-start px-6 pb-[15vh] md:pb-20 md:px-10 lg:px-14 pointer-events-none text-center md:text-left">
          <h1 className="max-w-[720px] font-['Instrument_Serif'] text-[3.8rem] sm:text-[5rem] md:text-[7rem] lg:text-[5.7rem] font-normal leading-[0.95] tracking-wide text-white whitespace-pre-line pointer-events-auto drop-shadow-lg">
            {data.title}
          </h1>
        </div>

        <div className="absolute inset-0 z-[60] flex pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="hero-curtain h-full flex-1 bg-[#fafafa] border-r border-gray-300 last:border-r-2 will-change-transform" />
          ))}
        </div>
      </section>

      {/* Specifications Section */}
      <section ref={specSectionRef} id="specifications" className="relative h-screen w-full bg-[#fafafa] overflow-hidden">
        <div className="absolute inset-0 z-[50] flex pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="curtain-panel h-full flex-1 bg-white border-r border-gray-300 last:border-r-0 will-change-transform" />
          ))}
        </div>
        
        <div className="absolute inset-0 z-20 flex flex-col md:block items-center pt-[15vh] md:pt-0 overflow-y-auto md:overflow-visible scrollbar-hide">
          <div ref={specTitleRef} className="mobile-spec-title md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 text-center z-10 px-6 py-4 mb-6 md:mb-0 w-full opacity-0 md:opacity-100">
            <h2 className="font-['Instrument_Serif'] text-[2.8rem] md:text-[3rem] lg:text-[3.5rem] leading-[0.9] tracking-tight text-gray-500 font-normal">Nota pen</h2>
            <h1 className="font-['Instrument_Serif'] text-[3.8rem] md:text-[4.5rem] lg:text-[5.2rem] leading-[0.9] tracking-tight text-black mt-1">Specifications</h1>
          </div>

          <div ref={specPenRef} className="mobile-spec-pen md:absolute md:bottom-[-100%] md:left-1/2 md:-translate-x-1/2 w-full md:w-auto h-[100px] sm:h-[140px] md:h-[75vh] flex justify-center z-[5] mb-10 md:mb-0 opacity-0 md:opacity-100 px-6">
            {penImageSrc ? (
              <picture className="w-full h-full flex justify-center">
                {data.penMobileImageUrl ? (
                  <source media="(max-width: 767px)" srcSet={data.penMobileImageUrl} />
                ) : null}
                <img
                  src={penImageSrc}
                  alt="Nota Pen"
                  className="h-full w-full md:w-auto object-contain md:object-cover object-center md:object-top"
                />
              </picture>
            ) : null}
          </div>

          <div className="md:absolute md:top-[45%] md:left-1/2 md:-translate-x-1/2 w-full max-w-[1400px] px-5 md:px-6 z-20 flex flex-col md:grid md:grid-cols-3 gap-5 md:gap-6 lg:gap-8 pb-32 md:pb-0">
            {dynamicColumns.map((column) => column.items.length > 0 ? (
              <div key={column.title} className="spec-card opacity-0 md:opacity-100">
                <SpecificationCard title={column.title} items={column.items} />
              </div>
            ) : null)}
          </div>
        </div>

        <div className="absolute inset-0 z-[100] flex flex-col pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="stepped-panel flex-1 w-full bg-black will-change-transform" style={{ transform: 'scaleX(0)', transformOrigin: 'center' }} />
          ))}
        </div>
      </section>

      <WhoItsForSection />
      <SmartPaperSection />
      <DetailSpecificationsSection />
      <ColorShowcase />
      <Footer />
    </main>
  )
}