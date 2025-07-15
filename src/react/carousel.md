## 轮播图实现

tsx

```
import styles from "./styles-b.module.scss";
import { ICarouselItemProps } from "./props";
import { useEffect, useRef, useState } from "react";

export const Carousel = (props: { items: ICarouselItemProps[] }) => {

  const list = props.items.slice().concat(props.items[0]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [touchStart, setTouchStart] = useState<number>(0);
  const [touching, setTouching] = useState<boolean>(false);
  const [touchEnd, setTouchEnd] = useState<number>(0);

  const carouselRef = useRef<HTMLDivElement>(null);

  const setIntervalId = useRef<any>(null);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleMove = (index:number) => {
    carouselRef.current?.scrollTo({
      left: index * carouselRef.current.clientWidth,
      behavior: "smooth",
    });
  }

  // console.log("currentIndex", currentIndex);

  const range = 80;

  const handleTouchStart = () => {
    console.log("start");
    setTouchStart(carouselRef.current!.scrollLeft);
    setTouching(true);
    setIntervalId.current && clearTimeout(setIntervalId.current);
  };
  const handleTouchEnd = () => {
    console.log("end");
    setTouchEnd(carouselRef.current!.scrollLeft);
    setTouching(false);
    if (touchStart - touchEnd > range) {
      if (currentIndex === list.length - 1) {
        setCurrentIndex(0);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    } else if (touchStart - touchEnd < -range) {
      if (currentIndex === 0) {
        setCurrentIndex(list.length - 1);
      } else {
        setCurrentIndex(currentIndex - 1);
      }
    }
    handleMove(currentIndex);
  }

  // useEffect(() => {
  //   if (currentIndex === 0) {
  //     handleMove(currentIndex);
  //   } else {
  //     handleMove(currentIndex);
  //   }
  //   setIntervalId.current = setInterval(() => {
  //     if (currentIndex === list.length - 1) {
  //       setCurrentIndex(0);
  //     } else {
  //       setCurrentIndex(currentIndex + 1);
  //     }
  //   }, 3000);
  //   return () => {
  //     clearInterval(setIntervalId.current);
  //   };
  // }, [currentIndex, list.length]);


  return (
    <div className={styles.carousel}>
      <div
        className={styles.carouselList}
        ref={carouselRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ transform: `translateX(-${currentIndex * carouselRef.current?.clientWidth!}px)` }}
      >
        {list.map((item: ICarouselItemProps, index: number) => (
          <div key={index} className={styles.carouselItem}>
            <img className={styles.img} src={item.url} alt={item.alt} />
          </div>
        ))}
      </div>
      <div className={styles.carouselDots}>
        {props.items.map((_, index: number) => (
          <div
            key={index}
            className={`${styles.dot} ${
              currentIndex === index ? styles.active : ""
            }`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

```

css

```
.carousel {
  position: relative;
  overflow: hidden;
  .carouselList {
    position: relative;
    display: flex;
    height: 200px;
    background-color: aqua;
    // scroll-snap-type: x mandatory;
    transition: all 0.5s ease-in-out;
  
    .carouselItem {
      flex-shrink: 0;
      width: 100%;
      height: 100%;
      // scroll-snap-align: center;
      // scroll-snap-stop: always;
  
      .img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  
  }
  
  .carouselDots {
    display: flex;
    justify-content: center;
    gap: 5px;
    position: absolute;
    bottom: 10px;
    width: 100%;
    height: 10px;
    z-index: 1;
  
    .dot {
      width: 5px;
      height: 5px;
      border-radius: 5px;
      background-color: var(--color-font-light);
      transition: all 0.2s;
      border: 1px solid #fff;
      &.active {
        width: 15px;
        background-color: var(--color-red);
      }
    }
  }
}

```

