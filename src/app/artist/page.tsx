'use client';

import { useEffect, useMemo } from 'react';
import gsap from 'gsap';

type Award = {
  title: string;
  desc: string;
};

const AWARDS: Award[] = [
  { title: 'HOWE Awards 2023', desc: 'The Best Couple Award & Hottest Series (Gap)' },
  { title: 'NINE ENTERTAIN AWARDS 2025', desc: 'Couple of the Year' },
  { title: 'KAZZ AWARDS 2023', desc: 'Rising Female of the Year & Couple of the Year' },
  { title: 'y entertain awards 2025', desc: 'Y Couple of the Year' },
  { title: 'FEED Y CAPITAL AWARDS 2023', desc: 'Popular Actor Award & Most Popular Couple' },
  { title: 'NINE ENTERTAIN AWARDS 2023', desc: 'People’s Choice (Gap)' },
  { title: 'MAYA TV AWARDS 2024', desc: 'Couple of the Year' },
  { title: '32ND SUPHANNAHONG NATIONAL FILM AWARDS (NOMINATED)', desc: 'Best Actress in a Supporting Role' },
  { title: 'FEED Y Capital Awards 2024', desc: 'Most Popular Couple' },
  { title: 'FEED X KHAOSOD AWARDS 2025', desc: 'Popular Actress Award' },
  { title: 'KAZZ AWARDS 2024', desc: 'Popular Female Teenage Award & Couple of the Year' },
  { title: 'Maya TV Awards 2023', desc: 'Couple of the Year' },
  { title: 'Japan Expo Thailand Award 2024', desc: 'Japan Expo Actors Award' },
  { title: 'Y UNIVERSE AWARDS 2023', desc: 'Rising Star & The Best Couple' },
  { title: 'Maya Awards 2025', desc: 'Female Couple of the Year' },
  { title: 'NINE ENTERTAIN AWARDS 2024', desc: 'Couple of the Year' },
  { title: 'y entertain awards 2024', desc: 'y couple of the year' },
  { title: 'THAI UPDATE AWARDS 2025', desc: 'The Best Drama Series of the Year' },
  { title: 'GQ MAGAZINE 2024', desc: 'GQ Nation’s Trending Stars' },
  { title: 'SANOOK TOP OF THE YEAR AWARD 2025', desc: 'Best Couple of the Year & Most Popular Series of the Year (The Loyal Pin)' },
  { title: '33rd Suphannahong National Film Awards 2025', desc: 'Popular Movie (Uranus 2324)' },
];

const AWARD_CARD_COLORS = ['rgb(255, 204, 235)', 'rgb(255, 219, 241)', 'rgb(158, 126, 145)'];
const AWARD_IMAGE = 'https://cdn.sanity.io/images/xgykflrm/production/bd934017b21684c699a74da07489a6af4ebb853c-63x144.png';
const ABOUT_IMAGE = 'https://cdn.sanity.io/images/xgykflrm/production/5e6cdc960b83089376d21252ff2cebda43ad800c-1366x2048.jpg';
const COLUMN_COUNT = 7;
const CARDS_PER_COLUMN = 30;

function buildColumn(columnIndex: number) {
  return Array.from({ length: CARDS_PER_COLUMN }, (_, i) => {
    const awardIndex = (columnIndex * 3 + i) % AWARDS.length;
    return {
      ...AWARDS[awardIndex],
      color: AWARD_CARD_COLORS[(i + columnIndex) % AWARD_CARD_COLORS.length],
      key: `${columnIndex}-${i}-${awardIndex}`,
    };
  });
}

