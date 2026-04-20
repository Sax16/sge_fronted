import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from '../../../../environments/environment';
import {
    School,
    SchoolDto
} from "../models/school.model"


@Injectable({
    providedIn: "root",
})
export class SchoolService {
    private readonly apiUrl = `${environment.apiBaseUrl}/school` 

    constructor(private http: HttpClient) {}


    getSchool(id: number): Observable<School> {
        return this.http.get<School>(`${this.apiUrl}/${id}`);
    }

    createSchool(newSchool: SchoolDto): Observable<School> {
        return this.http.post<School>(this.apiUrl, newSchool);
    }

    updateSchool(id: number, school: SchoolDto): Observable<School> {
        return this.http.put<School>(`${this.apiUrl}/${id}`, school);
    }
}