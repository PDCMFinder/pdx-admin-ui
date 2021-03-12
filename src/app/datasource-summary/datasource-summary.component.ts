
import { Component, OnInit } from '@angular/core';
import { MappingService } from '../mapping.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from '../general.service';
import { Mapping } from '../mapping-interface';

@Component({
    selector: 'app-datasource-summary',
    templateUrl: './datasource-summary.component.html',
    styleUrls: ['./datasource-summary.component.css']
})
export class DatasourceSummaryComponent implements OnInit {
    mapType: string;
    mappingSummary = [];
    isLoading = false;
    error: string = null;
    successfullMissingRulesGenerationMessage: string = null;
    notificationVisible = false;

    constructor(
        private mappingService: MappingService,
        private router: Router,
        private route: ActivatedRoute,
        private gs: GeneralService) { }

    ngOnInit() {
        // From the current url snapshot, get the source parameter and ...
        const mapType = this.route.snapshot.paramMap.get('mapType');
        if (mapType) {
            const urlParam = mapType.split('-')[0];
            this.mapType = this.gs.capitalize(urlParam);
            this.reloadPage();
        }
    }

    reloadPage() {
        this.mappingService.getCurationSummary(this.mapType)
            .subscribe(
                data => this.mappingSummary = data
            );
    }

    onSelect(source, mappingStatusToGet) {
        const datasourceSpecific = `${source}/${mappingStatusToGet}-1`;
        this.router.navigate([datasourceSpecific], { relativeTo: this.route });
    }

    onGenerateMissingMappingsClicked() {
        this.isLoading = true;
        this.mappingService.getMissingMappings().subscribe(data => {
            this.processGenerationMissingMappingsResponse(data);
            this.isLoading = false;
            this.error = null;
        }, error => {
            this.isLoading = false;
            this.error = error;
        });
    }

    private processGenerationMissingMappingsResponse(newMappings: Mapping[]) {
        const newMappingsByType = this.getMappingsByType(newMappings);
        this.successfullMissingRulesGenerationMessage = newMappingsByType.length + ' new ' + this.mapType + ' mappings';
        if (newMappingsByType.length > 0) {
            setTimeout(() => { this.reloadPage(); }, 1000);
        }
        this.notificationVisible = true;
    }

    getMappingsByType(newMappings: Mapping[]) {
        return newMappings.filter(x => this.mapType.toUpperCase() === x.entityType.toUpperCase());
    }

    closeNotificationAndReloadPage() {
        this.notificationVisible = false;
    }

}
