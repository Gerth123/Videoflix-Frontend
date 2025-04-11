import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store auth credentials in localStorage', () => {
    service.setAuthCredentials('123token', '42', 'test@example.com', true);

    expect(localStorage.getItem('auth-token')).toBe('123token');
    expect(localStorage.getItem('auth-user-id')).toBe('42');
    expect(localStorage.getItem('auth-user')).toBe('test@example.com');
    expect(localStorage.getItem('remember-me')).toBe('true');
  });

  it('should remove auth credentials from localStorage', () => {
    localStorage.setItem('auth-token', 'abc');
    service.removeAuthCredentials();
    expect(localStorage.getItem('auth-token')).toBeNull();
  });

  it('should get auth token from localStorage', () => {
    localStorage.setItem('auth-token', 'abc123');
    expect(service.getAuthToken()).toBe('abc123');
  });

  it('should perform GET request with token in header', () => {
    const testData = { message: 'OK' };
    localStorage.setItem('auth-token', 'test-token');

    service.getData('test/').subscribe((data) => {
      expect(data).toEqual(testData);
    });

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/test/');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Token test-token');
    req.flush(testData);
  });

  it('should perform POST request without token', () => {
    const testData = { success: true };

    service.postDataWithoutToken('test/', { foo: 'bar' }).subscribe((res) => {
      expect(res).toEqual(testData);
    });

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/test/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ foo: 'bar' });
    req.flush(testData);
  });

  it('should check if email exists in response', async () => {
    const mockProfiles = [
      { email: 'test@example.com' },
      { email: 'user@videoflix.com' },
    ];

    const promise = service.checkEmailExists('test@example.com');
    const req = httpMock.expectOne('http://127.0.0.1:8000/api/profiles/');
    req.flush(mockProfiles);

    const result = await promise;
    expect(result).toBeTrue();
  });

  it('should perform POST request with FormData and token', () => {
    const formData = new FormData();
    formData.append('title', 'Test');

    localStorage.setItem('auth-token', 'token123');

    service.postData('upload/', formData).subscribe((res) => {
      expect(res).toEqual({ success: true });
    });

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/upload/');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Token token123');
    req.flush({ success: true });
  });

  it('should perform POST request with JSON and token', () => {
    const jsonData = { name: 'Angular' };
    localStorage.setItem('auth-token', 'json-token');

    service.postDataWJSON('json-endpoint/', jsonData).subscribe((res) => {
      expect(res).toEqual({ done: true });
    });

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/json-endpoint/');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Token json-token');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.body).toBe(JSON.stringify(jsonData));
    req.flush({ done: true });
  });

  it('should perform PATCH request with JSON and token', () => {
    const patchData = { description: 'Update' };
    localStorage.setItem('auth-token', 'patch-token');

    service.patchDataWoFiles('update-json/', patchData).subscribe((res) => {
      expect(res).toEqual({ updated: true });
    });

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/update-json/');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.headers.get('Authorization')).toBe('Token patch-token');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.body).toBe(JSON.stringify(patchData));
    req.flush({ updated: true });
  });

  it('should perform PATCH request with FormData and token', () => {
    const formData = new FormData();
    formData.append('key', 'value');

    localStorage.setItem('auth-token', 'patch-token');

    service.patchData('update-form/', formData).subscribe((res) => {
      expect(res).toEqual({ patched: true });
    });

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/update-form/');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.headers.get('Authorization')).toBe('Token patch-token');
    req.flush({ patched: true });
  });

  it('should perform DELETE request with token', () => {
    localStorage.setItem('auth-token', 'delete-token');

    service.deleteData('remove/').subscribe((res) => {
      expect(res).toEqual({ deleted: true });
    });

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/remove/');
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe('Token delete-token');
    req.flush({ deleted: true });
  });

  it('should get genres using getGenres()', () => {
    const genresMock = ['Action', 'Drama', 'Comedy'];
    localStorage.setItem('auth-token', 'genre-token');

    service.getGenres().subscribe((genres) => {
      expect(genres).toEqual(genresMock);
    });

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/genres/');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Token genre-token');
    req.flush(genresMock);
  });
});
