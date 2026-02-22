'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [displayChildren, setDisplayChildren] = useState(children);
    const leftBox = useRef<HTMLDivElement>(null);
    const rightBox = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (pathname && window.scrollY !== 0) {
            window.scrollTo(0, 0);
        }

        if (leftBox.current && rightBox.current) {
            gsap.fromTo(
                [leftBox.current, rightBox.current],
                { scaleY: 1, transformOrigin: 'top' },
                { scaleY: 0, duration: 1.2, ease: 'power4.inOut', stagger: 0.1, delay: 0.2, onStart: () => setDisplayChildren(children) },
            );
        }

        const lBox = leftBox.current;
        const rBox = rightBox.current;

        return () => {
            if (lBox && rBox) {
                gsap.killTweensOf([lBox, rBox]);
                gsap.set([lBox, rBox], { scaleY: 1, transformOrigin: 'bottom' });
            }
        };
    }, [pathname, children]);

    return (
        <>
            <div className="fixed inset-0 z-[999] pointer-events-none flex h-screen w-screen">
                <div ref={leftBox} className="flex-1 bg-[#FFCCEB] border-r-[0.1px] border-[#030203] origin-top scale-y-100 will-change-transform"></div>
                <div ref={rightBox} className="flex-1 bg-[#FFCCEB] origin-top scale-y-100 will-change-transform"></div>
            </div>
            {displayChildren}
        </>
    );
}
