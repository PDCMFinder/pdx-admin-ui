import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MappingInterface} from "./mapping-interface";
import {Observable} from "rxjs/index";

@Injectable({
  providedIn: 'root'
})
export class MappingService {

    private _url = "/assets/data/diagnosis2.json";

  constructor(private http: HttpClient) { }

    //Retrieve mapping data
    getMappings(): Observable<MappingInterface[]>{

        return this.http.get<MappingInterface[]>(this._url);

    }


}
