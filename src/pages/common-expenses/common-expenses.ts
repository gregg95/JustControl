import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommonExpansesConfigPage } from '../common-expanses-config/common-expanses-config';

import { Globals } from '../../app/Globals';

/**
 * Generated class for the CommonExpensesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-common-expenses',
  templateUrl: 'common-expenses.html',
})
export class CommonExpensesPage {

  
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public globals: Globals) {


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommonExpensesPage');
  }

  newExpanseForm(){
    this.navCtrl.push(CommonExpansesConfigPage);
  }
}
