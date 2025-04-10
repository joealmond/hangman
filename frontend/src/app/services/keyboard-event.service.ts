import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KeyboardEventService implements OnDestroy {
  private keyPressSubject = new Subject<string>();
  public keyPress$ = this.keyPressSubject.asObservable();
  private listener: (event: KeyboardEvent) => void;

  constructor() {
    this.listener = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLButtonElement) {
        return;
      }

      const key = event.key.toUpperCase();
      event.preventDefault();

      this.keyPressSubject.next(key);
    };

    document.addEventListener('keypress', this.listener);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keypress', this.listener);
    this.keyPressSubject.complete();
  }
}
