import { AfterViewInit, Component, OnInit } from '@angular/core';
import gsap from 'gsap';
import { ElectronService } from 'ngx-electron';
import { Action, StreamerBotSettings, SubAction } from '../shared/streamer-bot-settings.model';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';

enum SetupStage {
  Locate,
}

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit, AfterViewInit {

  public stage: SetupStage = SetupStage.Locate;
  public SetupStage = SetupStage;

  public streamerBotSettings: StreamerBotSettings;

  constructor(
    private _electronService: ElectronService,
    private _formBuilder: FormBuilder){ }  

  ngOnInit(): void {
    this.stage = SetupStage.Locate;
  }

  ngAfterViewInit(): void {
    var expand = document.getElementById('expand');
    gsap.fromTo(expand, { height: 0 }, { height: "auto", duration: 1, delay: 2.5 }).then(_ => {
      expand!.style.overflow = 'visible';
    });
  }

  findSettings() {
    this._electronService.ipcRenderer.invoke('findStreamerBot').then(result => {
      if(result == true) {
        this._electronService.ipcRenderer.invoke('getStreamerBotSettings').then(botSettings => {
          this.streamerBotSettings = JSON.parse(botSettings);
          console.log(this.streamerBotSettings);
          
          // TODO: leave this place!
        });
      }
    });
  }
}
