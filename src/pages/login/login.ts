import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { GooglePlus } from '@ionic-native/google-plus';
import { Platform } from 'ionic-angular';
import firebase from 'firebase';
import { RegisterPage } from '../register/register';
import { MainPage } from '../main/main';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { User } from '../../app/models/user.model';
import { UserConfigPage } from '../user-config/user-config';
import { Globals } from '../../app/Globals';
import { Flat } from '../../app/models/flat.model';
import { Facebook } from '@ionic-native/facebook';
import { HomePage } from '../home/home';

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
    private gplus: GooglePlus, 
    private platform: Platform, public menuCtrl: MenuController,
    public db : AngularFireDatabase, public globals: Globals, public fb: Facebook) {
     
      this.globals.navCtrl = navCtrl;
     
      this.afAuth.authState.subscribe(res => {
        
        if(res && res.uid ) {
          this.globals.showLoading();
          this.checkUser(res);          
        } else {
          navCtrl.popToRoot();
          this.user = null;
          this.globals.clearGlobals();
        }
      });

      
      //wyłączenie menu bocznego na poszczególnuch stronach      
    navCtrl.viewDidEnter.subscribe((e) => {
      menuCtrl.enable(true, 'myMenu');
      switch (e.instance.constructor.name){
        case 'LoginPage':
        case 'RegisterPage':
        case 'TaskConfigPage':
        case 'UsersManagementPage':
        case 'CommonExpansesConfigPage':
        case 'ExpenseDetailsPage':
        case 'FlatConfigPage':
        case 'UserConfigPage':
        case 'HomePage':
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
      this.user.usr_fltId = "null";
      this.user.usr_points = 0;

      this.user.$key = this.userList.push(this.user).key; 
    }
    
    console.log(this.user);
    this.globals.user = this.user;

    //sprawdzenie czy uzytkonik jest poprawnie skonfigurowany
    console.log(this.user.usr_rights);
    if (this.user.usr_rights == 0) {
      this.navCtrl.push(UserConfigPage);
    } else if (this.user.usr_rights == 3){
      await this.getFlat();
      this.navCtrl.push(HomePage);
    } else {
      await this.getFlat();
      this.navCtrl.push(MainPage);
    }   

    
  }


  async getFlat(){
    await new Promise(resolve => { 
      let c = this.db.object('flats/' + this.globals.user.usr_fltId).snapshotChanges().subscribe(f => {
        this.globals.flat = f.payload.val() as Flat;
        this.globals.flat.$key = f.key;
        c.unsubscribe();
        resolve();
      });
    });
  }

  googleLogin() {
    this.globals.showLoading();
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
        
      }, err => {
        this.globals.makeToast(err);
        this.globals.dismissLoading();
      })
    } catch(err) {
      console.log(err);
      this.globals.dismissLoading();
    }
  }

  async webGoogleLogin(): Promise<void> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await this.afAuth.auth.signInWithPopup(provider).then(r => {
        
      });
      
    } catch(err) {
      console.log(err);
      this.globals.dismissLoading();
    }
  }

  
  goToRegisterPage(){
    this.navCtrl.push(RegisterPage);
  }

  loginWithEmailAndPassword() {
    this.globals.showLoading();
    try {
      this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password).then(() => {}, err => {
       
        this.globals.makeToast("Nie poprawne dane logowania.");
        this.globals.dismissLoading();
      });
    }
    catch (e) {
      if(e.code == "auth/argument-error" ){
        this.globals.makeToast("Podane dane nie są poprawnie sformatowane.");
      }
      this.globals.dismissLoading();
    }
  }

  facebookLogin(){
    this.globals.showLoading();
    if (this.platform.is('cordova')){
      this.nativeFblogin();
    } else {
      this.webFbLogin();
    }
  }

  nativeFblogin(){
    try {

      this.fb.login(["email", "public_profile"]).then(res => {
        const fbCredential = firebase.auth.FacebookAuthProvider.credential(
          res.authResponse.accessToken
        );

        firebase.auth().signInWithCredential(fbCredential).then(resp => {
   
        }, error => {
          if (error.code == "auth/account-exists-with-different-credential"){
            this.globals.makeToast("Istnieje konto już z adresem email podanym na FaceBook")
          }
          this.globals.dismissLoading();
        })
      });
      
    } catch (error) {
      console.log(error);
      if (error.code == "auth/account-exists-with-different-credential"){
        this.globals.makeToast("Istnieje konto już z adresem email podanym na FaceBook")
      }
      this.globals.dismissLoading();
    }    
  }

  webFbLogin(){
    try {
      this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(res => {

        }, error => {
          console.log(error);
          if (error.code == "auth/account-exists-with-different-credential"){
            this.globals.makeToast("Istnieje konto już z adresem email podanym na FaceBook")
          }
          this.globals.dismissLoading();
        });
    } catch (error) {
      console.log(error);
      if (error.code == "auth/account-exists-with-different-credential"){
        this.globals.makeToast("Istnieje konto już z adresem email podanym na FaceBook")
      }
      this.globals.dismissLoading();
    }
  }
}
