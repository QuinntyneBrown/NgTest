import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DataService, Item } from './data.service';

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;

  const mockItems: Item[] = [
    { id: 1, name: 'Item 1', description: 'First item' },
    { id: 2, name: 'Item 2', description: 'Second item' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getItems', () => {
    it('should return items via GET', () => {
      service.getItems().subscribe((items) => {
        expect(items).toEqual(mockItems);
        expect(items.length).toBe(2);
      });

      const req = httpMock.expectOne('/api/items');
      expect(req.request.method).toBe('GET');
      req.flush(mockItems);
    });
  });

  describe('getItem', () => {
    it('should return a single item by id via GET', () => {
      service.getItem(1).subscribe((item) => {
        expect(item).toEqual(mockItems[0]);
      });

      const req = httpMock.expectOne('/api/items/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockItems[0]);
    });
  });

  describe('createItem', () => {
    it('should send a POST request with item data', () => {
      const newItem = { name: 'New Item', description: 'A new item' };
      const created: Item = { id: 3, ...newItem };

      service.createItem(newItem).subscribe((item) => {
        expect(item).toEqual(created);
      });

      const req = httpMock.expectOne('/api/items');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newItem);
      req.flush(created);
    });
  });

  describe('updateItem', () => {
    it('should send a PUT request with updated data', () => {
      const update = { name: 'Updated' };
      const updated: Item = { id: 1, name: 'Updated', description: 'First item' };

      service.updateItem(1, update).subscribe((item) => {
        expect(item).toEqual(updated);
      });

      const req = httpMock.expectOne('/api/items/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(update);
      req.flush(updated);
    });
  });

  describe('deleteItem', () => {
    it('should send a DELETE request', () => {
      service.deleteItem(1).subscribe();

      const req = httpMock.expectOne('/api/items/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
