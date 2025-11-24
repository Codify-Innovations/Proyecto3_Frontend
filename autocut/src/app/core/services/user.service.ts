import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + '/users';

  getPublicUsers() {
    return this.http.get(`${this.baseUrl}/explore-users`);
  }

  getPublicProfile(username: string) {
    return this.http.get(`${this.baseUrl}/explore-users/${username}`);
  }

  getMyProfile(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/profile`);
  }

  updateMyProfile(data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/profile`, data);
  }

  updatePrivacySetting(visibility: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/privacy`, { visibility });
  }
}

