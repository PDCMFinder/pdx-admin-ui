import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MappingService } from '../mapping.service';
import { Mapping } from '../mapping-interface';
import { GeneralService } from '../general.service';

declare var swal: any;
declare var $: any;

@Component({
    selector: 'app-datasource-specific',
    templateUrl: './datasource-specific.component.html',
    styles: [``]
})
export class DatasourceSpecificComponent implements OnInit {
    data;
    mappings = [];
    dataSource;
    entityType;
    entityTypeUrl;
    dataExists = false;
    dataLabels;
    columnHeaders = [];
    report = null;
    pageRange: number[];

    // Selected Fields
    selectedEntity;
    selectedRow;
    selectedEntityId: any;
    selectedDetails: any;
    selectedEntityType: string;
    selectedURL: string;
    selectedSrc: any;
    olsTermSelected = false;
    showNotif = false;
    pageSize;
    pageOptions = ['2', '3', '5', '10', '15', '20', '25'];
    userPage: number;
    options: string[] = ['One', 'Two', 'Three'];
    olsUrl = 'https://www.ebi.ac.uk/ols/ontologies/ncit/terms?iri=';
    autoSuggestTextBox: string;
    diagnosisOntology = [];
    treatmentOntology = [];
    mappingStatusToGet;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private mappingService: MappingService,
        private gs: GeneralService) {

        // This will allow navigation to respond param changes on thesame route path
        // This.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

    ngOnInit() {
        // From the current url snapshot, get the source parameter and assign to the dataSource property
        this.dataSource = this.route.snapshot.paramMap.get('source');
        this.entityTypeUrl = this.route.snapshot.paramMap.get('mapType');
        this.entityType = this.entityTypeUrl.split('-')[0];
        let page = this.route.snapshot.paramMap.get('page');
        const size = localStorage.getItem('_pageSize');

        this.route.paramMap.subscribe(
            params => {
                this.mappingStatusToGet = params.get('page').split('-')[0];
                page = params.get('page').split('-')[1];
                // If no page value submitted, set page value as first page
                page = (page == null) ? '1' : page;
                this.userPage = Number(page);
                this.getUnmappedTerms(page);
            }
        );
        // Get Data from Child Component
        this.mappingService.dataSubject.subscribe(
            data => {
                for (const mapping of this.mappings) {
                    if (mapping.entityId === this.selectedEntityId) {
                        mapping.mappedTermLabel = data.mappedTermLabel.toUpperCase();
                        mapping.mapType = data.mapType.toUpperCase();
                        mapping.justification = data.justification.toUpperCase();
                        mapping.mappedTermUrl = data.mappedTermUrl;
                    }
                }
            }
        );

        // Get String Data from Child Component :
        // This data is sent to the parent on load, so it allows parent data Row to be selected when deeplink url is visited
        this.mappingService.stringDataBusSubject.subscribe(
            data => this.getClickedRow(data)
        );
        this.mappingService.eventDataSubject.subscribe(
            data => {
                if (data === 'closeParentDetails') {
                    // this.showNotif = false;
                }
            }
        );
        this.getOLSTerms(this.entityType.toLowerCase());
    }

    getOLSTerms(entityType) {
        this.mappingService.getOLS(entityType)
            .subscribe(
                data => {
                    if (entityType === 'diagnosis') {
                        this.diagnosisOntology = data;
                    } else {
                        this.treatmentOntology = data;
                    }
                    // transfer data out of observable
                    // localStorage.setItem('thisMapping', JSON.stringify(this.mappings));
                }
            );

    }

    getUnmappedTerms(page) {
        this.pageSize = localStorage.getItem('_pageSize') == null ? 5 : localStorage.getItem('_pageSize');
        this.toggleNotification(false);
        this.columnHeaders = [];
        this.mappings = [];
        this.mappingService.getTerms(this.mappingStatusToGet, this.entityType, this.dataSource, page, this.pageSize)
            .subscribe(
                data => {
                    this.data = data;
                    // This receives the mappings node of the json in required format
                    const mappings = this.data.mappings;
                    // Build Column Headers If data is not empty
                    if (mappings.length > 0) {
                        // Transfer mappingLabel for this entityType to the template
                        this.dataLabels = mappings[0].mappingLabels;
                        // Convert mapping Labels from CamelCase to Normal Case for Column Headers in Template
                        this.dataLabels.forEach((mappingLabel) => {
                            this.columnHeaders.push(mappingLabel.replace(/([a-z])([A-Z])/g, '$1 $2'));
                        });
                        this.dataExists = true;
                    }
                    this.pageRange = this.gs.getNumbersInRange(this.data.beginIndex, this.data.endIndex);
                    let count = 0;
                    for (const i of mappings) {
                        if (mappings[count].mappingValues.DataSource.toUpperCase() === this.dataSource.toUpperCase()) {
                            this.mappings.push(mappings[count]);
                        }
                        count++;
                    }
                }
            );


    }

    ontologySuggest(entityType) {
        const presentOntology = (entityType === 'diagnosis') ? this.diagnosisOntology : this.treatmentOntology;
        const dataFromMappings = this.mappings;
        const selectedId = this.selectedEntityId;
        const componentSelector = 'autocomplete';
        const dataArray = presentOntology.map(x => ({ value: x.label, data: x }));
        // Initialize autocomplete:
        $(`.${componentSelector}`).autocomplete({
            lookup: dataArray,
            lookupFilter(suggestion, originalQuery, queryLowerCase) {
                const re = new RegExp('\\b' + $.Autocomplete.utils.escapeRegExChars(queryLowerCase), 'gi');
                return re.test(suggestion.value);
            },
            onSelect: (suggestion) => {
                for (const mapping of this.mappings) {
                    if (mapping.entityId === this.selectedEntityId) {
                        mapping.mappedTermLabel = suggestion.data.label;
                        mapping.mappedTermUrl = suggestion.data.url;
                        mapping.mapType = 'Inferred';
                        mapping.justification = 'Manual Curation';
                        this.selectedURL = suggestion.data.url;
                        this.olsTermSelected = true;
                    }
                }
            }
        });
    }

    getClickedRow(mapping: Mapping) {
        this.selectedEntity = mapping;
        this.selectedEntityId = mapping.entityId;
        this.selectedRow = mapping.entityId;
        /* tslint:disable:no-string-literal */
        this.selectedDetails = (mapping.entityType === 'diagnosis') ?
            mapping.mappingValues.SampleDiagnosis : mapping.mappingValues['TreatmentName'];
        /* tslint:enable:no-string-literal */
        this.selectedSrc = mapping.mappingValues.DataSource;
        this.selectedEntityType = mapping.entityType;
        this.autoSuggestTextBox = (mapping.mappedTermLabel === '-') ? '' : mapping.mappedTermLabel;
        this.selectedURL = mapping.mappedTermUrl;
        this.olsTermSelected = false;
        this.toggleNotification(true);
    }

    toggleNotification(value: boolean) {
        this.showNotif = value;
    }

    toggleReport(value: string) {
        this.report = null;
        if (value === 'success') {
            setTimeout(() => { this.refreshPage(); }, 1000);
        }
    }

    newPageSize(pageSize) {
        localStorage.setItem('_pageSize', pageSize);
        //  Auto-Navigate away on page size change
        const newPage = (this.userPage <= 1) ? this.userPage + 1 : 1;
        this.router.navigate([`curation/${this.entityTypeUrl}/${this.dataSource}/${this.mappingStatusToGet}-${newPage}`]);

    }

    refreshPage() {
        //  Auto-Navigate away on page size change
        const newPage = (this.userPage <= 1) ? this.userPage + 1 : 1;
        this.router.navigate([`curation/${this.entityTypeUrl}/${this.dataSource}/${newPage}`]);
    }

    updateSkippedTerm() {
        const skippedTerms = [];
        let skippedTerm = {};
        skippedTerm = Object.assign(skippedTerm, this.selectedEntity);
        // Update the selected entity before submission
        /* tslint:disable:no-string-literal */
        skippedTerm['suggestedMappings'] = [];
        skippedTerm['status'] = 'orphaned';
        /* tslint:enable:no-string-literal */
        skippedTerms.push(skippedTerm);
        this.sendDataForUpdate(skippedTerms);
    }

    updateMappingEntity() {
        const validatedTerms = [];
        this.mappings.forEach((mapping) => {
            mapping.suggestedMappings = [];
            mapping.status = 'created';
            /* tslint:disable:no-string-literal */
            if (mapping['mappedTermLabel'] !== '-' && mapping['mappedTermUrl'] != null) {
                validatedTerms.push(mapping);
            }
            /* tslint:enable:no-string-literal */
        });
        this.sendDataForUpdate(validatedTerms);
    }

    sendDataForUpdate(validatedTerms) {
        swal({
            title: 'Are you sure?',
            text: 'You may not be able to reverse this operation',
            imageUrl: 'assets/icons/question.jpg',
            showCancelButton: true,
            confirmButtonColor: '#03369D',
            confirmButtonText: 'YES',
            cancelButtonText: 'NO',
            closeOnConfirm: false,
            closeOnCancel: false
        },
            (isConfirm) => {
                if (isConfirm) {
                    this.mappingService.updateEntity(validatedTerms)
                        .subscribe(
                            response => {
                                this.report = 'success';
                                this.showNotif = false;
                                swal('Submitted!', 'Your curation has been submitted', 'success');
                                // console.log(response)
                            },
                            error => {
                                this.report = 'failed';
                                swal('Failed', ' The curation is invalid :)', 'error');
                                // console.log(error.ok, error)
                            }
                        );
                } else {
                    swal('Cancelled', 'The request was cancelled :)', 'error');
                }
            });
    }
}
