import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type ScrollAnimationOptions = {
  trigger?: string | Element | null;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
};

export const createScrollTrigger = (target: gsap.TweenTarget, options: ScrollAnimationOptions = {}) => {
  const {
    trigger = target,
    start = 'top 80%',
    end = 'bottom 20%',
    scrub = false,
    markers = false,
    onEnter,
    onLeave,
    onEnterBack,
    onLeaveBack,
  } = options;

  return gsap.to(target, {
    scrollTrigger: {
      trigger,
      start,
      end,
      scrub,
      markers,
      onEnter,
      onLeave,
      onEnterBack,
      onLeaveBack,
    },
  });
};

export const fadeInUp = (target: gsap.TweenTarget, delay = 0) => {
  return gsap.from(target, {
    y: 50,
    opacity: 0,
    duration: 0.8,
    delay,
    ease: 'power2.out',
  });
};

export const staggerFadeIn = (target: string, stagger = 0.1) => {
  return gsap.from(target, {
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: {
      amount: stagger,
    },
    ease: 'power2.out',
  });
};

// Add this to your component's useEffect:
// useEffect(() => {
//   const tl = gsap.timeline();
//   tl.add(fadeInUp('.your-element'));
//   tl.add(staggerFadeIn('.your-staggered-elements'), '-=0.5');
// }, []);
