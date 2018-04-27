import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

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
    private afAuth: AngularFireAuth, private menuCtrl: MenuController) {
    this.username = afAuth.auth.currentUser.displayName;
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
    this.menuCtrl.enable(true, 'myMenu');
  }


}
