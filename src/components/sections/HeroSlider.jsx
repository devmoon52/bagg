import { ChevronLeft, ChevronRight } from "lucide-react";

// Images
import electronics from "../../assets/images/electronics-banner.jpg";
import fashion from "../../assets/images/fashion-banner.jpg";
import kitchen from "../../assets/images/kitchen-banner.jpg";
import watches from "../../assets/images/watches-banner.jpg";
import { useState, useEffect, useRef, useCallback } from "react";

const slides = [
  {
    id: 1,
    image: electronics,
    alt: "Electronic products",
  },
  {
    id: 2,
    image: kitchen,
    alt: "Kitchen products",
  },
  {
    id: 3,
    image: watches,
    alt: "Branded watches",
  },
  {
    id: 4,
    image: fashion,
    alt: "Fashion products",
  },
];

// infinite slides
const infiniteSlides = [
  {
    ...slides[slides.length - 1],
    key: "clone-first",
  },
  ...slides.map((s) => {
    return {
      ...s,
      key: `real-${s.id}`,
    };
  }),
  {
    ...slides[0],
    key: "clone-last",
  },
];

const HeroSlider = () => {
  const [index, setIndex] = useState(1);
  const [enableTransition, setEnableTransition] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const timerRef = useRef(null);
  const isAnimatingRef = useRef(false);

  // handle transition - run after every transition complete
  function handleTransitionEnd(e) {
    if (e.propertyName !== "transform") return;

    if (index === slides.length + 1) {
      setEnableTransition(false);
      setIndex(1);
    }

    if (index === 0) {
      setEnableTransition(false);
      setIndex(slides.length);
    }

    isAnimatingRef.current = false;
    setIsAnimating(false);
  }

  // enable transition again on the next frame
  useEffect(() => {
    if (!enableTransition) {
      requestAnimationFrame(() => {
        setEnableTransition(true);
      });
    }
  }, [enableTransition]);

  // swipe to next
  const swipeNext = useCallback(() => {
    if (isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    setIsAnimating(true);

    setIndex((prev) => prev + 1);
  }, []);

  // swipe to previous
  const swipePrevious = useCallback(() => {
    if (isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    setIsAnimating(true);

    setIndex((prev) => prev - 1);
  }, []);

  // reset timer
  const rasetTimer = useCallback(() => {
    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      swipeNext();
    }, 8000);
  }, [swipeNext]);

  // create loop - auto swipe
  useEffect(() => {
    timerRef.current = setInterval(() => {
      swipeNext();
    }, 8000);

    return () => {
      clearInterval(timerRef.current);
    };
  }, [swipeNext]);

  return (
    <section className="sm:block hidden">
      {/* wrapper */}
      <div
        role="region"
        aria-label="Hero carosel"
        className="max-w-7xl mx-auto relative flex flex-nowrap overflow-x-clip"
      >
        {/* btns */}
        <>
          <button
            disabled={isAnimating}
            onClick={() => {
              swipePrevious();
              rasetTimer();
            }}
            className="h-full md:p-0 p-1 absolute top-1/2 -translate-y-1/2 left-0 md:max-w-20 max-w-max w-full cursor-pointer flex items-center justify-center hover:shadow-md hover:text-peach-ultra transition-colors duration-200 z-8888 text-white"
          >
            <ChevronLeft aria-hidden="true" size={32} />
          </button>
          <button
            disabled={isAnimating}
            onClick={() => {
              swipeNext();
              rasetTimer();
            }}
            className="h-full md:p-0 p-1 absolute top-1/2 -translate-y-1/2 right-0 md:max-w-20 max-w-max w-full cursor-pointer flex items-center justify-center hover:shadow-md hover:text-peach-ultra transition-colors duration-200 z-8888 text-white"
          >
            <ChevronRight aria-hidden="true" size={32} />
          </button>
        </>

        <div
          style={{
            transform: `translateX(-${index * 100}%)`,
          }}
          onTransitionEnd={handleTransitionEnd}
          className={`flex ${enableTransition ? "transition-transform duration-300" : ""}`}
        >
          {infiniteSlides.map((slide, i) => {
            return (
              <img
                key={slide.key}
                src={slide.image}
                alt={slide.alt}
                fetchPriority={i === 1 ? "high" : "auto"}
                loading={i === 1 ? "eager" : "lazy"}
                className="w-full shrink-0"
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
