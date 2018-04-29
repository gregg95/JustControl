import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { ToastController } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import { Platform } from 'ionic-angular';
import firebase from 'firebase';
import { RegisterPage } from '../register/register';
import { MainPage } from '../main/main';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { User } from '../../app/models/user.model';
import { UserConfigPage } from '../user-config/user-config';
import { Globals } from '../../app/Globals';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public user: User;
  email: string;
  password: string;
 // afDb: AngularFireDatabase;
  userList : AngularFireList<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private afAuth: AngularFireAuth,
    private gplus: GooglePlus, private toastCtrl: ToastController,
    private platform: Platform, public menuCtrl: MenuController,
    public db : AngularFireDatabase, public globals: Globals ) {
     // this.afDb = db;
      this.afAuth.authState.subscribe(res => {
        
        if(res && res.uid ) {
          console.log(((res.uid)));
          this.checkUser(res);          
        } else {
          navCtrl.popToRoot();
          this.user = null;
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

  async checkUser(res) {

    //sprawdzam czy istnieje user jezeli nie to oznacza nowe logowanie
    var query = await this.db.list('users', ref => ref.orderByChild('usr_id').equalTo(res.uid));
    
    await new Promise(resolve => {
      query.snapshotChanges().subscribe(u => {  
        
        if(u.length > 0) {
          this.user = u[0].payload.val() as User;            
          this.user.$key = u[0].key;      
          console.log("Wtf");
          console.log(this.user);       
        }
        resolve();
      });
    });

    query = null;

    //dodaje uzytkownika do bazy
    if (!this.user) {
      this.user = new User;
      this.user.usr_id = res.uid;
      this.user.usr_name = ((res.displayName) ? res.displayName : this.globals.usr_name);
      this.user.usr_rights = 0;


      this.user.$key = this.userList.push(this.user).key; 
    }
    
    this.globals.user = this.user;

    //sprawdzenie czy uzytkonik jest poprawnie skonfigurowany
    if (this.user.usr_rights == 0) {
      this.navCtrl.push(UserConfigPage);
    } else {
      this.navCtrl.push(MainPage);
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
      await this.afAuth.auth.signInWithPopup(provider).then(r => {
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
