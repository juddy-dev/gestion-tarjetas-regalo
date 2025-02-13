import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DataService } from './data.service';
import { Card } from '../../models/card.model';
import { environment } from '../../../environments/environment';

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;
  const path = 'gift-cards';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService],
    });

    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería llamar a `getAll()` y devolver un array de tarjetas', () => {
    const mockCards: Card[] = [
      { id: '1', codeCard: '123456', initialValue: 100, initialDate: '', transactions: [] },
      { id: '2', codeCard: '789012', initialValue: 200, initialDate: '', transactions: [] }
    ];

    service.getAll().subscribe(cards => {
      expect(cards.length).toBe(2);
      expect(cards).toEqual(mockCards);
    });

    const req = httpMock.expectOne(`${apiUrl}/${path}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCards);
  });

  it('debería llamar a `getById(id)` y devolver una tarjeta', () => {
    const mockCard: Card = { id: '1', codeCard: '123456', initialValue: 100, initialDate: '', transactions: [] };

    service.getById('1').subscribe(card => {
      expect(card).toEqual(mockCard);
    });

    const req = httpMock.expectOne(`${apiUrl}/${path}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCard);
  });

  it('debería llamar a `create(item)` y enviar una solicitud POST', () => {
    const newCard: Card = { id: '3', codeCard: '345678', initialValue: 300, initialDate: '', transactions: [] };

    service.save(newCard).subscribe(response => {
      expect(response).toEqual({ message: 'Created' });
    });

    const req = httpMock.expectOne(`${apiUrl}/${path}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newCard);
    req.flush({ message: 'Created' });
  });

  it('debería llamar a `createMultiple(items)` y enviar una solicitud POST con varias tarjetas', () => {
    const newCards: Card[] = [
      { id: '4', codeCard: '567890', initialValue: 400, initialDate: '', transactions: [] },
      { id: '5', codeCard: '901234', initialValue: 500, initialDate: '', transactions: [] }
    ];

    service.createMultiple(newCards).subscribe(response => {
      expect(response).toEqual({ message: 'Multiple Cards Created' });
    });

    const req = httpMock.expectOne(`${apiUrl}/${path}/multiples`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newCards);
    req.flush({ message: 'Multiple Cards Created' });
  });
});
