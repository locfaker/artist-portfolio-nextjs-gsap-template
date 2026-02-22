'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type FilmographyItem = {
  id: string;
  title: string;
  year: string;
  role?: string;
  videoSrc: string;
  thumbnailSrc: string;
};

type FilmographySection = {
  title: string;
  items: FilmographyItem[];
};

type PreviewItem = Pick<FilmographyItem, 'videoSrc' | 'thumbnailSrc'>;

const FILMOGRAPHY_SECTIONS: FilmographySection[] = [
  {
    title: 'Feature Films',
    items: [
      {
        id: 'graveyard-horror',
        title: '4 ป่าช้า (Graveyard Horror)',
        year: '2025',
        role: 'MAIN ROLE (PUN)',
        videoSrc: 'https://cdn.sanity.io/files/xgykflrm/production/78e2e9564fd8be48623d47142e66827e55623de6.mp4',
        thumbnailSrc: 'https://cdn.sanity.io/images/xgykflrm/production/c1d44e1d773c8e69a30344c72e032e802e77d1f4-960x1200.jpg',
      },
      {
        id: 'uranus-2324',
        title: 'Uranus 2324',
        year: '2024',
        role: 'MAIN ROLE (KATH)',
        videoSrc: 'https://cdn.sanity.io/files/xgykflrm/production/798e4f42f631ea4cd0f7299a456e307cdcb22cc5.mp4',
        thumbnailSrc: 'https://cdn.sanity.io/images/xgykflrm/production/32f01913d82952b5a27eb392d9899eb462663b76-1070x1529.jpg',
      },
      {
        id: 'long-live-love',
        title: 'LONG LIVE LOVE!',
        year: '2023',
        role: 'MAIN ROLE (NAMO)',
        videoSrc: 'https://cdn.sanity.io/files/xgykflrm/production/f0a2d0c2ea470572ea50124d1f6935f5b85fb2f3.mp4',
        thumbnailSrc: 'https://cdn.sanity.io/images/xgykflrm/production/9bdd46931968032f23e5b23bd4dd98919839e87f-1434x2048.jpg',
      },
    ],
  },
  {
    title: 'TV Series',
    items: [
      {
        id: 'girl-from-nowhere',
        title: 'Girl From Nowhere: The Reset',
        year: '2026',
        role: 'MAIN ROLE (NANNO)',
        videoSrc: 'https://cdn.sanity.io/files/xgykflrm/production/92393f48fb7c310c28f11e236a7c22b3ad7ca49a.mp4',
        thumbnailSrc: 'https://cdn.sanity.io/images/xgykflrm/production/c2edd9eb75b04e44bd059b8b8e67ad5ed2cfcfd9-3889x4861.jpg',
      },
      {
        id: '4-elements',
        title: '4 Elements',
        year: '2026',
        role: 'MAIN ROLE (PRINCESS BLEW)',
        videoSrc: 'https://cdn.sanity.io/files/xgykflrm/production/192545358edcb451f093a6d248522027d25ac301.mp4',
        thumbnailSrc: 'https://cdn.sanity.io/images/xgykflrm/production/04f4291551a1e0d9a455a60879261038b67602dc-1025x1280.jpg',
      },
      {
        id: 'loyal-pin',
        title: 'The Loyal Pin',
        year: '2024',
        role: 'MAIN ROLE (PRINCESS ANIN)',
        videoSrc: 'https://cdn.sanity.io/files/xgykflrm/production/235a8c139d89d1590402cd8a09b60cfe1d9fdd66.mp4',
        thumbnailSrc: 'https://cdn.sanity.io/images/xgykflrm/production/09fd6cbd40cd1d60f14ff2f816f208df5befed82-1070x1505.jpg',
      },
      {
        id: 'secret-crush-on-you',
        title: 'Secret Crush on You',
        year: '2022',
        role: 'MAIN ROLE (FON)',
        videoSrc: 'https://cdn.sanity.io/files/xgykflrm/production/bed034160b1bda216db1097867367d7665554dd9.mp4',
        thumbnailSrc: 'https://cdn.sanity.io/images/xgykflrm/production/01211bf02efb1ef5fb1b8a9248db739af55d07cb-736x920.jpg',
      },
      {
        id: 'gap-series',
        title: 'Gap The Series',
        year: '2022',
        role: 'MAIN ROLE (MON)',
        videoSrc: 'https://cdn.sanity.io/files/xgykflrm/production/bfb8311f4678f5a70fbac12e66b4123b2059fb15.mp4',
        thumbnailSrc: 'https://cdn.sanity.io/images/xgykflrm/production/4791a1e178b8c974533eedd01ce8b2d9c8a3a754-736x1041.jpg',
      },
      {
        id: 'tharntype-2',
        title: 'TharnType 2: 7 Years of Love',
        year: '2019',
        role: 'SUPPORTING ROLE (THANYA)',
        videoSrc: 'https://cdn.sanity.io/files/xgykflrm/production/ec481ca4f69b88444e518e5a7bc592f38361b3ce.mp4',
        thumbnailSrc: 'https://cdn.sanity.io/images/xgykflrm/production/bedda82f5345c69be3361c8f4735a4431a544968-735x951.jpg',
      },
    ],
  },
  {
    title: 'Music Video Features',
    items: [
      {
        id: 'ride-or-die',
        title: 'Ride or Die',
        year: '2025',
        videoSrc: 'https://cdn.sanity.io/files/xgykflrm/production/a3341a78c225e1d3883f770d38371de60baf7c49.mp4',
        thumbnailSrc: 'https://cdn.sanity.io/images/xgykflrm/production/5985f8c9b366c3efe6eaa475e8bd11ddf5989342-1900x1900.jpg',
      },
      {
        id: 'dancing-queen',
        title: 'Dancing Queen',
        year: '2024',
        videoSrc: 'https://cdn.sanity.io/files/xgykflrm/production/9394a860aba0537a2eebcd684a800a4ccc69c6fa.mp4',
        thumbnailSrc: 'https://cdn.sanity.io/images/xgykflrm/production/7ffcd37deaa2687ddd0b10551d322ab0724887e3-300x300.jpg',
      },
      {
        id: 'be-my-baby',
        title: 'Be My Baby',
        year: '2024',
        videoSrc: 'https://cdn.sanity.io/files/xgykflrm/production/cad32253cb4b4041a8bcf85ed48fc9d8f31f8b89.mp4',
        thumbnailSrc: 'https://cdn.sanity.io/images/xgykflrm/production/11de95b7104a024d9f6e43cd644090e3b9473e85-1200x1200.jpg',
      },
      {
        id: 'awkward',
        title: 'Awkward',
        year: '2024',
        videoSrc: 'https://cdn.sanity.io/files/xgykflrm/production/d66f1d2dad134babd67d03c4fe6c189cb0d679d9.mp4',
        thumbnailSrc: 'https://cdn.sanity.io/images/xgykflrm/production/6db3dd2e451ee2d8b11907c316960f8c68e2895a-400x400.jpg',
      },
      {
        id: 'no-worries',
        title: 'No Worries',
        year: '2023',
        videoSrc: 'https://cdn.sanity.io/files/xgykflrm/production/148c61ba204a6b4275dd2ced40e1851246498235.mp4',
        thumbnailSrc: 'https://cdn.sanity.io/images/xgykflrm/production/0bdd4cedb6fb2ddeed90d0be044a57fa8b1b91c1-640x640.jpg',
      },
    ],
  },
];

