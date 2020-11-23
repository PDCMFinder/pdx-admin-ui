import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MappingService } from '../mapping.service';
import { Mapping } from '../mapping-interface';
import { GeneralService } from '../general.service';

declare var swal: any;

@Component({
    selector: 'app-curation-orphan',
    templateUrl: './curation-orphan.component.html',
    styles: [``]
})
export class CurationOrphanComponent implements OnInit {

    data;
    mappings = [];

    dataSource;
    entityType;

    dataExists = false;
    dataLabels;
    columnHeaders = [];

    selectedRow;
    selectedEntity: any;
    report = null;
    pageRange: number[];

    // Selected Fields
    selectedDetails: any;
    selectedEntityId: any;
    selectedEntityType: string;
    selectedSrc: any;

    showNotif = false;
    showFilter = false;

    pageSize;
    pageOptions = ['2', '3', '5', '10', '15', '20', '25'];
    userPage: number;

    mappingStatus: any;
    pageOptionSize: string;

    dataTypes = [];

    submitted;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private mappingService: MappingService,
        private gs: GeneralService) {
    }

    ngOnInit() {
        this.getDataTypes();
        // From the current url snapshot, get the source parameter and assign to the dataSource property
        this.route.paramMap.subscribe(
            params => {
                let page = params.get('page');
                let type = localStorage.getItem('_entityType');
                let size = localStorage.getItem('_pageSize');
                const status = 'orphaned';
                const source = null;
                this.pageSize = size;
                this.mappingStatus = status;
                this.dataSource = source;
                this.userPage = (page == null) ? 0 : Number(page);
                // If no page value submitted, set page value as §first page
                page = (page == null) ? '1' : page;
                size = (size == null) ? '5' : size;
                type = (type == null) ? 'diagnosis' : type;
                this.pageOptionSize = size;
                this.entityType = type;
                this.manageOrphanedData(page, size, type, status, source);
            }
        );
        // Return Selected Data from DatasourceSpecificSuggestionsComponent Child Component this parent component
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
        // Get String Data from Child Component : Allows parent data Row to auto-selected when deeplinked suggestion url is visited
        this.mappingService.stringDataBusSubject.subscribe(
            data => this.getClickedRow(data)
        );
        // Load Fab Scripts
        this.gs.loadScript('../pdxfinder/dependencies/fab.js');
    }

    manageOrphanedData(page, size, type, status, source) {
        this.columnHeaders = [];
        this.mappings = [];
        this.mappingService.getManagedTerms(type, source, page, size, status)
            .subscribe(
                data => {
                    this.data = data;
                    console.log(this.data.totaPages);
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
                    this.mappings = mappings;
                }
            );
    }

    getDataTypes() {
        const entityTypes = ['diagnosis', 'treatment'];
        entityTypes.forEach((entity, index) => {
            this.dataTypes.push({ id: index, text: entity, checked: false });
        });

    }

    // whenever filter is apllied, reset page to 1
    newPageSize(pageSize) {
        localStorage.setItem('_pageSize', pageSize);
        //  Auto-Navigate away on page size change
        const newPage = (this.userPage <= 1) ? this.userPage + 1 : 1;
        this.router.navigate([`curation/orphan/${newPage}`]);
    }

    searchFilter(form) {
        const filter = form.value;
        this.entityType = (filter.type !== '') ? filter.type : this.entityType;
        this.mappingStatus = (filter.status !== '') ? filter.status : this.mappingStatus;
        this.dataSource = (filter.source !== '') ? filter.source : this.dataSource;
        // Capture Data Type Status Check Box
        const types = [];
        this.dataTypes.forEach((dType) => {
            if (dType.checked === true) {
                types.push(dType.text);
            }
        });
        this.entityType = (types.length !== 0) ? types.join() : this.entityType;
        localStorage.setItem('_entityType', this.entityType);
        this.refreshPage();
    }

    refreshPage() {
        //  Auto-Navigate away on page size change
        const newPage = (this.userPage === 0) ? '1' : '';
        this.router.navigate([`curation/orphan/${newPage}`]);
    }

    toggleDisplay(compType: string) {
        if (compType === 'notif') {
            this.showNotif = (this.showNotif === true) ? false : true;
        } else if (compType === 'filter') {
            this.showFilter = (this.showFilter === true) ? false : true;
        }
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
        this.toggleNotification(true);
    }

    toggleNotification(value: boolean) {
        this.showNotif = value;
    }

    toggleReport(value: string) {
        this.report = null;
        if (value === 'success') {
            setTimeout(() => {
                this.refreshPage();
            }, 1000);
        }
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

    // swalAlert (Beautiful replacement for Javascfript pop up) prompting user for final execution
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
