import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PersonalizationResolver implements Resolve<Promise<void>> {
  async resolve(): Promise<void> {
    await fetch('/styles/default', {
      method: 'POST'
    });
  }
}