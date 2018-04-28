import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Globals } from '../../app/Globals';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  repassword: string;
  password: string;
  email: string;
  usr_name: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private afAuth: AngularFireAuth, private toastCtrl: ToastController,
    private platform: Platform, public globals: Globals) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  async registerWithEmailAndPassword() {
    try {
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(this.email, this.password);
      this.globals.usr_name = this.usr_name;
      console.log(result);
    } 
    catch (e) {
      console.log(e);
    }
  }

}
