import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from '../environments/variables';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  urlpath: string = `${url}/usuarios`;

  addQuickUser(newUserData: any) {
    let updateUrl = `${this.urlpath}/pre-registro`;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post<any>(updateUrl, newUserData, { headers: headers });
  }

  login(user: any) {
    return firstValueFrom(this.httpClient.post(`${url}/login`, user, { responseType: 'text' }));
  }

}
