import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { prototype } from 'events';
import some from 'lodash-es/some';
import clone from 'lodash-es/clone';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss'],
})
export class TeamListComponent implements OnInit {
  @Input() teamList: Array<any> = [];
  @Output() roundScore = new EventEmitter<Array<any>>();

  teamScores = [{}];
  scores = {};

  scoresLocked = false;

  constructor(private storage: LocalStorageService) {}

  ngOnInit(): void {
   
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.scoresLocked);
    if (this.teamList.length > 0) {
      this.teamList.forEach((element) => {
        this.teamScores[0][element] = 0;
      });
    }
  }

  submitScores() {
    // console.log(this.teamScores);
    this.scoresLocked = true;
    this.roundScore.emit(this.teamScores);
  }

  toggleLock() {
    this.scoresLocked = !this.scoresLocked;
  }

  onInput() {
    console.log(this.teamScores);
    // const anyZeros = some(copy, function (o) {
    //   console.log(o);
    // });
  }
}
