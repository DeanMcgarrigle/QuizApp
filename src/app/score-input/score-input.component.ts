import { Component, OnInit } from '@angular/core';
import clone from 'lodash-es/clone';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-score-input',
  templateUrl: './score-input.component.html',
  styleUrls: ['./score-input.component.scss'],
})
export class ScoreInputComponent implements OnInit {
  scores: Array<any> = [];
  channel = new BroadcastChannel('channel');
  round: string = 'Round 1';
  roundNum = 1;
  newTeamName = '';
  tlHolder = [];
  teamList = [];

  constructor(private storage: LocalStorageService) {}

  ngOnInit(): void {
    const t = this.storage.retrieve('teamList');
    if(t){
      this.teamList = t;
    }
  }

  addTeam() {
    this.tlHolder.push(this.newTeamName);
    this.teamList = [];
    this.teamList = clone(this.tlHolder);
    this.storage.store('teamList', this.teamList);
    this.newTeamName = '';
  }

  onAddScore(round, score) {
    // console.log(round, score);
    this.scores.push(score[0])
    // console.log(this.scores)
    this.channel.postMessage(this.scores);
  } 
}
