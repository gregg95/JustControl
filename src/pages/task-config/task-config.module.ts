import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaskConfigPage } from './task-config';

@NgModule({
  declarations: [
    TaskConfigPage,
  ],
  imports: [
    IonicPageModule.forChild(TaskConfigPage),
  ],
})
export class TaskConfigPageModule {}
