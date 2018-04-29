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

  currPassword : string;
  newPassword : string;
  rePassword : string;
  newUsername : string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public afAuth : AngularFireAuth, public db : AngularFireDatabase,
  public globals : Globals) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  changePassword() {

  }

  changeUsername() {
    
  }

  leaveFlat() {

    this.navCtrl.push(UserConfigPage).then(() => {
      this.navCtrl.getViews().forEach(v => {
        if (v.index != 0 && v.index != this.navCtrl.getActive().index) {
          this.navCtrl.remove(v.index);
        }
      });
    });

    return;
    this.db.list('users')
      .update(this.globals.user.$key, 
        { 
          usr_rights: 0,
          usr_fltId : "null"
        });

    
  }

  deleteAccount() {

  }
}
