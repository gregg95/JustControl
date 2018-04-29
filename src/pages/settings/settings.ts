import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Globals } from '../../app/Globals';
import { UserConfigPage } from '../user-config/user-config';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  newPassword : string = "";
  rePassword : string = "";
  newUsername : string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public afAuth : AngularFireAuth, public db : AngularFireDatabase,
  public globals : Globals) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  changePassword() {
    if (this.newPassword == "" || this.rePassword == "" ){
      this.globals.makeToast("Pola nie mogą być puste !! ");
      return;
    }

    if (this.newPassword != this.rePassword) {
      this.globals.makeToast("Hasla do siebie nie pasują !!");
      return;
    }

    if (this.newPassword.length < 6){
      this.globals.makeToast("Haslo jest za krotkie");
      return;
    }


    this.afAuth.auth.currentUser.updatePassword(this.newPassword).then(() => {

      this.globals.makeToast("Hasło zostało zmienione");
    });
  }

  changeUsername() {
    
  }

  leaveFlat() {

    this.db.list('users')
    .update(this.globals.user.$key, 
      { 
        usr_rights: 0,
        usr_fltId : "null"
      });
      
    this.navCtrl.push(UserConfigPage).then(() => {
      this.navCtrl.getViews().forEach(v => {
        if (v.index != 0 && v.name != this.navCtrl.getActive().name) {
          this.navCtrl.removeView(v);
        }
      });
    });

    

    
  }

  deleteAccount() {

  }
}
