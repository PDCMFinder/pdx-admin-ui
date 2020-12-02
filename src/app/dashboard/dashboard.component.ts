import { Component, OnInit } from '@angular/core';

declare function pdxFinderbarChart(
    title: string,
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
    constructor() { }

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
