import React, { useState, useEffect, useRef } from 'react';

const LazyLoadSection = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the element is visible (or close to being visible)
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once loaded to save resources
        }
      },
      {
        rootMargin: '200px', // Start loading 200px before the user reaches the section
        threshold: 0.01      // Trigger as soon as even 1% is visible (with margin)
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // minHeight prevents layout shift (jerkiness) before content loads
  return (
    <div ref={elementRef} style={{ minHeight: '100px' }}>
      {isVisible ? children : null}
    </div>
  );
};

export default LazyLoadSection;