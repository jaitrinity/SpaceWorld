import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';
import { Constant } from './shared/constant/Contant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Crest Digitel';
  autoLogoutTime = 0; // in second
  // elem;
  constructor(private router : Router, private bnIdle: BnNgIdleService){
    this.autoLogoutTime = Constant.AUTO_LOGOUT_TIME;
    this.bnIdle.startWatching(this.autoLogoutTime).subscribe((res) => {
      if(res) {
        // console.log("session expired");
        // localStorage.clear();
        this.router.navigate(['/login']);
      }
    })
    // this.elem = document.documentElement;
  }

  // openFullscreen() {
  //   if (this.elem.requestFullscreen) {
  //     this.elem.requestFullscreen();
  //   } else if (this.elem.mozRequestFullScreen) {
  //     /* Firefox */
  //     this.elem.mozRequestFullScreen();
  //   } else if (this.elem.webkitRequestFullscreen) {
  //     /* Chrome, Safari and Opera */
  //     this.elem.webkitRequestFullscreen();
  //   } else if (this.elem.msRequestFullscreen) {
  //     /* IE/Edge */
  //     this.elem.msRequestFullscreen();
  //   }
  // }
}
