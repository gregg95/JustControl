import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,  AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { Task } from '../../app/models/task.model';
import { Globals } from '../../app/Globals';
import { User } from '../../app/models/user.model';
import moment from 'moment';
/**
 * Generated class for the TaskConfigPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-task-config',
  templateUrl: 'task-config.html',
})
export class TaskConfigPage {

  taskForm : FormGroup;
  categories = [];
  users = [];
  taskEdition = false;
  editedTask : Task;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public formBuilder : FormBuilder, public db : AngularFireDatabase,
  public globals : Globals, private alertCtrl: AlertController) {

    this.taskForm = this.formBuilder.group({
      tsk_usrId: [''],
      tsk_minCompletationDate: ['', Validators.required],
      tsk_maxCompletationDate: ['', Validators.required],
      tsk_description: ['', Validators.required],
      tsk_commentary: [''],
      tsk_category : ['', Validators.required]
    });


    
    this.taskForm.controls['tsk_minCompletationDate'].setValue(moment(new Date()).add(2, 'hour').toISOString());
    this.taskForm.controls['tsk_maxCompletationDate'].setValue(moment(new Date()).add(3, 'hour').toISOString());


    if (Object.keys(navParams.data).length > 0) {
      this.taskEdition = true;
      this.editedTask =  navParams.data as Task;
      this.taskForm.controls['tsk_category'].setValue(this.editedTask.tsk_category);
      this.taskForm.controls['tsk_usrId'].setValue(this.editedTask.tsk_usrId);
      this.taskForm.controls['tsk_minCompletationDate'].setValue(moment(new Date(Date.parse(this.editedTask.tsk_minCompletationDate))).add(2, 'hour').toISOString());
      this.taskForm.controls['tsk_maxCompletationDate'].setValue(moment(new Date(Date.parse(this.editedTask.tsk_maxCompletationDate))).add(2, 'hour').toISOString());
      this.taskForm.controls['tsk_description'].setValue(this.editedTask.tsk_description);
      this.taskForm.controls['tsk_commentary'].setValue(this.editedTask.tsk_commentary);
    }

    this.db.list('flats/' + this.globals.flat.$key + "/flt_categories").snapshotChanges().subscribe(c => {
      this.categories = [];
      c.forEach(cat => {
        this.categories.push({ cat_name: cat.payload.child('cat_name').val() });
      });
    });

    this.users = new Array<User>();

    this.db.list('users/', ref => ref.orderByChild('usr_fltId').equalTo(this.globals.flat.$key)).snapshotChanges().subscribe(u => {
      this.users = [];
      u.forEach(usr => {
        var us = usr.payload.val() as User;
        us.$key = usr.key;
        if (us.usr_rights == 2 || us.usr_rights == 1){
          this.users.push(us);
        }
      })
    });
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaskConfigPage');
  }

  addNewCategory(){
    console.log("??");
    let alert = this.alertCtrl.create({
      title: 'Dodaj kategorie',
      inputs: [
        {
          name: 'cat_name',
          placeholder: 'Podaj nazwę'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            this.taskForm.controls['tsk_category'].setValue(null);
          }
        },
        {
          text: 'Dodaj',
          handler: data => {
            if(data.cat_name.length > 0){
              this.db.list('flats/' + this.globals.flat.$key + '/flt_categories')
              .push({ cat_name: data.cat_name }).then(() => {
                this.taskForm.controls['tsk_category'].setValue(data.cat_name);
              });
            } else {
              this.globals.makeToast("Nazwa kategorii nie może być pusta.")
              this.taskForm.controls['tsk_category'].setValue(null);
            }
            
          }
        }
      ]
    });
    alert.present();
  }

  addTask(){

    if (!this.taskForm.valid) {
      this.globals.makeToast("Formularz nie jest wypełniony poprawnie.");
      return;
    }
    
    
    var task = new Task;
    task.tsk_modifiedBy = this.globals.user.$key;
    task.tsk_usrId = (this.taskForm.controls.tsk_usrId.value == "Brak") ? "" : this.taskForm.controls.tsk_usrId.value; 
    task.tsk_fltId = this.globals.flat.$key;
    task.tsk_createdAt = new Date().toLocaleString();
    task.tsk_minCompletationDate = moment((this.taskForm.controls.tsk_minCompletationDate.value)).add(-2, 'hour').toLocaleString();
    task.tsk_maxCompletationDate = moment((this.taskForm.controls.tsk_maxCompletationDate.value)).add(-2, 'hour').toLocaleString();
    task.tsk_description = this.taskForm.controls.tsk_description.value;
    task.tsk_commentary = this.taskForm.controls.tsk_commentary.value;
    task.tsk_status = (this.globals.user.usr_rights == 1) ? 1 : 0;
    task.tsk_category = this.taskForm.controls.tsk_category.value;
    task.tsk_notifyId = 0;
    task.tsk_createdBy = this.globals.user.usr_name;


    if(!this.taskEdition){
      console.log((this.taskForm.controls.tsk_minCompletationDate.value));

      this.db.list('tasks').push(task);

      this.globals.makeToast("Dodano zadanie!");

      this.navCtrl.removeView(this.navCtrl.getActive());
      
    } else {
      console.log("teraz");
      console.log(moment((this.taskForm.controls.tsk_minCompletationDate.value)).toLocaleString());
      
      this.db.list('tasks').update(this.editedTask.$key, task)

      this.globals.makeToast("Edytowano zadanie!");

      this.navCtrl.removeView(this.navCtrl.getActive());
    } 
  }
 

}
