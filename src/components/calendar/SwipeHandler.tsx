'use client';

import { useSwipeable } from 'react-swipeable';

interface SwipeHandlerProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  children: React.ReactNode;
  className?: string;
}

export function SwipeHandler({
  onSwipeLeft,
  onSwipeRight,
  children,
  className,
}: SwipeHandlerProps) {
  const handlers = useSwipeable({
    onSwipedLeft: () => onSwipeLeft(),
    onSwipedRight: () => onSwipeRight(),
    trackMouse: false, // Don't track mouse swipes on desktop
    trackTouch: true,
    preventScrollOnSwipe: false,
    delta: 50, // Minimum swipe distance
  });

  return (
    <div {...handlers} className={className}>
      {children}
    </div>
  );
}
