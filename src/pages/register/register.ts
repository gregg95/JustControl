import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

  repassword: string = "";
  password: string = "";
  email: string = "";
  usr_name: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private afAuth: AngularFireAuth, public globals: Globals) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  async registerWithEmailAndPassword() {
    if(this.password != this.repassword){
      this.globals.makeToast("Hasła do siebie nie pasują.")
      return;
    }

    if(this.usr_name.length < 3){
      this.globals.makeToast("Nazwa użytkownika musi mieć conajmniej 3 litery.");
      return;
    }

    if(this.password.length < 6 || this.repassword.length < 6){
      this.globals.makeToast("Hasło musi mieć conajmniej 6 znaków")
      return;
    }

    try {
      await this.afAuth.auth.createUserWithEmailAndPassword(this.email, this.password);
      this.globals.usr_name = this.usr_name;
    } 
    catch (e) {
      console.log(e);
      if (e.code == "auth/invalid-email"){
        this.globals.makeToast("Niepoprawny e-mail.");
      } else if (e.code = "auth/argument-error"){
        this.globals.makeToast("Istnieje konto z tym adresem e-mail.")
      } else {
        this.globals.makeToast(e);
      }
    }
  }

}
