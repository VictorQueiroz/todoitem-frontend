import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionManagerService {
  readonly #subscriptions = new Set<Subscription>();
  constructor() {}
  public add(sub: Subscription) {
    this.#subscriptions.add(sub);
  }
  public clear() {
    for (const s of this.#subscriptions) {
      s.unsubscribe();
      this.#subscriptions.delete(s);
    }
  }
}
