import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MappingService } from '../mapping.service';
import { Mapping } from '../mapping-interface';

@Component({
    selector: 'app-datasource-specific-suggestions',
    templateUrl: './datasource-specific-suggestions.component.html',
    styles: [``]
})
export class DatasourceSpecificSuggestionsComponent implements OnInit {
    entityId;
    selectedEntity = {};
    dataLabels;
    columnHeaders = [];
    data = {
        DataSource: '',
        SampleDiagnosis: '',
        TumorType: '',
        OriginTissue: ''
    };
    clickedSuggestionId: number;
    showClickedDetails = false;
    selectedSuggestion: Mapping;
    clickedDetails;
    olsUrl = 'https://www.ebi.ac.uk/ols/ontologies/ncit/terms?iri=';
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private mappingService: MappingService) { }

    ngOnInit() {
        // From the current url snapshot, get the source parameter and assign to the dataSource property
        this.route.params.subscribe(
            params => {
                this.toggleDetails(false);
                /* tslint:disable:no-string-literal */
                this.entityId = params['id'];
                /* tslint:enable:no-string-literal */
                // Retrieve the details of Mapping node with this entityId:
                this.mappingService.getMappingEntityById(this.entityId)
                    .subscribe(
                        data => {
                            this.selectedEntity = data;
                            this.data = data.mappingValues;
                            // Transfer mappingLabel for this entityType to the template
                            this.dataLabels = data.mappingLabels;
                            // Convert mapping Labels from CamelCase to Normal Case for Column Headers in Template
                            this.columnHeaders = [];
                            this.dataLabels.forEach((mappingLabel) => {
                                this.columnHeaders.push(mappingLabel.replace(/([a-z])([A-Z])/g, '$1 $2'));
                            });
                            this.sendDataToParent(this.selectedEntity);
                        }
                    );
            }
        );
    }

    sendDataToParent(data) {
        this.mappingService.stringDataBus(data);
    }

    onSuggestionSubmit(suggestion) {
        this.mappingService.componentsDataBus(suggestion);
    }

    getClickedSuggestion(suggestion: Mapping) {
        this.clickedSuggestionId = suggestion.entityId;
        this.selectedSuggestion = suggestion;
        /* tslint:disable:no-string-literal */
        this.clickedDetails = (suggestion.entityType === 'diagnosis') ?
            suggestion.mappingValues.SampleDiagnosis : suggestion.mappingValues['TreatmentName'];
        /* tslint:enable:no-string-literal */
        this.toggleDetails(true);
        this.mappingService.eventDataBus('closeParentDetails');

    }

    toggleDetails(value: boolean) {
        this.showClickedDetails = value;
    }


}
