import gsap from 'gsap';
import { Injectable } from '@angular/core';

export enum AnimationPoint {
  bottom,
  top,
  left,
  right
}

export enum AnimationSpeed {
  slow,
  normal,
  fast
}

export enum AnimationDistance {
  short,
  normal,
  long,
  veryLong,
  extraLong
}

class AnimationData {
  type: string;
  point: AnimationPoint;
  delay: number;
  speed: AnimationSpeed;
  distance: AnimationDistance;
}

@Injectable({
  providedIn: 'root'
})
export class AnimationService {

  readonly speeds = [2, 1, 0.5];
  readonly distances = [5, 20, 50, 100, 200];

  constructor() { }

  init() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        let animations = document.querySelectorAll('[data-anim]');
        animations.forEach(element => {
          let animData = this.parseAnimData(element.getAttribute('data-anim'));
          this.execute(element, animData);
        });

        animations.forEach(element => element.removeAttribute('data-anim'));
      });
    });

    observer.observe(document.body, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  parseAnimData(animString: string): AnimationData {
    let animValues = animString.split(',');
    return {
      type: animValues[0],
      point: AnimationPoint[animValues[1]],
      delay: animValues.length > 1 ? parseFloat(animValues[2]) : 0,
      speed: animValues.length > 2 ? AnimationSpeed[animValues[3]] : undefined,
      distance: animValues.length > 3 ? AnimationDistance[animValues[4]] : undefined,
    };
  }

  execute(element: Element, animData: AnimationData): gsap.core.Tween {
    switch (animData.type) {
      case 'slide-in':
        return this.slideIn(element, animData.point, animData.delay, animData.speed, animData.distance);
      case 'slide-out':
        return this.slideOut(element, animData.point, animData.delay, animData.speed, animData.distance);
    }
    return null;
  }

  slideIn(targets: gsap.TweenTarget, origin: AnimationPoint,
    delay: number = 0,
    speed: AnimationSpeed = AnimationSpeed.normal,
    distance: AnimationDistance = AnimationDistance.normal): gsap.core.Tween {
    return this.slide(targets, origin, true, delay, speed, distance);
  }

  slideOut(targets: gsap.TweenTarget, end: AnimationPoint,
    delay: number = 0,
    speed: AnimationSpeed = AnimationSpeed.normal,
    distance: AnimationDistance = AnimationDistance.normal): gsap.core.Tween {
    return this.slide(targets, end, false, delay, speed, distance);
  }

  private slide(targets: gsap.TweenTarget, point: AnimationPoint,
    reveal: boolean, delay: number, speed: AnimationSpeed, distance: AnimationDistance): gsap.core.Tween {
    let motionData;
    switch (point) {
      case AnimationPoint.top:
        motionData = { y: -this.distances[distance] };
        break;
      case AnimationPoint.bottom:
        motionData = { y: this.distances[distance] };
        break;
      case AnimationPoint.left:
        motionData = { x: -this.distances[distance] };
        break;
      case AnimationPoint.right:
        motionData = { x: this.distances[distance] };
        break;
    }

    let animData: gsap.TweenVars = {
      ease: "power2.out",
      duration: this.speeds[speed],
      opacity: 0
    };

    // delay is optional, so don't include it unless it's set
    if (delay > 0) {
      animData = { ...animData, ...{ delay: delay } };
    }

    animData = { ...animData, ...motionData };
    if (reveal) {
      return gsap.from(targets, animData);
    } else {
      return gsap.to(targets, animData);
    }
  }
}
