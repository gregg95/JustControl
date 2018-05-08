import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Globals } from '../../app/Globals';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { Expense } from '../../app/models/expanse.model';
import { storage } from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';
/**
 * Generated class for the CommonExpansesConfigPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-common-expanses-config',
  templateUrl: 'common-expanses-config.html',
})
export class CommonExpansesConfigPage {

  expanseForm : FormGroup;
  imgSrc : string =  "";

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public formBuilder : FormBuilder, public globals: Globals,
    public db : AngularFireDatabase, private camera : Camera) {
      this.expanseForm = this.formBuilder.group({
        exp_title: ['', Validators.required],
        exp_description: [''],
        exp_amount: ['', Validators.required],
        exp_attachment: ['']
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommonExpansesConfigPage');
  }

  addCommonExpanse(){
    var expense = new Expense;

    if (!this.expanseForm.valid){
      this.globals.makeToast("Formularz jest niepoprawnie wypełniony");
      return;
    }

    console.log(

      this.expanseForm.controls.exp_title.value+ this.expanseForm.controls.exp_description.value+this.expanseForm.controls.exp_amount.value+this.expanseForm.controls.exp_attachment.value+new Date().toString()+this.globals.user.usr_name+this.globals.flat.$key
    );

    expense.exp_title = this.expanseForm.controls.exp_title.value;
    expense.exp_description = this.expanseForm.controls.exp_description.value;
    expense.exp_amount = this.expanseForm.controls.exp_amount.value;
    expense.exp_attachment = this.expanseForm.controls.exp_attachment.value;
    expense.exp_createdAt = new Date().toString();    
    expense.exp_createdBy = this.globals.user.usr_name;
    expense.exp_fltId = this.globals.flat.$key;


    this.db.list('expenses').push(expense).then(res => {
      this.globals.makeToast("Dodano wydatek");
      const image = this.imgSrc;

      const pictures = storage().ref(this.expanseForm.controls.exp_attachment.value);

      pictures.putString(image, 'data_url');
      this.navCtrl.removeView(this.navCtrl.getActive());
    }, err => {
      this.globals.makeToast(err);
    });



    
  }

  async takePhoto(){
    try {
      
      const options : CameraOptions = {
        quality: 50,
        targetHeight: 600,
        targetWidth: 600,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }


      await this.camera.getPicture(options).then(d => {
        this.imgSrc= "data:image/jpeg;base64," + d;
        this.expanseForm.controls.exp_attachment
          .setValue('pictures/expenses/'+this.globals.flat.$key+'/'+ (new Date()).toISOString() + 'usr:' + this.globals.user.$key);
      });



      
    } catch (error) {
     this.globals.makeToast(error); 
    }
  }
}
