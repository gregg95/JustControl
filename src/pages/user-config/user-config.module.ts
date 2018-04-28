import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserConfigPage } from './user-config';

@NgModule({
  declarations: [
    UserConfigPage,
  ],
  imports: [
    IonicPageModule.forChild(UserConfigPage),
  ],
})
export class UserConfigPageModule {}
