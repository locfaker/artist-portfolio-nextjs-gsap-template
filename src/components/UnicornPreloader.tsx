'use client';

import { useEffect, useRef } from 'react';

export default function UnicornPreloader() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initUnicorn = () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const UnicornStudio = (window as any).UnicornStudio;
            if (UnicornStudio && containerRef.current) {
                // Preloader project ID
                UnicornStudio.init({
                    projectId: 'sgVkTo6U9Yyob1BiSWkF',
                    element: containerRef.current,
                    lazyLoad: true,
                    disableMobile: true
                })
                    .then(() => console.log('Unicorn Studio initialized preloader'))
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .catch((err: any) => console.error('Failed to init Unicorn Studio preloader', err));
            }
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((window as any).UnicornStudio) {
            initUnicorn();
        } else {
            const script = document.createElement('script');
            script.src = '/assets/unicornStudio.umd.js';
            script.onload = initUnicorn;
            document.body.appendChild(script);
        }
    }, []);

    return (
        <div
            ref={containerRef}
            className="h-full w-full pointer-events-auto"
        />
    );
}
