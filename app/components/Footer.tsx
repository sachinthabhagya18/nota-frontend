import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-20 md:pt-32 font-sans selection:bg-white selection:text-black flex flex-col">
      <div className="max-w-[1500px] w-full mx-auto px-6 md:px-12 lg:px-16 flex-1">
        
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-8 mb-20 md:mb-32">
          
          <div className="w-full lg:w-[45%]">
            <h2 className="text-[1.35rem] sm:text-[1.5rem] lg:text-[1.7rem] font-medium leading-[1.3] md:leading-[1.15] tracking-tight text-white/95">
              NŌTA creates tools that respect the <br className="hidden md:block" />
              way people think and write. <br className="hidden md:block" />
              Natural handwriting, quietly <br className="hidden md:block" />
              connected to digital structure.
            </h2>
          </div>

          <div className="w-full flex flex-row justify-between sm:justify-start gap-16 md:gap-50 lg:w-[35%]">
            
            <div className="flex flex-col">
              <span className="text-[#888888] text-[0.9rem] md:text-[0.95rem] font-medium mb-4 md:mb-6">Navigation</span>
              <nav className="flex flex-col space-y-3">
                <a href="#specifications" className="text-[0.95rem] md:text-[1.0rem] font-medium tracking-tight text-white hover:text-white/70 transition-colors">Specifications</a>
                <a href="#who-its-for" className="text-[0.95rem] md:text-[1.0rem] font-medium tracking-tight text-white hover:text-white/70 transition-colors">Who it's for</a>
                <a href="#about" className="text-[0.95rem] md:text-[1.0rem] font-medium tracking-tight text-white hover:text-white/70 transition-colors">About</a>
                <a href="#inside-the-box" className="text-[0.95rem] md:text-[1.0rem] font-medium tracking-tight text-white hover:text-white/70 transition-colors">Inside the box</a>
              </nav>
            </div>

            <div className="flex flex-col text-left sm:text-right">
              <span className="text-[#888888] text-[0.9rem] md:text-[0.95rem] font-medium mb-4 md:mb-6">Year</span>
              <span className="text-[1.1rem] md:text-[1.2rem] font-medium tracking-tight text-white">2026</span>
            </div>

          </div>

        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-[#888888] text-[0.9rem] md:text-[0.95rem] font-medium pb-8 md:pb-10 gap-4 md:gap-0 border-t border-white/10 md:border-t-0 pt-8 md:pt-0">
          <p className="w-full md:w-1/3 text-center md:text-left hover:text-white transition-colors cursor-pointer">
            @2026 Nōta Team
          </p>
          <p className="w-full md:w-1/3 text-center hover:text-white transition-colors cursor-pointer">
            Made in Taptop • Builded by NōtaTeam
          </p>
          <p className="w-full md:w-1/3 text-center md:text-right hover:text-white transition-colors cursor-pointer">
            Designed by Alice & UPROCK Studio
          </p>
        </div>
        
      </div>
      
      <div className="w-full bg-[#080808] border-t border-white/10 py-4 md:py-5 flex justify-center items-center">
         <div className="flex items-center gap-3 text-[#888888] text-[0.85rem] font-medium hover:text-white/80 transition-colors cursor-pointer">
            <div className="flex items-center justify-center space-x-[3px]">
               <div className="w-[10px] h-[18px] bg-white rounded-sm"></div>
               <div className="flex flex-col space-y-[3px]">
                  <div className="w-[10px] h-[10px] bg-white rounded-sm"></div>
                  <div className="w-[10px] h-[5px] bg-[#888888] rounded-sm"></div>
               </div>
            </div>
            <span>Made in Taptop</span>
         </div>
      </div>
    </footer>
  )
}