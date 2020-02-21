import { TestBed } from '@angular/core/testing';

import { DynamicOverlayService } from './dynamic-overlay.service';

describe('DynamicOverlayService', () => {
  let service: DynamicOverlayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicOverlayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
