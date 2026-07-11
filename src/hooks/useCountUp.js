import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

/**
 * GSAP-powered counter animation hook.
 * Returns [ref, displayValue] — ref for the number element.
 */
export function useCountUp(target, options = {}) {
  const { duration = 2, startOnVisible = true, decimals = 0 } = options;
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!startOnVisible) {
      animateCount();
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateCount();
          observer.unobserve(element);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  function animateCount() {
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration,
      ease: 'power2.out',
      onUpdate: () => setValue(parseFloat(obj.val.toFixed(decimals))),
    });
  }

  return [ref, value];
}
