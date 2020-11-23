import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MappingService } from '../mapping.service';
import { Mapping, MappingInterface, MappingValues } from '../mapping-interface';
import { GeneralService } from '../general.service';
import { FormBuilder, FormGroup } from '@angular/forms';

declare var swal: any;

@Component({
    selector: 'app-manage',
    templateUrl: './curation-manage.component.html',
    styles: [``]
})
export class CurationManageComponent implements OnInit {

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
    showNotif = false;
    showFilter = false;
    pageSize;
    pageOptions = ['2', '3', '5', '10', '15', '20', '25'];
    userPage: number;
    mappingStatus: any;
    pageOptionSize: string;
    dataTypes = [];
    statusList = [];
    providersList = [];
    providersList2 = [];
    csvURL = '';

    submitted;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private mappingService: MappingService,
        private gs: GeneralService) {
    }

    ngOnInit() {

        this.getProvidersList();
        this.getDataTypes();
        this.getStatusList();

        // From the current url snapshot, get the source parameter and assign to the dataSource property
        this.route.queryParamMap.subscribe(
            params => {
                let page = params.get('page');
                let type = params.get('type');
                let size = params.get('size');
                let status = params.get('status');
                let source = params.get('source');
                // If no page value submitted, set page value as first page
                page = (page == null) ? '1' : page;
                this.userPage = Number(page);
                this.pageSize = size;
                this.entityType = type;
                this.mappingStatus = status;
                this.dataSource = source;
                // Set default values incase no value is specified
                page = (page == null) ? '1' : page;
                size = (size == null) ? '10' : size;
                status = (status == null) ? '' : status;
                type = (type == null) ? 'diagnosis' : type;
                source = (source == null) ? null : source;
                this.pageOptionSize = size;
                this.manageCuratedData(page, size, type, status, source);
            }
        );
        // Load Floating Action Button (FAB) Scripts
        this.gs.loadScript('../pdxfinder/dependencies/fab.js');
    }

    manageCuratedData(page, size, type, status, source) {
        const sourceFiter = (source === null) ? '' : `&mq=datasource:${source}`;
        const statusFiter = (status === '') ? '' : `&status=${status}`;
        this.csvURL = `${this.mappingService.exportUrl}?entity-type=${type}&page=${page}${statusFiter}${sourceFiter}`;
        this.columnHeaders = [];
        this.mappings = [];
        this.mappingService.getManagedTerms(type, source, page, size, status)
            .subscribe(
                data => {
                    this.data = data;
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

    exportCSV() {
        const download = (dataToDownload) => {
            const blob = new Blob([dataToDownload], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'myFile.csv';
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        };

        const objectToCsv = (originalData) => {
            const csvRows = [];
            const headers = Object.keys(originalData[0]);
            csvRows.push(headers.join(','));
            for (const row of originalData) {
                const values = headers.map(header => {
                    const escaped = ('' + row[header]).replace(/"/g, '\\"');
                    return `"${escaped}"`;
                });
                csvRows.push(values.join(','));
            }
            return csvRows.join('\n');
        };

        const data = this.mappings.map(row => ({
            dateCreated: row.dateCreated,
            entityId: row.entityId,
            entityType: row.entityType,
            mapType: row.mapType,
            mappedTermLabel: row.mappedTermLabel
        }));
        const csvData = objectToCsv(data);
        download(csvData);
    }

    getProvidersList() {
        this.mappingService.getCurationSummary(null)
            .subscribe(
                data => {
                    data.forEach((dData, index) => {
                        this.providersList.push(dData.DataSource);
                        this.providersList2.push(
                            { id: index, text: dData.DataSource, checked: false }
                        );
                    });
                }
            );
    }

    getDataTypes() {
        const entityTypes = ['diagnosis', 'treatment'];
        entityTypes.forEach((entity, index) => {
            this.dataTypes.push(
                { id: index, text: entity, checked: false }
            );
        });

    }

    getStatusList() {
        const statArray = ['validated', 'created', 'orphaned', 'unmapped'];
        statArray.forEach((status, index) => {
            this.statusList.push(
                { id: index, text: status, checked: false }
            );
        });
    }

    // whenever filter is apllied, reset page to 1
    newPageSize(pageSize) {
        localStorage.setItem('_pageSize', pageSize);
        //  Auto-Navigate away on page size change
        const newPage = (this.userPage <= 1) ? this.userPage + 1 : 1;
        this.router.navigate(
            ['/curation/manage'],
            { queryParams: { page: newPage, size: pageSize, type: this.entityType, status: this.mappingStatus, source: this.dataSource } }
        );
    }

    searchFilter(form) {
        const filter = form.value;
        this.entityType = (filter.type !== '') ? filter.type : this.entityType;
        this.mappingStatus = (filter.status !== '') ? filter.status : this.mappingStatus;
        this.dataSource = (filter.source !== '') ? filter.source : this.dataSource;
        // Capture Selected Providers Check Box
        const sources = [];
        this.providersList2.forEach((provider) => {
            if (provider.checked === true) {
                sources.push(provider.text);
            }
        });
        this.dataSource = (sources.length !== 0) ? sources.join() : this.dataSource;
        // Capture Selected Curation Status Check Box
        const status = [];
        this.statusList.forEach((dStatus) => {
            if (dStatus.checked === true) {
                status.push(dStatus.text);
            }
        });
        this.mappingStatus = (status.length !== 0) ? status.join() : this.mappingStatus;
        // Capture Data Type Status Check Box
        const types = [];
        this.dataTypes.forEach((dType) => {
            if (dType.checked === true) {
                types.push(dType.text);
            }
        });
        this.entityType = (types.length !== 0) ? types.join() : this.entityType;
        this.router.navigate(
            ['/curation/manage'],
            { queryParams: { page: null, size: this.pageSize, type: this.entityType, status: this.mappingStatus, source: this.dataSource } }
        );

    }

    toggleDisplay(compType: string) {
        if (compType === 'notif') {
            this.showNotif = (this.showNotif === true) ? false : true;
        } else if (compType === 'filter') {
            this.showFilter = (this.showFilter === true) ? false : true;
        }
    }
}
