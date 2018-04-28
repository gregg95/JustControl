import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommonExpensesPage } from './common-expenses';

@NgModule({
  declarations: [
    CommonExpensesPage,
  ],
  imports: [
    IonicPageModule.forChild(CommonExpensesPage),
  ],
})
export class CommonExpensesPageModule {}
