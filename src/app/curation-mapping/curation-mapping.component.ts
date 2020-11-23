import { Component, OnInit } from '@angular/core';
import { MappingService } from '../mapping.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-curation-mapping',
    templateUrl: './curation-mapping.component.html',
    styles: [``]
})

export class CurationMappingComponent implements OnInit {

    unmappedDiagnosisCnt: number;
    unmappedTreatmentCnt: number;
    orphanedTerms: number;

    constructor(
        private mappingService: MappingService,
        private router: Router,
        private route: ActivatedRoute) { }

    ngOnInit() {
        /* tslint:disable:no-string-literal */
        this.mappingService.getUnmappedTermsByType('diagnosis')
            .subscribe(
                data => this.unmappedDiagnosisCnt = data['totalElements']
            );
        this.mappingService.getUnmappedTermsByType('treatment')
            .subscribe(
                data => this.unmappedTreatmentCnt = data['totalElements']
            );
        this.mappingService.getTermsByStatus('orphaned')
            .subscribe(
                data => this.orphanedTerms = data['totalElements']
            );
        /* tslint:enable:no-string-literal */
    }

    onClick(mapType) {
        this.router.navigate([mapType], { relativeTo: this.route });
    }
}
