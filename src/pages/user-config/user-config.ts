import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform, InfiniteScroll } from 'ionic-angular';
import { Globals } from '../../app/Globals';
import { AngularFireDatabase } from 'angularfire2/database';
import { Flat } from '../../app/models/flat.model';
import { FlatConfigPage } from '../flat-config/flat-config';
import { AngularFireAuth } from 'angularfire2/auth';
import { GooglePlus } from '@ionic-native/google-plus';
import { SelectSearchable } from 'ionic-select-searchable';
import { HomePage } from '../home/home';

/**
 * Generated class for the UserConfigPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-config',
  templateUrl: 'user-config.html',
})
export class UserConfigPage {

  flt_code : string;
  flats = [];
  flt : Flat;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public globals : Globals, public db: AngularFireDatabase, public toastCtrl: ToastController,
    public afAuth: AngularFireAuth, public platform : Platform, public gplus : GooglePlus) {

      
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad UserConfigPage');
    this.globals.dismissLoading();
  }

  searchFlats(event: { component: SelectSearchable, infiniteScroll: InfiniteScroll, text: string }) {
    let text = (event.text || '').trim().toLowerCase();

    if (!text) {
        event.component.items = [];
        return;
    } else if (event.text.length < 1) {
        return;
    }

    event.component.isSearching = true;
    this.flats = [];
    this.db.list('flats/').snapshotChanges().subscribe(f => {
      f.forEach(flt => {
        var flat = flt.payload.val() as Flat;            
        flat.$key = flt.key;  

        this.flats.push(flat);
      });
      event.component.items = this.filterPorts(this.flats, text);
      event.component.isSearching = false;
    });
}



ionViewDidLeave(){
  this.afAuth.auth.signOut();
    if (this.platform.is('cordova')) {
      this.gplus.logout();      
    }
}



filterPorts(flats: Flat[], text: string) {
  return flats.filter(flat => {
      return flat.flt_code.toLowerCase().indexOf(text) !== -1;
  });
}

flatChange(event: { component: SelectSearchable, value: any }) {
  console.log('port:', event.value);
  console.log(this.flt);
}

  async joinFlat() {
    //dopisuje uzytkownika do listy oczekujących
    if (!this.flt){
      this.globals.makeToast("Wybierz mieszkanie");
      return;
    }
    //ustawiam mu flage
    await new Promise(resolve => { 
    this.db.object('users/' + this.globals.user.$key).update({
      usr_rights: 3,
      usr_fltId: this.flt.$key
    }).then(() =>  {
      this.globals.user.usr_rights = 3;
      this.globals.user.usr_fltId = this.flt.$key;
      resolve();
    });

  });
    await new Promise(resolve => { 
      let c = this.db.object('flats/' + this.globals.user.usr_fltId).snapshotChanges().subscribe(f => {
        this.globals.flat = f.payload.val() as Flat;
        this.globals.flat.$key = f.key;
        c.unsubscribe();
        resolve();
      });
    });

    this.navCtrl.push(HomePage);
   /* var query = await this.db.list('flats', ref => ref.orderByChild('flt_code').equalTo(this.flt.flt_code));
    
    this.globals.flat = new Flat();
    await new Promise(resolve => {
      query.snapshotChanges().subscribe(f => {  
        if(f.length > 0) {
          this.globals.flat = f[0].payload.val() as Flat;            
          this.globals.flat.$key = f[0].key;             
        }
        resolve();
      });
    });

    query = null;


    if(Object.keys(this.globals.flat).length == 0){
      this.globals.makeToast("Mieszkanie o podanum numerze nie istnieje !!");
    } else {
      //przypisz mieszkanie do globalnej i idz do glownego okna
      console.log("??1");
      this.db.list('users')
      .update(this.globals.user.$key, 
        { 
          usr_rights: 2,
          usr_fltId : this.globals.flat.$key 
        });

        this.globals.user.usr_rights = 2;
      console.log("??2");
      var pageId = this.navCtrl.getActive().index;
      console.log("??3");
      
      this.navCtrl.push(MainPage).then(() => {
        this.navCtrl.remove(pageId);
      });
    } */
  }
  
  createNewFlat(){
    this.navCtrl.push(FlatConfigPage);
  }

  cancel(){
    this.afAuth.auth.signOut();
    if (this.platform.is('cordova')) {
      this.gplus.logout();      
    }

  }
}
