import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommonExpansesConfigPage } from './common-expanses-config';

@NgModule({
  declarations: [
    CommonExpansesConfigPage,
  ],
  imports: [
    IonicPageModule.forChild(CommonExpansesConfigPage),
  ],
})
export class CommonExpansesConfigPageModule {}
