'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const isMediaPage = pathname.startsWith('/media');

  return (
    <nav className={`navbar ${isMediaPage ? 'media-page-nav' : ''}`} aria-label="Main navigation">
      <div className="desktop-nav-section desktop-nav-section-1">
        <div className="desktop-nav-col">
          <Link href="/artist" className={`nav-link ${isMediaPage ? 'nav-link-black' : ''}`}>
            ARTIST
          </Link>
          <Link href="/filmography" className={`nav-link ${isMediaPage ? 'nav-link-black' : ''}`}>
            FILMOGRAPHY
          </Link>
        </div>
      </div>

      <div className="desktop-nav-section desktop-nav-section-2">
        <div className="desktop-nav-col">
          <a
            href="mailto:business@beckyentertainment.co"
            className={`nav-link nav-link-lowercase ${isMediaPage ? 'nav-link-black' : ''}`}
            aria-label="Contact Becky Entertainment by Email"
          >
            business@beckyentertainment.co
          </a>
          <a
            href="https://line.me/R/ti/p/@beckyent"
            target="_blank"
            rel="noopener noreferrer"
            className={`nav-link ${isMediaPage ? 'nav-link-black' : ''}`}
            aria-label="Contact Becky Entertainment on LINE (@beckyent)"
          >
            LINE: @beckyent
          </a>
        </div>
      </div>

      <div className="desktop-nav-section desktop-nav-section-3">
        <div className="desktop-nav-col-center">
          <Link href="/" aria-label="Becky Entertainment Home">
            <Image
              src="/assets/images/becky_logo.svg"
              alt="Becky Entertainment Logo"
              width={198}
              height={40}
              className={`navbar-logo-img ${isMediaPage ? 'invert brightness-0' : ''}`}
              priority
            />
          </Link>
        </div>
      </div>

      <div className="desktop-nav-section desktop-nav-section-4">
        <button
          type="button"
          className="language-toggle-btn-desktop notranslate"
          aria-label="Switch to Thai"
        >
          <div className="flag-wrapper">
            <Image src="/assets/images/britian.svg" alt="British Flag" width={28} height={28} className="flag-icon" />
          </div>
          <span className="language-text">
            <span className="active">EN</span>
            <span className="separator">/</span>
            <span>THAI</span>
          </span>
        </button>
      </div>

      <div className="desktop-nav-section desktop-nav-section-5">
        <a
          href="mailto:business@beckyentertainment.co"
          className={`hire-now-btn ${isMediaPage ? 'hire-now-btn-black' : ''}`}
          aria-label="Contact Becky Entertainment by Email"
        >
          contact
        </a>
        <div className="desktop-nav-col-end">
          <Link href="/artist#awards-section" className={`nav-link ${isMediaPage ? 'nav-link-black' : ''}`}>
            AWARDS
          </Link>
          <Link href="/media" className={`nav-link ${isMediaPage ? 'nav-link-black' : ''}`}>
            PRESS/MEDIA
          </Link>
        </div>
      </div>

      <div className="mobile-nav-container">
        <Link href="/" aria-label="Becky Entertainment Home" className="logo-container">
          <Image
            src="/assets/images/becky_logo.svg"
            alt="Becky Entertainment Logo"
            width={158}
            height={32}
            className={`navbar-logo-img ${isMediaPage ? 'invert brightness-0' : ''}`}
            priority
          />
        </Link>
        <div className="mobile-nav-links">
          <Link href="/artist" className={`nav-link ${isMediaPage ? 'nav-link-black' : ''}`}>
            ARTIST
          </Link>
          <Link href="/media" className={`nav-link ${isMediaPage ? 'nav-link-black' : ''}`}>
            MEDIA
          </Link>
        </div>
      </div>
    </nav>
  );
}
