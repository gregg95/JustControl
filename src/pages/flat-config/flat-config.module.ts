import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FlatConfigPage } from './flat-config';

@NgModule({
  declarations: [
    FlatConfigPage,
  ],
  imports: [
    IonicPageModule.forChild(FlatConfigPage),
  ],
})
export class FlatConfigPageModule {}
