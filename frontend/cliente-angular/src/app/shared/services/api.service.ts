import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApiService {

  constructor(private http: HttpClient) { }

  getPartidos(){
    this.http.get('http://localhost:3000/api/partidos').subscribe(data => {
      console.log(data);
    });
  }

}
