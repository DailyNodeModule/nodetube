import { TestBed } from '@angular/core/testing';

import { APIClientService } from './apiclient.service';

describe('APIClientService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: APIClientService = TestBed.get(APIClientService);
    expect(service).toBeTruthy();
  });
});
