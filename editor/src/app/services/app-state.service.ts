import { Component, ComponentRef, Injectable, Type } from '@angular/core';
import { Subject } from 'rxjs';
import { AppState } from '../shared/app-state.model';

export interface ControlledComponent {
  hide(): Promise<void>;
  getRevealAnimation(): string;
  getHideAnimation(): string;
};

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  onAppStateChanged = new Subject<AppState>();
  currentComponent: ComponentRef<ControlledComponent>;

  constructor() { }

  changeState(appState: AppState) {
    if (this.currentComponent != null) {
      this.currentComponent.instance.hide().then(() => {
        this.onAppStateChanged.next(appState);
      }); // Do nothing on rejection.
    } else {
      this.onAppStateChanged.next(appState);
    }
  }

  setState(state: ComponentRef<ControlledComponent>) {
    if (!this.currentComponent) {
      this.currentComponent = state;
    }
  }
}
