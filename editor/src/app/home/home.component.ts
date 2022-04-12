import { Component, OnInit } from '@angular/core';
import { ControlledComponent } from '../services/app-state.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, ControlledComponent {

  constructor() { }

  getRevealAnimation(): string {
    return 'slide-in,bottom,0,normal,veryLong';
  }
  getHideAnimation(): string {
    return 'slide-out,right,0,normal,veryLong';
  }

  ngOnInit(): void {
  }

  hide(): Promise<void> {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
}
