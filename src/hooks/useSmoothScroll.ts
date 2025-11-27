import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll() {
  useEffect(() => {
    // Enable smooth scrolling for the whole document
    gsap.to('html, body', {
      scrollBehavior: 'smooth',
      scrollTo: {
        y: 0,
        autoKill: false,
      },
    });

    // Initialize ScrollTrigger
    ScrollTrigger.defaults({
      toggleActions: 'play none none none',
      scroller: 'body',
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href')!);
        if (target) {
          gsap.to(window, {
            duration: 0.8,
            scrollTo: {
              y: target,
              offsetY: 80, // Adjust for fixed header
              autoKill: false,
            },
            ease: 'power2.inOut',
          });
        }
      });
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
}

// Usage in your components:
// import { useSmoothScroll } from '@/hooks/useSmoothScroll';
// useSmoothScroll(); // Call in your component