const DEFAULT_PREVIEW_ITEM = FILMOGRAPHY_SECTIONS[0].items[0];
const DEFAULT_PREVIEW: PreviewItem = {
  videoSrc: DEFAULT_PREVIEW_ITEM.videoSrc,
  thumbnailSrc: DEFAULT_PREVIEW_ITEM.thumbnailSrc,
};
const HOVER_RESET_DELAY_MS = 30;
const DETAIL_LAYERS = [1, 2] as const;
const SCROLL_TRIGGER_ID = 'filmography-scroll';
const THUMBNAIL_TRIGGER_ID = 'filmography-thumb';

export default function FilmographyPage() {
  const containerRef = useRef<HTMLElement>(null);
  const moverRef = useRef<HTMLDivElement>(null);
  const stickyWindowRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoverResetTimeoutRef = useRef<number | null>(null);
  const [activePreview, setActivePreview] = useState<PreviewItem>(DEFAULT_PREVIEW);

  const clearHoverResetTimer = useCallback(() => {
    if (hoverResetTimeoutRef.current !== null) {
      window.clearTimeout(hoverResetTimeoutRef.current);
      hoverResetTimeoutRef.current = null;
    }
  }, []);

  const resetPreviewToDefault = useCallback(() => {
    clearHoverResetTimer();
    setActivePreview(DEFAULT_PREVIEW);
  }, [clearHoverResetTimer]);

  const scheduleResetPreview = useCallback(() => {
    clearHoverResetTimer();
    hoverResetTimeoutRef.current = window.setTimeout(() => {
      setActivePreview(DEFAULT_PREVIEW);
      hoverResetTimeoutRef.current = null;
    }, HOVER_RESET_DELAY_MS);
  }, [clearHoverResetTimer]);

  const handleItemHover = useCallback(
    (item: FilmographyItem) => {
      clearHoverResetTimer();
      setActivePreview({
        videoSrc: item.videoSrc,
        thumbnailSrc: item.thumbnailSrc,
      });
    },
    [clearHoverResetTimer],
  );

  useEffect(() => {
    return () => {
      clearHoverResetTimer();
    };
  }, [clearHoverResetTimer]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    video.load();
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      void playPromise.catch(() => {});
    }
  }, [activePreview.videoSrc]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      const container = containerRef.current;
      const mover = moverRef.current;
      const stickyWindow = stickyWindowRef.current;
      if (!container || !mover || !stickyWindow) {
        return;
      }

      if (mover.children.length < 2) {
        return;
      }

      const syncMeasurements = () => {
        const dynamicTranslation = Math.min(0, -(mover.scrollHeight - stickyWindow.offsetHeight));
        const scrollContainerHeight = Math.max(window.innerHeight, window.innerHeight + Math.abs(dynamicTranslation));
        container.style.setProperty('--dynamic-translation', `${Math.round(dynamicTranslation)}px`);
        container.style.setProperty('--scroll-container-height', `${Math.round(scrollContainerHeight)}px`);
        return dynamicTranslation;
      };

      let refreshFrameId: number | null = null;
      const scheduleRefresh = () => {
        if (refreshFrameId !== null) {
          return;
        }
        refreshFrameId = window.requestAnimationFrame(() => {
          refreshFrameId = null;
          syncMeasurements();
          ScrollTrigger.refresh();
        });
      };

      const verticalTween = gsap.to(mover, {
        y: () => syncMeasurements(),
        ease: 'none',
        scrollTrigger: {
          id: SCROLL_TRIGGER_ID,
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      const thumbnailTween = gsap.to('.thumbnail-image', {
        opacity: 0.18,
        ease: 'none',
        scrollTrigger: {
          id: THUMBNAIL_TRIGGER_ID,
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      const handleResize = () => {
        scheduleRefresh();
      };

      const handleLoad = () => {
        scheduleRefresh();
      };

      let resizeObserver: ResizeObserver | null = null;
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
          scheduleRefresh();
        });
        resizeObserver.observe(mover);
        resizeObserver.observe(stickyWindow);
      }

      syncMeasurements();
      window.addEventListener('resize', handleResize);
      window.addEventListener('load', handleLoad);
      if (typeof document !== 'undefined' && 'fonts' in document) {
        void document.fonts.ready.then(() => {
          scheduleRefresh();
        });
      }

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('load', handleLoad);
        resizeObserver?.disconnect();
        if (refreshFrameId !== null) {
          window.cancelAnimationFrame(refreshFrameId);
        }
        verticalTween.kill();
        thumbnailTween.kill();
      };
    });

    return () => {
      mm.revert();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.id === SCROLL_TRIGGER_ID || trigger.vars.id === THUMBNAIL_TRIGGER_ID) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <main className="filmography-page">
      <section ref={containerRef} className="filmography-scroll-container">
        <div className="filmography-video-container">
          <div className="video-wrapper">
            <video
              ref={videoRef}
              src={activePreview.videoSrc}
              className="background-video"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
            >
              <track kind="captions" />
            </video>
          </div>
          <img
            src={activePreview.thumbnailSrc}
            alt="thumbnail image"
            className="thumbnail-image"
          />
        </div>

        <div
          ref={stickyWindowRef}
          className="filmography-sticky-window"
          onMouseLeave={resetPreviewToDefault}
          onBlur={scheduleResetPreview}
        >
          <div ref={moverRef} className="film-mover">
            {FILMOGRAPHY_SECTIONS.map((section) => (
              <div key={section.title} className="scroll-content">
                <div className="filmography-card">
                  <h1 className="filmography-card-title">{section.title}</h1>
                  <div className="entry">
                    {section.items.map((item) => (
                      <div
                        key={item.id}
                        className="details-wrapper"
                        onMouseEnter={() => handleItemHover(item)}
                        onFocus={() => handleItemHover(item)}
                        onMouseLeave={scheduleResetPreview}
                      >
                        <div className="details">
                          {DETAIL_LAYERS.map((layer) => (
                            <div key={`${item.id}-${layer}`} className={`section section-${layer}`}>
                              <div className="title-container">
                                <h3 className="title">{item.title}</h3>
                              </div>
                              <div className="date-container">
                                <span className="date">{item.year}</span>
                              </div>
                              <div className="role-container">
                                <span className="role">{item.role ?? ''}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="scroll-indicator">
        <span className="scroll-text">Keep scrolling</span>
      </div>
    </main>
  );
}
