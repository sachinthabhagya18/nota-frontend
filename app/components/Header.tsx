'use client'

import React, { useState, useEffect } from 'react'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
const navItems = ['Specifications', "Who it's for", 'About', 'Inside the box']

export default function Header() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isScrolledToWhite, setIsScrolledToWhite] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const [logoText, setLogoText] = useState("Nōta")
  const [buttonIconUrl, setButtonIconUrl] = useState("")
  const [menuImgUrl, setMenuImgUrl] = useState("")
  const [orderTitle, setOrderTitle] = useState("")
  const [orderProductName, setOrderProductName] = useState("")
  const [orderPrice, setOrderPrice] = useState("")

  useEffect(() => {
    async function fetchHeaderData() {
      try {
        let res = await fetch(`${STRAPI_URL}/api/homepages?populate=*`)
        if (!res.ok) {
          res = await fetch(`${STRAPI_URL}/api/homepage?populate=*`)
        }
        
        const json = await res.json()
        const rawData = json?.data?.[0] || json?.data || {}
        const attrs = rawData?.attributes || rawData

        if (attrs) {
          const resolveImg = (imgField: any) => {
            if (!imgField) return null
            let url = imgField?.url || 
                      imgField?.attributes?.url || 
                      imgField?.data?.attributes?.url || 
                      imgField?.data?.[0]?.attributes?.url ||
                      (Array.isArray(imgField) ? imgField[0]?.url : null)

            if (!url && typeof imgField === 'string') {
              url = imgField
            }

            return url ? (url.startsWith('http') ? url : `${STRAPI_URL}${url}`) : null
          }

          if (attrs.logoText) setLogoText(attrs.logoText)

          const iconImg = resolveImg(attrs.buttonIcon) || resolveImg(attrs.icon)
          if (iconImg) setButtonIconUrl(iconImg)

          const menuMedia = resolveImg(attrs.grid2Media) || resolveImg(attrs.menuImage)
          if (menuMedia) setMenuImgUrl(menuMedia)

          setOrderTitle(attrs.orderTitle || attrs.order_title || "Order")
          setOrderProductName(attrs.orderProductName || attrs.order_product_name || attrs.productName || "Nota One")
          setOrderPrice(attrs.orderPrice || attrs.order_price || attrs.price || "$300")
        }
      } catch (error) {
        console.error("Header Strapi fetch error:", error)
      }
    }
    fetchHeaderData()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 50 && !isMobileMenuOpen) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      setLastScrollY(currentScrollY)

      if (currentScrollY > 650) {
        setIsScrolledToWhite(true)
      } else {
        setIsScrolledToWhite(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, isMobileMenuOpen])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isMobileMenuOpen])

  const isDarkText = isScrolledToWhite || isMobileMenuOpen

  return (
    <header 
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${isMobileMenuOpen ? 'bg-white h-screen lg:h-auto' : 'bg-transparent'} py-5 px-6 sm:px-10 lg:px-14`}
    >
      <div className="max-w-[1920px] mx-auto flex items-center justify-between relative z-50">
        
        <div className="flex items-center gap-10 lg:gap-14 w-1/3 lg:w-auto">
          <a href="#top" className="flex items-center hover:opacity-80 transition-opacity" onClick={() => setIsMobileMenuOpen(false)}>
            <span 
              className={`font-sans text-[1.45rem] font-bold tracking-tight leading-none transition-colors duration-300 ${
                isDarkText ? 'text-black' : 'text-white'
              }`}
            >
              {logoText || "Nōta"}
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-8 xl:gap-12 pt-1">
            {navItems.map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replaceAll("'", "").replaceAll(' ', '-')}`} 
                className={`font-sans text-[0.875rem] xl:text-[0.9rem] font-medium tracking-[-0.02em] transition-colors ${
                  isDarkText ? 'text-black/80 hover:text-black' : 'text-white/90 hover:text-white'
                }`}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>

        <div className="lg:hidden absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`transition-colors duration-300 focus:outline-none ${isDarkText ? 'text-black' : 'text-white'}`}
          >
            {isMobileMenuOpen ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="5" cy="5" r="1.8"/><circle cx="12" cy="5" r="1.8"/><circle cx="19" cy="5" r="1.8"/>
                <circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/>
                <circle cx="5" cy="19" r="1.8"/><circle cx="12" cy="19" r="1.8"/><circle cx="19" cy="19" r="1.8"/>
              </svg>
            )}
          </button>
        </div>

        <div className="flex items-center justify-end w-1/3 lg:w-auto gap-4 lg:gap-6">
          <div className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-center transition-colors duration-300 ${isDarkText ? 'text-black' : 'text-white'}`}>
            {buttonIconUrl ? (
              <img 
                src={buttonIconUrl} 
                alt="Brand Icon" 
                className={`w-full h-full object-contain ${isDarkText ? 'invert-[1] brightness-0' : 'invert-0 brightness-100'}`} 
              />
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2C10 2 8.5 3.5 8.5 5.5C8.5 7.5 10 9 12 9C14 9 15.5 7.5 15.5 5.5C15.5 3.5 14 2 12 2ZM5.5 8.5C3.5 8.5 2 10 2 12C2 14 3.5 15.5 5.5 15.5C7.5 15.5 9 14 9 12C9 10 7.5 8.5 5.5 8.5ZM18.5 8.5C16.5 8.5 15 10 15 12C15 14 16.5 15.5 18.5 15.5C20.5 15.5 22 14 22 12C22 10 20.5 8.5 18.5 8.5ZM12 15C10 15 8.5 16.5 8.5 18.5C8.5 20.5 10 22 12 22C14 22 15.5 20.5 15.5 18.5C15.5 16.5 14 15 12 15Z"/>
              </svg>
            )}
          </div>

          <button className={`hidden lg:flex px-5 py-2.5 font-sans text-sm font-semibold tracking-wide transition-colors whitespace-nowrap ${
            isDarkText ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'
          }`}>
            {orderTitle || "Order"} 
            <span className={`font-normal ml-1 ${isDarkText ? 'text-white/70' : 'text-black/70'}`}>
              {orderProductName || "Nota One"}
            </span> 
            <span className="mx-1.5">•</span> 
            {orderPrice || "$300"}
          </button>
        </div>

      </div>
      <div 
        className={`fixed inset-0 top-[70px] bg-white z-40 lg:hidden flex flex-col pt-10 pb-8 px-6 transition-opacity duration-300 ease-in-out ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col items-center gap-6 mt-4">
          {navItems.map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase().replaceAll("'", "").replaceAll(' ', '-')}`} 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[1.3rem] font-semibold text-black tracking-tight"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="mt-12 relative w-full rounded-[3.5rem] overflow-hidden aspect-[1.8/1] flex items-center justify-center bg-[#1c2e4a]">
          <img 
            src={menuImgUrl || "/colored_pens.jpg"} 
            alt="Menu Showcase" 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/10"></div>
          
          <button className="relative z-10 bg-[#1c1c1c]/70 backdrop-blur-md text-white font-medium px-6 py-3.5 rounded-full text-[0.95rem] shadow-xl flex items-center gap-2 tracking-wide">
            <span>{orderTitle || "Order"} <span className="text-white/70">{orderProductName || "Nota One"}</span></span>
            <span className="text-white/50">•</span>
            <span>{orderPrice || "$300"}</span>
          </button>
        </div>

        {/* Mobile credits */}
        <div className="mt-auto pt-6 border-t border-black/10 flex flex-col sm:flex-row justify-between text-[#888888] text-[0.8rem] font-medium gap-3">
          <p>@2026 Nōta Team</p>
          <div className="flex flex-col">
            <p>Made in Taptop</p>
            <p>Builded by NōtaTeam</p>
          </div>
          <p>Designed by Alice<br/>& UPROCK Studio</p>
        </div>

      </div>
    </header>
  )
}