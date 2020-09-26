
import { Component, OnInit } from '@angular/core';
import {MappingService} from "../mapping.service";
import { from} from "rxjs/index";
import {groupBy, mergeMap, toArray} from "rxjs/internal/operators";
import {ActivatedRoute, Router} from '@angular/router';
import {GeneralService} from "../general.service";

declare function pdxFinderbarChart(title: String,
                                   data: any,
                                   cssID: String,
                                   categoryField: String,
                                   valueField: String,
                                   labelRotation: number): any;

@Component({
    selector: 'app-datasource-summary',
    templateUrl: './datasource-summary.component.html',
    styles: [``]
})
export class DatasourceSummaryComponent implements OnInit {
    private mapType;
    private mappingSummary = [];

    constructor(private _mappingService: MappingService,
                private router: Router,
                private route: ActivatedRoute,
                private gs: GeneralService) { }

    ngOnInit() {
        // From the current url snapshot, get the source parameter and ...
        let urlParam = this.route.snapshot.paramMap.get('mapType').split('-')[0];
        this.mapType = this.gs.capitalize(urlParam);
        // Connect to the Service using Reactive Observables
        this._mappingService.getCurationSummary(this.mapType)
            .subscribe(
                data => this.mappingSummary = data
            );
    }

    onSelect(source, mappingStatusToGet){
        var datasourceSpecific = `${source}/${mappingStatusToGet}-1`
        this.router.navigate([datasourceSpecific],{relativeTo: this.route})
    }

}