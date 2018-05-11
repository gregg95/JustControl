import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Globals } from '../../app/Globals';
import { UserConfigPage } from '../user-config/user-config';
import { UsersManagementPage } from '../users-management/users-management';
import { User } from '../../app/models/user.model';


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  newPassword : string = "";
  rePassword : string = "";
  newUsername : string = "";
  passwordChangeEnabled : boolean =  true;
  flt_code : string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public afAuth : AngularFireAuth, public db : AngularFireDatabase,
  public globals : Globals) {
    if(this.afAuth.auth.currentUser.providerData[0].providerId != "password"){
      this.passwordChangeEnabled = false;
    }

    this.flt_code = this.globals.flat.flt_code;
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


  changeFlatCode() {

    if(this.flt_code == this.globals.flat.flt_code){
      this.globals.makeToast("Podany kod jest taki sam jak obecny.");
      return;
    }

    console.log(this.flt_code);
    if(this.flt_code != ""){
      this.db.list('flats')
      .update(this.globals.flat.$key, 
        { 
          flt_code: this.flt_code
        }).then(() => {
          this.globals.makeToast("Zmieniono kod !");
        });

    } else {
      this.globals.makeToast("Wprowadź kod mieszkania !");
    }
  }




  async leaveFlat() {

    if(this.globals.user.usr_rights == 1){
      var b = false;
      await new Promise(resolve => {
        this.db.list('users', ref => ref.orderByChild('usr_fltId').equalTo(this.globals.flat.$key)).snapshotChanges().subscribe(u => {
          
          if(u.length > 1){
            u.forEach(usr => {
              var user = usr.payload.val() as User;
              user.$key = usr.key;
              if (user.usr_rights == 1 && user.$key != this.globals.user.$key) b = true;
            });
          } else {
            b = true;
          }

          
          resolve();
        });
      });

      if(!b){
        this.globals.makeToast("Jesteś jedynym adminem na mieszkaniu, napierw przekaż innemu użytkownikowi admina!");
        return;
      }
    }

    this.db.list('users')
    .update(this.globals.user.$key, 
      { 
        usr_rights: 0,
        usr_fltId : "null"
      });
      
      this.db.list('users', ref => ref.orderByChild('usr_fltId').equalTo(this.globals.flat.$key)).snapshotChanges().subscribe(u => {
        if (u.length == 0){
          this.globals.makeToast("Usuwanie mieszkania.")
          this.db.object('flats/' + this.globals.flat.$key).remove();
        }
      });

    this.navCtrl.push(UserConfigPage).then(() => {
      this.navCtrl.getViews().forEach(v => {
        if (v.index != 0 && v.name != this.navCtrl.getActive().name) {
          this.navCtrl.removeView(v);
        }
      });
    });
  }

  goToUsersManagement() {
    this.navCtrl.push(UsersManagementPage);
  }

  deleteFlat() {
    this.db.list('users/', ref => ref.orderByChild('usr_fltId').equalTo(this.globals.flat.$key)).snapshotChanges().subscribe(u => {
      u.forEach(usr => {
        
        var user = usr.payload.val() as User;
        user.$key = usr.key;

        this.db.object("users/" + user.$key)
          .update({ usr_fltId: "null", usr_rights: 0 });
      });


      this.db.object("flats/" + this.globals.flat.$key)
      .remove();

      
      this.navCtrl.push(UserConfigPage).then(() => {
        this.navCtrl.getViews().forEach(v => {
          if (v.index != 0 && v.name != this.navCtrl.getActive().name) {
            this.navCtrl.removeView(v);
          }
        });
      });

    });
  }
}
