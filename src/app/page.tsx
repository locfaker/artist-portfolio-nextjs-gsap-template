'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import SplitType from 'split-type';
import UnicornPreloader from '@/components/UnicornPreloader';
import { Instagram, Twitter, Music2, Youtube, MessageCircle } from 'lucide-react';

const SocialIcon = ({ name }: { name: string }) => {
  const props = { size: 16, strokeWidth: 1.5, className: "text-white hover:text-[#ffcceb] transition-colors" };
  const Map: Record<string, React.ReactNode> = {
    instagram: <Instagram {...props} />,
    x: <Twitter {...props} />, // Close enough to X
    tiktok: <Music2 {...props} />, // For tiktok
    youtube: <Youtube {...props} />,
    weibo: <MessageCircle {...props} />, // For weibo
  };
  return <div className="p-[2px] cursor-pointer mix-blend-difference">{Map[name]}</div>;
};

const PersonalSocials = [
  { icon: 'instagram', url: 'https://www.instagram.com/beccca/' },
  { icon: 'x', url: 'https://x.com/AngelssBecky' },
  { icon: 'tiktok', url: 'https://www.tiktok.com/@angelssbecky?lang=en' },
  { icon: 'youtube', url: 'https://www.youtube.com/@beckyentofficial' },
  { icon: 'weibo', url: 'https://weibo.com/u/7668328500' },
];

const CompanySocials = [
  { icon: 'instagram', url: 'https://www.instagram.com/beckyentofficial' },
  { icon: 'x', url: 'https://x.com/beckyentofc' },
  { icon: 'tiktok', url: 'https://www.tiktok.com/@beckyentofficial' },
  { icon: 'youtube', url: 'https://www.youtube.com/@beckyentofficial' },
  { icon: 'weibo', url: 'https://weibo.com/u/6446793622' },
];

