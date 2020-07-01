import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import { AuthenticationService } from './core/services/authenticate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Welcome ! UTC2 Social Network';
  currentUtc2User: any;

  constructor(private router: Router, private authenticationService: AuthenticationService) {
    this.authenticationService.currentUtc2User.subscribe(x => this.currentUtc2User = x);
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
