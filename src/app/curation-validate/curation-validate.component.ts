import { Component, OnInit } from '@angular/core';
import { MappingService } from '../mapping.service';

@Component({
    selector: 'app-curation-validate',
    templateUrl: './curation-validate.component.html',
    styles: [``]
})
export class CurationValidateComponent implements OnInit {
    data;
    mappings = [];
    report = null;
    dataTypes = [];
    selectedFiles: FileList;
    currentFileUpload: File;
    uploadedFilename: string;
    errorReport: string;
    parsedCsvHead = [];
    parsedCsvBody = [];
    showCSV = false;

    constructor(private mappingService: MappingService) {
    }

    ngOnInit() {
        this.getDataTypes();
    }

    getDataTypes() {
        const entityTypes = ['diagnosis', 'treatment'];
        entityTypes.forEach((entity, index) => {
            this.dataTypes.push(
                { id: index, text: entity, checked: false }
            );
        });
    }

    selectFile(event) {
        const userFile = event.target.files.item(0);
        if (userFile.type === 'text/csv') {
            this.displayUploadedCSV(event);
            this.selectedFiles = event.target.files;
            this.currentFileUpload = this.selectedFiles.item(0);
            this.uploadedFilename = this.currentFileUpload.name;
            this.report = 'waiting';

        } else {
            this.report = 'failed';
            this.selectedFiles = null;
            this.errorReport = `${userFile.name} is an Invalid file type, pls upload CSV`;
            this.showCSV = false;
        }
    }

    displayUploadedCSV(event) {
        this.parsedCsvHead = [];
        this.parsedCsvBody = [];
        const reader = new FileReader();
        reader.readAsText(event.srcElement.files[0]);
        reader.onload = () => {
            const lines = (reader.result as string).split('\n');
            lines.forEach((element, index) => {
                const cols: string[] = element.replace(/['"]+/g, '').split(',');
                if (index === 0) {
                    this.parsedCsvHead = cols;
                } else {
                    this.parsedCsvBody.push(cols);
                }
            });
        };
        this.showCSV = true;
    }

    upload() {
        this.mappingService.pushFileToStorage(this.currentFileUpload, 'diagnosis').subscribe(responseEntity => {
            console.log('File is completely uploaded!');
            console.log(responseEntity);
            this.report = 'success';

        },
            failedResponse => {
                this.report = 'failed';
                this.errorReport = `${failedResponse.error}`;
                console.log('File was not completely uploaded!');
                console.log(failedResponse);
            }
        );
        this.selectedFiles = null;
    }

    toggleReport(success: string) {
        this.report = null;
    }
}
