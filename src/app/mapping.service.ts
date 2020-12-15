import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Mapping, MappingInterface } from './mapping-interface';
import { Observable, Subject, throwError } from 'rxjs/index';
import { catchError } from 'rxjs/internal/operators';
import { SummaryInterface } from './summary-interface';

@Injectable({
    providedIn: 'root'
})
export class MappingService {

    private devServer = 'http://ves-ebi-bc.ebi.ac.uk:8081';
    private readonly SERVER_URL = 'http://localhost:8081'; // this.devServer; //
    private readonly BASE_URL = this.SERVER_URL + '/api/mappings';

    private readonly SUMMARY_URL = this.BASE_URL + '/summary';
    private readonly MAPPINGS_URL = this.BASE_URL;
    private readonly MISSING_MAPPINGS_URL = this.BASE_URL + '/getmissingmappings';
    public readonly EXPORT_URL = this.BASE_URL + '/export';
    private readonly UPLOAD_URL = this.BASE_URL + '/uploads';

    private dataSubject = new Subject<any>();
    private stringDataBusSubject = new Subject<any>();
    public eventDataSubject = new Subject<any>();
    public errorReport = null;

    constructor(private http: HttpClient) { }

    public getDataSubject() {
        return this.dataSubject;
    }

    public getStringDataBusSubject() {
        return this.stringDataBusSubject;
    }

    getCurationSummary(maptype: string): Observable<SummaryInterface[]> {
        const curationType = (maptype == null) ? '' : `?entity-type=${maptype}`;
        const url = `${this.SUMMARY_URL}${curationType}`;

        return this.http.get<SummaryInterface[]>(url);
    }

    getTerms(status: string, entityType: string, dataSource: string, page: string, size: string): Observable<MappingInterface> {
        const url = `${this.MAPPINGS_URL}?mq=datasource:${dataSource}&entity-type=${entityType}&status=${status}&page=${page}&size=${size}`;

        return this.http.get<MappingInterface>(url);
    }

    getUnmappedTermsByType(entityType: string): Observable<MappingInterface> {
        const url = `${this.MAPPINGS_URL}?entity-type=${entityType}&status=unmapped`;
        console.log('getUnmappedTermsByType', url);

        return this.http.get<MappingInterface>(url);
    }


    getTermsByStatus(status: string): Observable<MappingInterface> {
        const url = `${this.MAPPINGS_URL}?status=${status}`;
        return this.http.get<MappingInterface>(url);
    }

    getManagedTerms(entityType: string, dataSource: string, page: string, size: string, status: string): Observable<MappingInterface> {
        let dsQuery = '';
        if (dataSource != null) {
            dsQuery = `&mq=datasource:${dataSource}`;
        }
        const url = `${this.MAPPINGS_URL}?entity-type=${entityType}&page=${page}&size=${size}&status=${status}${dsQuery}`;
        return this.http.get<MappingInterface>(url);
    }

    getMappingEntityById(entityId: string): Observable<Mapping> {
        const url = `${this.MAPPINGS_URL}/${entityId}`;
        return this.http.get<Mapping>(url);
    }

    getOLS(entityId: string): Observable<any> {
        const url = `${this.MAPPINGS_URL}/ontologies?type=${entityId}`;
        return this.http.get<any>(url);
    }

    componentsDataBus(data): void {
        this.dataSubject.next(data);
    }

    stringDataBus(data): void {
        this.stringDataBusSubject.next(data);
    }

    eventDataBus(data): void {
        this.eventDataSubject.next(data);
    }

    updateEntity(mappings) {
        return this.http.put<any>(this.MAPPINGS_URL, mappings)
            .pipe(catchError(this.errorHandler));
    }

    errorHandler2(error: HttpErrorResponse) {
        this.errorReport = error;
        return throwError(error);
    }

    errorHandler(error) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(error);
    }

    pushFileToStorage(file: File, entityType: string): Observable<HttpEvent<{}>> {
        const formdata: FormData = new FormData();
        formdata.append('uploads', file);
        const url = `${this.UPLOAD_URL}?entity-type=${entityType}`;

        return this.http.post<any>(url, formdata)
            .pipe(
                catchError(this.errorHandler)
            );
    }

    connectToDataFlow() {
        return fetch('http://localhost:8081/api/mapping/diagnosis?ds=JAX')
            .then((res) => res.json())
            .then((data) => data)
            .catch(error => console.log(error));
    }

    getMissingMappings() {
        return this.http.get<Mapping[]>(this.MISSING_MAPPINGS_URL);
    }

}







