import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Import the CSS for smooth scrolling
import '@/styles/smooth-scroll.css';

type SmoothScrollProviderProps = {
  children: ReactNode;
};

// Simple smooth scroll function with requestAnimationFrame
const smoothScrollTo = (to: number, duration: number = 500) => {
  const start = window.pageYOffset;
  const change = to - start;
  const startTime = performance.now();
  
  const animateScroll = (currentTime: number) => {
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    
    // Ease in-out function
    const easeInOutQuad = (t: number) => {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };
    
    window.scrollTo(0, start + change * easeInOutQuad(progress));
    
    if (timeElapsed < duration) {
      requestAnimationFrame(animateScroll);
    }
  };
  
  requestAnimationFrame(animateScroll);
};

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const location = useLocation();

  useEffect(() => {
    // Check if smooth scrolling is supported natively
    const supportsNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;
    
    // Handle route changes
    const scrollToTop = () => {
      if (supportsNativeSmoothScroll) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        smoothScrollTo(0);
      }
    };

    // Handle anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement;
      
      if (anchor) {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId!);
        if (targetElement) {
          const headerOffset = 80; // Adjust based on your header height
          const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - headerOffset;
          
          if (supportsNativeSmoothScroll) {
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          } else {
            smoothScrollTo(offsetPosition);
          }
          
          // Update URL without adding to history
          if (history.pushState) {
            history.pushState(null, '', targetId);
          } else {
            location.hash = targetId;
          }
        }
      }
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        // Small delay to ensure the element is focused
        setTimeout(() => {
          const activeElement = document.activeElement as HTMLElement;
          if (activeElement) {
            const elementPosition = activeElement.getBoundingClientRect().top + window.pageYOffset;
            const viewportHeight = window.innerHeight;
            const offsetPosition = elementPosition - (viewportHeight / 3);
            
            if (supportsNativeSmoothScroll) {
              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
            } else {
              smoothScrollTo(offsetPosition, 300);
            }
          }
        }, 10);
      }
    };

    // Add event listeners
    window.addEventListener('popstate', scrollToTop);
    document.addEventListener('click', handleAnchorClick);
    document.addEventListener('keydown', handleKeyDown);

    // Initial scroll to top on route change
    scrollToTop();

    // Cleanup
    return () => {
      window.removeEventListener('popstate', scrollToTop);
      document.removeEventListener('click', handleAnchorClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [location.pathname]);

  return <>{children}</>;
}
