import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';
import { ScoreInputComponent } from '../score-input/score-input.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: '/leaderboard', pathMatch: 'full' },
      {
        path: 'leaderboard',
        component: LeaderboardComponent,
      },
      {
        path: 'scores',
        component: ScoreInputComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy', useHash: true })],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
