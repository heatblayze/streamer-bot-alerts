import { AfterViewInit, Component, OnInit } from '@angular/core';
import gsap from 'gsap';

enum SetupStage {
  Locate,
  Generate,
}

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit, AfterViewInit {

  public stage: SetupStage = SetupStage.Locate;
  public SetupStage = SetupStage;

  constructor() { }  

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    var expand = document.getElementById('expand');
    gsap.fromTo(expand, { height: 0 }, { height: "auto", duration: 1, delay: 2.5 });
  }
}
