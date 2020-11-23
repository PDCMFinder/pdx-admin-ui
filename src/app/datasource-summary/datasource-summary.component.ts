
import { Component, OnInit } from '@angular/core';
import { MappingService } from '../mapping.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from '../general.service';

declare function pdxFinderbarChart(
    title: string,
    data: any,
    cssID: string,
    categoryField: string,
    valueField: string,
    labelRotation: number): any;

@Component({
    selector: 'app-datasource-summary',
    templateUrl: './datasource-summary.component.html',
    styles: [``]
})
export class DatasourceSummaryComponent implements OnInit {
    mapType;
    mappingSummary = [];

    constructor(
        private mappingService: MappingService,
        private router: Router,
        private route: ActivatedRoute,
        private gs: GeneralService) { }

    ngOnInit() {
        // From the current url snapshot, get the source parameter and ...
        const urlParam = this.route.snapshot.paramMap.get('mapType').split('-')[0];
        this.mapType = this.gs.capitalize(urlParam);
        // Connect to the Service using Reactive Observables
        this.mappingService.getCurationSummary(this.mapType)
            .subscribe(
                data => this.mappingSummary = data
            );
    }

    onSelect(source, mappingStatusToGet) {
        const datasourceSpecific = `${source}/${mappingStatusToGet}-1`;
        this.router.navigate([datasourceSpecific], { relativeTo: this.route });
    }

}
