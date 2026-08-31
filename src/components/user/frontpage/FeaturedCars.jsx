import { useEffect, useRef, useState, useMemo } from "react";
import CarCard from "../carcards/CarCard";
import styles from "./FeaturedCars.module.css";

export default function FeaturedCars({ cars }) {
  const scrollRef = useRef(null);
  const [centerIndex, setCenterIndex] = useState(0);

  const setLength = cars.length;

  const loopedCars = useMemo(() => [...cars, ...cars, ...cars], [cars]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || setLength === 0) return;

    const gap = 16;
    const cardWidth = () => el.children[0]?.getBoundingClientRect().width || 0;

    // Start scrolled into the middle copy, with no animation,
    // so both swipe directions have room before hitting either end.
    const firstMiddleCard = el.children[setLength];
    if (firstMiddleCard) {
      el.scrollLeft =
        firstMiddleCard.offsetLeft -
        (el.clientWidth - firstMiddleCard.clientWidth) / 2;
    }

    let ticking = false;

    const updateActiveAndLoop = () => {
      ticking = false;
      const containerCenter = el.scrollLeft + el.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;

      Array.from(el.children).forEach((child, i) => {
        const childCenter = child.offsetLeft + child.offsetWidth / 2;
        const distance = Math.abs(containerCenter - childCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });

      setCenterIndex(closestIndex);

      // Silently jump back into the middle set once the user has
      // drifted into a clone — scrollLeft changes instantly with
      // no animation, so the loop feels seamless.
      if (closestIndex < setLength) {
        el.scrollLeft += setLength * (cardWidth() + gap);
      } else if (closestIndex >= setLength * 2) {
        el.scrollLeft -= setLength * (cardWidth() + gap);
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateActiveAndLoop);
      }
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    updateActiveAndLoop();

    return () => el.removeEventListener("scroll", handleScroll);
  }, [setLength]);

  return (
    <section className={styles.featuredCars}>
      <h2 className={styles.sectionTitleLight}>Featured Cars</h2>

      {cars.length > 0 ? (
        <>
          {/* Mobile — infinite magnetic carousel */}
          <div className={styles.carsCarousel} ref={scrollRef}>
            {loopedCars.map((car, i) => (
              <div
                key={`${car.id}-${i}`}
                className={`${styles.carSlide} ${
                  i === centerIndex ? styles.carSlideActive : ""
                }`}
              >
                <CarCard car={car} />
              </div>
            ))}
          </div>

          {/* Desktop / tablet — original grid, untouched */}
          <div className={styles.carsGrid}>
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </>
      ) : (
        <p className={styles.noResults}>
          No cars match your search. Try adjusting your filters.
        </p>
      )}
    </section>
  );
}
