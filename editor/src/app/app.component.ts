import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'editor';

  public hasFilledActions = false;

  constructor(private _electronService: ElectronService) { }

  ngOnInit(): void {
    if (this._electronService.isElectronApp) {
      this._electronService.ipcRenderer.invoke('getSettings').then(settings => {
        if (settings) {
          console.log('got settings.');
          console.log(`streamer.bot path is ${JSON.parse(settings).streamerBotPath}`);
        } else {
          console.log('no settings file found.');
        }
      });
    } else {
      console.log('not an electron app!');
    }
  }
}
