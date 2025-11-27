import gsap from 'gsap';

export class SmoothScroll {
  private scrollContainer: HTMLElement | Window;
  private targetY: number = 0;
  private currentY: number = 0;
  private rafId: number | null = null;
  private isScrolling: boolean = false;
  private ease: number = 0.1;
  private lastScrollTime: number = 0;
  private scrollTimeout: NodeJS.Timeout | null = null;

  constructor(container: HTMLElement | Window = window) {
    this.scrollContainer = container;
    this.currentY = this.getScrollY();
    this.targetY = this.currentY;
    
    // Disable default scroll behavior
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Start the render loop
    this.render();
    
    // Handle scroll events
    this.addListeners();
  }

  private getScrollY(): number {
    return this.scrollContainer === window 
      ? window.pageYOffset 
      : (this.scrollContainer as HTMLElement).scrollTop;
  }

  private setScrollY(y: number): void {
    if (this.scrollContainer === window) {
      window.scrollTo(0, y);
    } else {
      (this.scrollContainer as HTMLElement).scrollTop = y;
    }
  }

  private addListeners(): void {
    // Handle wheel events for smooth scrolling
    window.addEventListener('wheel', this.handleWheel, { passive: false });
    
    // Handle touch events for mobile
    window.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    
    // Handle keyboard navigation
    window.addEventListener('keydown', this.handleKeyDown, { passive: false });
    
    // Handle programmatic scrolling
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    
    // Handle resize events
    window.addEventListener('resize', this.handleResize, { passive: true });
  }

  private handleWheel = (e: WheelEvent): void => {
    if (this.isInertialScrolling()) return;
    
    // Prevent default scrolling
    e.preventDefault();
    
    // Update target scroll position
    this.targetY += e.deltaY;
    this.clampTargetY();
    
    // Update last scroll time
    this.lastScrollTime = Date.now();
  };

  private handleTouchMove = (e: TouchEvent): void => {
    if (this.isInertialScrolling()) return;
    
    // Prevent default scrolling on touch devices
    e.preventDefault();
    
    // Update target scroll position based on touch movement
    if (e.touches.length === 1) {
      const touchY = e.touches[0].clientY;
      this.targetY = -touchY;
      this.clampTargetY();
    }
    
    // Update last scroll time
    this.lastScrollTime = Date.now();
  };

  private handleKeyDown = (e: KeyboardEvent): void => {
    // Handle keyboard navigation (arrow keys, page up/down, home/end)
    const key = e.key;
    const scrollAmount = window.innerHeight * 0.8;
    
    switch (key) {
      case 'ArrowDown':
      case 'PageDown':
        e.preventDefault();
        this.targetY += scrollAmount;
        break;
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        this.targetY -= scrollAmount;
        break;
      case 'Home':
        e.preventDefault();
        this.targetY = 0;
        break;
      case 'End':
        e.preventDefault();
        this.targetY = document.body.scrollHeight - window.innerHeight;
        break;
    }
    
    this.clampTargetY();
  };

  private handleScroll = (): void => {
    // Update targetY if user scrolls with the scrollbar
    if (!this.isScrolling) {
      this.targetY = this.getScrollY();
    }
  };

  private handleResize = (): void => {
    // Recalculate max scroll position on resize
    this.clampTargetY();
  };

  private isInertialScrolling(): boolean {
    // Check if we're still in the inertia phase after a scroll
    return Date.now() - this.lastScrollTime < 1000;
  }

  private clampTargetY(): void {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    this.targetY = Math.max(0, Math.min(this.targetY, maxScroll));
  }

  private render = (): void => {
    // Apply smooth scrolling
    this.currentY += (this.targetY - this.currentY) * this.ease;
    
    // Set the scroll position
    this.setScrollY(this.currentY);
    
    // Continue the animation loop
    this.rafId = requestAnimationFrame(this.render);
    
    // Update scrolling state
    this.isScrolling = Math.abs(this.targetY - this.currentY) > 0.5;
  };

  public scrollTo(y: number, duration: number = 1): void {
    gsap.to(this, {
      targetY: y,
      duration,
      ease: 'power2.inOut',
      onUpdate: () => this.clampTargetY()
    });
  }

  public destroy(): void {
    // Clean up event listeners
    window.removeEventListener('wheel', this.handleWheel);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
    
    // Stop the animation loop
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    
    // Re-enable default scroll behavior
    document.documentElement.style.scrollBehavior = '';
  }
}

// Usage:
// Initialize:
// const smoothScroll = new SmoothScroll();
// 
// To scroll to a position:
// smoothScroll.scrollTo(1000);
// 
// To scroll to an element:
// const element = document.querySelector('#target');
// smoothScroll.scrollTo(element.offsetTop);
// 
// Clean up when done:
// smoothScroll.destroy();
