import { AfterViewInit, Component, OnInit } from '@angular/core';
import gsap from 'gsap';
import { ElectronService } from 'ngx-electron';
import { Action, StreamerBotSettings, SubAction } from '../shared/streamer-bot-settings.model';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AnimationDistance, AnimationPoint, AnimationService, AnimationSpeed } from '../services/animation.service';
import { AppStateService, ControlledComponent } from '../services/app-state.service';
import { HomeComponent } from '../home/home.component';
import { AppState } from '../shared/app-state.model';

enum SetupStage {
  Locate,
}

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit, ControlledComponent {

  public stage: SetupStage = SetupStage.Locate;
  public SetupStage = SetupStage;

  public streamerBotSettings: StreamerBotSettings;

  constructor(
    private _electronService: ElectronService,
    private _formBuilder: FormBuilder,
    private _animationService: AnimationService,
    private _appStateService: AppStateService) { }

  getRevealAnimation(): string {
    return null;
  }
  getHideAnimation(): string {
    return 'slide-out,right,0,normal,veryLong';
  }

  ngOnInit(): void {
    this.stage = SetupStage.Locate;
  }

  findSettings() {
    this._electronService.ipcRenderer.invoke('findStreamerBot').then(result => {
      if (result == true) {
        this._electronService.ipcRenderer.invoke('getStreamerBotSettings').then(botSettings => {
          this.streamerBotSettings = JSON.parse(botSettings);
          console.log(this.streamerBotSettings);
          this._appStateService.changeState(AppState.Home);
        });
      }
    });
  }

  hide(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.streamerBotSettings) {
        resolve();
      } else {
        reject();
      }
    });
  }
}