export default function ArtistPage() {
  const columns = useMemo(() => Array.from({ length: COLUMN_COUNT }, (_, index) => buildColumn(index)), []);
  const mobileCards = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        const award = AWARDS[i % AWARDS.length];
        return {
          ...award,
          color: AWARD_CARD_COLORS[i % AWARD_CARD_COLORS.length],
          key: `mobile-${i}`,
        };
      }),
    [],
  );

  useEffect(() => {
    const unicorn = (window as Window & { UnicornStudio?: { init: () => Promise<void> } }).UnicornStudio;
    if (unicorn) {
      unicorn.init().catch(() => {});
    }

    const tweens: gsap.core.Tween[] = [];
    const containers = gsap.utils.toArray<HTMLElement>('.mwg_effect034 .container');

    containers.forEach((container, index) => {
      const parentHeight = container.parentElement?.clientHeight ?? 0;
      const maxOffset = Math.max(0, container.scrollHeight - parentHeight);
      if (!maxOffset) {
        return;
      }

      const fromY = index % 2 === 0 ? -maxOffset : 0;
      const toY = index % 2 === 0 ? 0 : -maxOffset;

      gsap.set(container, { y: fromY });
      tweens.push(
        gsap.to(container, {
          y: toY,
          duration: 26 + index * 1.6,
          ease: 'none',
          repeat: -1,
          yoyo: true,
        }),
      );
    });

    return () => {
      tweens.forEach((tween) => tween.kill());
    };
  }, []);

  return (
    <main className="bg-[#030203] min-h-screen w-full artist-page">
      <div className="hero-wrapper">
        <section className="image-container-awards-outer">
          <div className="image-container-awards relative overflow-hidden w-full h-full">
            <div
              className="unicorn-embed max-w-[100%] h-full"
              data-us-project-src="/beckymask.json"
              data-us-fps="60"
              data-us-scale="1"
              data-us-lazyload="true"
              data-us-production="true"
              data-us-disablemobile="true"
              data-us-alttext="Becky Mask Animation"
              data-us-arialabel="Interactive canvas"
            />
          </div>
        </section>
        <h1>BECKY&rdquo;</h1>
      </div>

      <section className="hero-section">
        <div className="content-row">
          <div className="left-content-container">
            <div className="top-paragraphs">
              <p className="hero-content-text-p first-para">
                Rebecca (Becky) Patricia Armstrong is a Thai-British actress, model, and singer known for her
                presence that binds together authenticity and star quality.
              </p>
              <p className="hero-content-text-p second-para">
                Based in Thailand, United Kingdom, and Singapore, Becky divides her time between cities to expand her
                artistic horizons and strengthen her international presence.
              </p>
            </div>
            <div className="bottom-paragraphs-container">
              <p className="about-content-text-p">
                Beyond the screen, Becky brings her artistry to the fashion world as the first Muse of Harper&apos;s
                BAZAAR Thailand, the Brand Ambassador of L&apos;Oreal Paris Thailand, and a House Ambassador of CHANEL,
                along with collaborations with other notable fashion brands.
              </p>
              <p className="about-content-text-p fourth-para">
                She further expands her talent through music, showcasing music covers of &quot;ดาวหางฮัลเลย์
                (Halley&apos;s Comet)&quot; by fellow fellow, &quot;A Whole New World&quot; by ZAYN &amp; Zhavia Ward, and
                &quot;WILDFLOWER&quot; by Billie Eilish. Becky is in the midst of creating her first full-length album.
              </p>
            </div>
          </div>
          <div className="image-container-outer">
            <div className="image-container-inner">
              <img src={ABOUT_IMAGE} alt="Becky" className="w-full object-cover h-full" />
            </div>
          </div>
        </div>
      </section>

      <section id="awards-section">
        <div className="awards-wrapper">
          <section className="awards-section">
            <h1 className="awards-title">Awards</h1>
          </section>
          <section className="mwg_effect034 overflow-hidden">
            {columns.map((cards, columnIndex) => (
              <div key={`col-${columnIndex}`} className="col">
                <div className={`container container${columnIndex + 1}`}>
                  {cards.map((award) => (
                    <div
                      key={award.key}
                      className="card flex items-center justify-center text-center flex-col gap-2 md:gap-3 p-4"
                      style={{ backgroundColor: award.color }}
                    >
                      <img src={AWARD_IMAGE} alt="Award image" className="w-auto h-20 md:w-auto md:h-20 lg:w-auto lg:h-28" />
                      <h1>{award.title}</h1>
                      <h3>{award.desc}</h3>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </div>

        <div className="awards-slider-wrapper">
          <section className="awards-section">
            <h1 className="awards-title">Awards</h1>
          </section>
          <div className="slider-container">
            <div className="slider-content">
              {mobileCards.map((award) => (
                <div
                  key={award.key}
                  className="card flex items-center justify-center text-center flex-col gap-2 md:gap-3 p-4"
                  style={{ backgroundColor: award.color }}
                >
                  <img src={AWARD_IMAGE} alt="Award image" className="w-auto h-20 md:w-auto md:h-20 lg:w-auto lg:h-28" />
                  <h1>{award.title}</h1>
                  <h3>{award.desc}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
