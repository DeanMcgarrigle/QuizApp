import { NgModule } from '@angular/core';
import {
  CommonModule,
  LocationStrategy,
  HashLocationStrategy,
} from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CoreRoutingModule } from './core-routing.module';
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';
import { ScoreInputComponent } from '../score-input/score-input.component';
import { TeamListComponent } from '../team-list/team-list.component';

//routers
import { RouterModule } from '@angular/router';

import { PageContainerComponent } from './page-container/page-container.component';
import { SharedService } from './services/shared.service';

import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TabViewModule } from 'primeng/tabview';
import {InputNumberModule} from 'primeng/inputnumber';
import { NgxWebstorageModule } from 'ngx-webstorage';

@NgModule({
  declarations: [
    PageContainerComponent,
    LeaderboardComponent,
    ScoreInputComponent,
    TeamListComponent,
  ],
  exports: [
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    PageContainerComponent,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    CoreRoutingModule,
    InputTextModule,
    TooltipModule,
    ButtonModule,
    DividerModule,
    TabViewModule,
    InputNumberModule,
    NgxWebstorageModule.forRoot({ prefix: 'quiz' }),
  ],
  providers: [SharedService],
})
export class CoreModule {}
