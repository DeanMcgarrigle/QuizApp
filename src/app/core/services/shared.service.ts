import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private s = new BehaviorSubject<any>([]);
  scores = this.s.asObservable();

  constructor() {}

  updateScores(scores: any) {
    this.s.next(scores);
  }
}