export default function Home() {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const leftDoor = useRef<HTMLDivElement>(null);
  const rightDoor = useRef<HTMLDivElement>(null);
  const centerLine = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Exact GSAP animation logic mimicking original preloader to home reveal
    const tl = gsap.timeline();

    // Simulate loading waiting for unicorn studio
    tl.to(centerLine.current, {
      scaleY: 1, // 'clip-init' expands line
      duration: 1.5,
      ease: 'power4.inOut',
    })
      .to([leftDoor.current, rightDoor.current], {
        scaleX: 0,
        ease: 'power3.inOut',
        duration: 1.2,
        stagger: 0.1,
      }, '-=0.5')
      .to(centerLine.current, {
        opacity: 0,
        duration: 0.2
      }, '<')
      .to(preloaderRef.current, {
        autoAlpha: 0,
        duration: 0.5,
        onComplete: () => {
          if (preloaderRef.current) preloaderRef.current.style.display = 'none';
        }
      }, '-=0.2');

    // Reveal Texts
    const textEls = document.querySelectorAll('.animate-text');
    textEls.forEach((el) => {
      const text = new SplitType(el as HTMLElement, { types: 'lines,words' });
      text.lines?.forEach(line => {
        const wrap = document.createElement('div');
        // Equivalent to their aria-hidden structures
        wrap.style.overflow = 'hidden';
        wrap.style.display = 'inline-block';
        wrap.style.verticalAlign = 'top';
        line.parentNode?.insertBefore(wrap, line);
        wrap.appendChild(line);
      });

      tl.from(text.words, {
        yPercent: 120,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 1,
        stagger: 0.02,
        ease: 'power3.out',
      }, '-=0.8');
    });

  }, []);

  return (
    <main className="w-full">
      <div className="flex flex-grow fixed inset-0 z-[999] pointer-events-none h-full w-full">
        <div className="flex-1 bg-[#FFCCEB] transition-box-1 border-r-[0.1px] border-[#030203]" style={{ clipPath: 'inset(100% 0% 0%)' }}></div>
        <div className="flex-1 bg-[#FFCCEB] transition-box-2" style={{ clipPath: 'inset(100% 0% 0%)' }}></div>
      </div>

      <section className="main-content-section fixed inset-0 overflow-hidden w-full h-svh flex flex-col bg-[#030203]">
        <div className="bg-hero absolute inset-0 z-0">
          <Image
            src="/assets/images/becky_hero.webp"
            alt="background"
            fill
            className="w-full h-full object-cover object-[center_35%]"
            priority
          />
        </div>

        <div className="relative flex flex-col justify-between w-full h-full z-10 text-white pt-[120px] pb-6 px-6 md:px-10">

          {/* MIDDLE TEXT */}
          <div className="flex-1 flex flex-col justify-center items-center pointer-events-none mix-blend-difference z-20">
            <p className="font-sans text-[11px] md:text-[13px] leading-[1.6] md:leading-[1.8] tracking-[0.02em] w-[85%] md:w-[420px] text-center animate-text text-white/90">
              Presenting Becky Entertainment, an instrument to redefine
              creativity and authenticity by empowering Becky&apos;s talents from
              screen, to sound, to style her narrative, her standard. Founded by
              Rebecca Patricia Armstrong in October 2025.
            </p>
          </div>

          {/* BOTTOM WRAPPER */}
          <div className="w-full relative flex justify-between items-end mix-blend-difference z-20 pb-10 md:pb-8">

            {/* PERSONAL SOCIALS */}
            <div className="flex flex-col items-start gap-4 z-30 pointer-events-auto">
              <h2 className="font-heading font-black text-[10px] md:text-[11px] uppercase tracking-wider text-white">Personal</h2>
              <nav className="flex flex-col gap-[10px]">
                {PersonalSocials.map(s => (
                  <a key={s.icon} href={s.url} target="_blank" rel="noreferrer" className="block w-max">
                    <SocialIcon name={s.icon} />
                  </a>
                ))}
              </nav>
            </div>

            {/* GIANT CENTER TEXT */}
            <div className="absolute bottom-6 md:bottom-4 left-1/2 -translate-x-1/2 w-full flex flex-col items-center pointer-events-none select-none">
              <div className="font-heading font-black uppercase text-white leading-[0.8] mb-1" style={{ fontSize: 'clamp(50px, 11vw, 200px)', letterSpacing: '-0.02em', transform: 'scaleX(1.05)' }}>
                BECKY
              </div>
              <div className="font-heading font-black uppercase text-white leading-[0.8] whitespace-nowrap" style={{ fontSize: 'clamp(25px, 5.8vw, 105px)', letterSpacing: '-0.01em', transform: 'scaleX(1.05)' }}>
                ENTERTAINMENT
              </div>
            </div>

            {/* COMPANY SOCIALS */}
            <div className="flex flex-col items-end gap-4 z-30 pointer-events-auto">
              <h2 className="font-heading font-black text-[10px] md:text-[11px] uppercase tracking-wider text-white text-right">Company</h2>
              <nav className="flex flex-col gap-[10px] items-end">
                {CompanySocials.map(s => (
                  <a key={s.icon} href={s.url} target="_blank" rel="noreferrer" className="block w-max">
                    <SocialIcon name={s.icon} />
                  </a>
                ))}
              </nav>
            </div>

          </div>

          {/* FOOTER */}
          <div className="absolute bottom-4 left-6 right-6 md:left-10 md:right-10 flex justify-between font-sans uppercase text-[8px] md:text-[9.5px] opacity-40 mix-blend-difference pointer-events-none z-20 tracking-wider">
            <span>COPYRIGHT 2026 BECKY ENTERTAINMENT. ALL RIGHTS RESERVED.</span>
            <span>WEBSITE BY VISUAL IDENTITY STUDIO.</span>
          </div>

        </div>
      </section>

      {/* Preloader Screen */}
      <div ref={preloaderRef} className="fixed inset-0 z-[9999] flex h-svh w-full bg-transparent pointer-events-auto">
        <div ref={leftDoor} className="left h-full w-1/2 border-r border-white/10 bg-[#fffafd] origin-left"></div>
        <div ref={rightDoor} className="right h-full w-1/2 border-l border-white/10 bg-[#fffafd] origin-right"></div>

        {/* Center Loading Line */}
        <div ref={centerLine} className="center-line fixed left-1/2 h-full w-1 -translate-x-1/2 bg-[#ffcceb] origin-top scale-y-0"></div>

        <div className="absolute inset-0 flex h-svh w-full items-center justify-center pointer-events-none">
          {/* Extracted Unicorn Studio WebGL Div */}
          <UnicornPreloader />
        </div>
      </div>

    </main>
  );
}
