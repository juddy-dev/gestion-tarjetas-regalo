import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Card } from '../../models/card.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private path = 'gift-cards';
  constructor(private http: HttpClient) { }

  getAll(): Observable<Card[]> {
    return this.http.get<Card[]>(`${environment.apiUrl}/${this.path}`);
  }

  getById(id: string): Observable<Card> {
    return this.http.get<Card>(`${environment.apiUrl}/${this.path}/${id}`);
  }

  save(item: Card): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/${this.path}`, item);
  }

  createMultiple(items: Card[]): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/${this.path}/multiples`, items);
  }
}
