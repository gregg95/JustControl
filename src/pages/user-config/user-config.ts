import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Globals } from '../../app/Globals';

/**
 * Generated class for the UserConfigPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-config',
  templateUrl: 'user-config.html',
})
export class UserConfigPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public globals : Globals) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserConfigPage');
    console.log(this.globals.user);
  }

}
