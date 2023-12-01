import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(public http: HttpClient) {}

  get(): Observable<any> {
    return this.http.get<any>('https://rickandmortyapi.com/api/location').pipe(
      map((res) => {
        return res.results;
      })
    );
  }
}
