import { TestBed } from '@angular/core/testing';

import { SubscriptionManagerService } from './subscription-manager.service';

describe('SubscriptionManagerService', () => {
  let service: SubscriptionManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscriptionManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
