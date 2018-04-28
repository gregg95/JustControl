import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { ToastController } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import { Platform } from 'ionic-angular';
import firebase from 'firebase';
import { RegisterPage } from '../register/register';
import { MainPage } from '../main/main';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { User } from '../../app/models/user.model';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user: User;
  email: string;
  password: string;
 // afDb: AngularFireDatabase;
  userList : AngularFireList<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private afAuth: AngularFireAuth,
    private gplus: GooglePlus, private toastCtrl: ToastController,
    private platform: Platform, private menuCtrl: MenuController,
    public db : AngularFireDatabase ) {
     // this.afDb = db;
      this.afAuth.authState.subscribe(res => {
        if(res && res.uid ) {
          this.checkIfUserExists(res);
          this.makeToast("user logged ");
          navCtrl.push(MainPage);
          
        } else {
          navCtrl.popToRoot();
        }
      });

      
    navCtrl.viewDidEnter.subscribe((e) => {
      menuCtrl.enable(true, 'myMenu');
      switch (e.instance.constructor.name){
        case 'LoginPage':
        menuCtrl.enable(false, 'myMenu');
          break; 
        case 'RegisterPage':
        menuCtrl.enable(false, 'myMenu');
          break; 
      }
    });

    this.userList = db.list('users');
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  async checkIfUserExists(res) {

    var query = await this.db.list('users', ref => ref.orderByChild('usr_id').equalTo(res.uid));

    var result = 0;
    await new Promise(resolve => {
      query.valueChanges().subscribe(u => {                                       
        result = u.length;
        resolve();
      });
    });

    if (Number(await result) == 0) {
      this.userList.push({
        usr_id: res.uid,
        usr_name: res.displayName,
        usr_rights: 1
      });
    }
  }


  googleLogin() {
    if (this.platform.is('cordova')){
      this.nativeGoogleLogin();
    } else {
      this.webGoogleLogin();
    }
  }

  async nativeGoogleLogin(): Promise<void> {
    try {
      const gplusUser = await this.gplus.login({
        'webClientId': '426681299685-15viaq14deolshshhnj80gpfrqhvli4f.apps.googleusercontent.com',
        'offline': true,
        'scopes': 'profile email'      
      });

      return await this.afAuth.auth.signInWithCredential(
        firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken)
      ).then(r => {
        this.makeToast("zalogowano " + JSON.stringify(r));
      })
    } catch(err) {
      console.log(err);
    }
  }

  async webGoogleLogin(): Promise<void> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const credential = await this.afAuth.auth.signInWithPopup(provider).then(r => {
        this.makeToast("zalogowano " + JSON.stringify(r));
      });
      
    } catch(err) {
      console.log(err);
    }
  }

  makeToast(message) {
    this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    }).present();    
  }

  goToRegisterPage(){
    this.navCtrl.push(RegisterPage);
  }

  loginWithEmailAndPassword() {
    try {
      this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password);
    }
    catch (e) {
      this.makeToast(e);
    }
  }
}
