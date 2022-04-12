import gsap from 'gsap';
import { Injectable } from '@angular/core';

export enum AnimationPoint {
  Bottom,
  Top,
  Left,
  Right
}

export enum AnimationSpeed {
  Normal,
  Slow,
  Fast
}

export enum AnimationDistance {
  Normal,
  Short,
  Long
}

@Injectable({
  providedIn: 'root'
})
export class AnimationService {

  readonly speeds = [1, 2, 0.5];
  readonly distances = [20, 10, 30];

  constructor() { }

  slideIn(targets: gsap.TweenTarget, origin: AnimationPoint,
    delay: number = 0,
    speed: AnimationSpeed = AnimationSpeed.Normal,
    distance: AnimationDistance = AnimationDistance.Normal): gsap.core.Tween {
    return this.slide(targets, origin, true, delay, speed, distance);
  }

  slideOut(targets: gsap.TweenTarget, end: AnimationPoint,
    delay: number = 0,
    speed: AnimationSpeed = AnimationSpeed.Normal,
    distance: AnimationDistance = AnimationDistance.Normal): gsap.core.Tween {
    return this.slide(targets, end, false, delay, speed, distance);
  }

  private slide(targets: gsap.TweenTarget, point: AnimationPoint,
    reveal: boolean, delay: number, speed: AnimationSpeed, distance: AnimationDistance): gsap.core.Tween {
    let motionData;
    switch (point) {
      case AnimationPoint.Top:
        motionData = { y: -this.distances[distance] };
        break;
      case AnimationPoint.Bottom:
        motionData = { y: this.distances[distance] };
        break;
      case AnimationPoint.Left:
        motionData = { x: -this.distances[distance] };
        break;
      case AnimationPoint.Right:
        motionData = { x: this.distances[distance] };
        break;
    }

    let animData: gsap.TweenVars = {
      ease: "power2.inOut",
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
