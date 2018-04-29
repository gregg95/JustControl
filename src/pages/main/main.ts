import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Globals } from '../../app/Globals';

/**
 * Generated class for the MainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {

  username: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public globals: Globals) {

      this.username = this.globals.user.usr_name;    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
  }


}
