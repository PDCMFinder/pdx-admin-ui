import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-pdx-finder',
  templateUrl: './app.component.html',
  styles: [``]
})
export class AppComponent implements OnInit {

  isFullPage: boolean;

  constructor(private router: Router) { }

  ngOnInit() {

    // Switch between desired layout when loggedin and when not logged in
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        if (e.url.includes('login')) {
          this.isFullPage = true;
        }
      }
    });

  }

}
