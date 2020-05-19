import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ApiService{

    private SERVER_URL = "http://localhost:2193";
    constructor(private httpClient: HttpClient) { }

    public fetchDataCount(){
        return this.httpClient.get(`${this.SERVER_URL}/count`);
    }

    public fetchLast2Weeks(){
        return this.httpClient.get(`${this.SERVER_URL}/last2Weeks`);
    }

}