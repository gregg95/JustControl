import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TasksHistoryPage } from './tasks-history';

@NgModule({
  declarations: [
    TasksHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(TasksHistoryPage),
  ],
})
export class TasksHistoryPageModule {}
