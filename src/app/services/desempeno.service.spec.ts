import { TestBed } from '@angular/core/testing';

import { DesempenoService } from './desempeno.service';

describe('DesempenoService', () => {
  let service: DesempenoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesempenoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
