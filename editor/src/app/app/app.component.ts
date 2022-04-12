import { AfterViewInit, Component, ComponentRef, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { HomeComponent } from '../home/home.component';
import { AnimationService } from '../services/animation.service';
import { AppStateService, ControlledComponent } from '../services/app-state.service';
import { SetupComponent } from '../setup/setup.component';
import { AppState } from '../shared/app-state.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('mainContainer', { static: true, read: ViewContainerRef }) mainContainer: ViewContainerRef;
  @ViewChild('overlayContainer', { static: true, read: ViewContainerRef }) overlayContainer: ViewContainerRef;

  public hasFilledActions = false;

  constructor(
    private _electronService: ElectronService,
    private _appStateService: AppStateService,
    private _animationService: AnimationService) { }

  ngOnInit(): void {
    this._appStateService.onAppStateChanged.subscribe(appState => {
      console.log("app state changed: " + appState);
      let createdComponent: ComponentRef<ControlledComponent>;
      switch (appState) {
        case AppState.Home:
          createdComponent = this.mainContainer.createComponent(HomeComponent);
          break;
        case AppState.Setup:
          createdComponent = this.overlayContainer.createComponent(SetupComponent);          
          break;
      }

      if (this._appStateService.currentComponent != null) {
        // Get the hide animation string
        let hideString = this._appStateService.currentComponent.instance.getHideAnimation();
        if (hideString != null) {
          // Parse the hide animation string as data
          let hideData = this._animationService.parseAnimData(hideString);

          // Execute the animation
          this._animationService.execute(this._appStateService.currentComponent.location.nativeElement.children[0], hideData).then(() => {
            this._appStateService.currentComponent.destroy();
          });
        } else {
          this._appStateService.currentComponent.destroy();
        }
      }

      let revealString = createdComponent.instance.getRevealAnimation();
      if (revealString != null) {
        let revealData = this._animationService.parseAnimData(revealString);
        if(this._appStateService.currentComponent != null) {
          revealData.delay += 1;
        }
        this._animationService.execute(createdComponent.location.nativeElement.children[0], revealData);
      }

      this._appStateService.setState(createdComponent);
    });
  }

  ngAfterViewInit(): void {
    if (this._electronService.isElectronApp) {
      this._electronService.ipcRenderer.invoke('getSettingsExists').then(settings => {
        if (settings) {
          this._appStateService.changeState(AppState.Home);
        } else {
          this._appStateService.changeState(AppState.Setup);
        }
      });
    } else {
      console.log('not an electron app!');
    }
  }
}
