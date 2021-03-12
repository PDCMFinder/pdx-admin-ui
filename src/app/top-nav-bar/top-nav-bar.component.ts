import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-top-nav-bar',
  templateUrl: './top-nav-bar.component.html',
  styleUrls: ['./top-nav-bar.component.css']
})
export class TopNavBarComponent implements OnInit {

  private setFont = 13;
  isDevEnv = !environment.production;

  constructor() { }

  ngOnInit() {
  }

  toggleSystemFont(action) {
    if (action === 'plus') {
      this.setFont += 1;
    } else if (action === 'minus') {
      this.setFont -= 1;
    } else {
      this.setFont = 13;
    }
    document.body.style.fontSize = `${this.setFont}px`;
  }

}
