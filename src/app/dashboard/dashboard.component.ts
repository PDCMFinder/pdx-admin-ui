import { Component, OnInit } from '@angular/core';
import {MappingService} from '../mapping.service';
import {GeneralService} from '../general.service';
import {ActivatedRoute, Route, Router} from '@angular/router';

declare function pdxFinderbarChart(title: string,
                                   data: any,
                                   cssID: string,
                                   categoryField: string,
                                   valueField: string,
                                   labelRotation: number): any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [``]
})
export class DashboardComponent implements OnInit {
    private loggedIn;

  constructor(private mappingService: MappingService,
              private router: Router,
              private gs: GeneralService) { }

  ngOnInit() {
      const chartData = [{
          mapping: 'JAX',
          visits: 3
      }, {
          mapping: 'IRCC',
          visits: 7
      }, {
          mapping: 'PDMR',
          visits: 5
      }, {
          mapping: 'PDXNET-HCI-BCM',
          visits: 0
      }, {
          mapping: 'PDXNET-MDANDERSON',
          visits: 2
      }, {
          mapping: 'PDXNET-MDANDERSON-PENN ',
          visits: 0
      }, {
          mapping: 'PDXNET-WUSTL',
          visits: 0
      }];

  }

}
