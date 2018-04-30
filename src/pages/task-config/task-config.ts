import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, DateTime } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { Task } from '../../app/models/task.model';
import { Globals } from '../../app/Globals';
import { User } from '../../app/models/user.model';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public formBuilder : FormBuilder, public db : AngularFireDatabase,
    public globals : Globals) {

    


    this.taskForm = this.formBuilder.group({
      tsk_usrId: ['', Validators.required],
      tsk_minCompletationDate: ['', Validators.required],
      tsk_maxCompletationDate: ['', Validators.required],
      tsk_title: ['', Validators.required],
      tsk_description: ['', Validators.required],
      tsk_commentary: ['', Validators.required],
      tsk_category : ['', Validators.required]
    });

    if (Object.keys(navParams.data).length > 0) {
      var task =  navParams.data as Task;
      this.taskForm.controls['tsk_category'].setValue(task.tsk_category);
      this.taskForm.controls['tsk_usrId'].setValue(task.tsk_usrId);
      this.taskForm.controls['tsk_minCompletationDate'].setValue(task.tsk_minCompletationDate);
      this.taskForm.controls['tsk_maxCompletationDate'].setValue(task.tsk_maxCompletationDate);
      this.taskForm.controls['tsk_title'].setValue(task.tsk_title);
      this.taskForm.controls['tsk_description'].setValue(task.tsk_description);
      this.taskForm.controls['tsk_commentary'].setValue(task.tsk_commentary);
    }

    this.db.list('flats/' + this.globals.flat.$key + "/flt_categories").snapshotChanges().subscribe(c => {
      c.forEach(cat => {
        this.categories.push({ cat_name: cat.payload.child('cat_name').val() });
      });
    });

    this.users = new Array<User>();

    this.db.list('users/', ref => ref.orderByChild('usr_fltId').equalTo(this.globals.flat.$key)).snapshotChanges().subscribe(u => {
      u.forEach(usr => {
        this.users.push(usr.payload.val() as User);
      })
    });
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaskConfigPage');
  }

  addTask(){


    if (this.taskForm.valid) {
      var task = new Task;
      task.tsk_modifiedBy = this.globals.user.$key;
      task.tsk_usrId = this.taskForm.controls.tsk_usrId.value; //?
      task.tsk_fltId = this.globals.flat.$key;
      task.tsk_createdAt = new Date(new Date().setHours(new Date().getHours() + 2)).toISOString();
      task.tsk_minCompletationDate = new Date(Date.parse(this.taskForm.controls.tsk_minCompletationDate.value)).toISOString();
      task.tsk_maxCompletationDate = new Date(Date.parse(this.taskForm.controls.tsk_maxCompletationDate.value)).toISOString();
      task.tsk_title = this.taskForm.controls.tsk_title.value;
      task.tsk_description = this.taskForm.controls.tsk_description.value;
      task.tsk_commentary = this.taskForm.controls.tsk_commentary.value;
      task.tsk_status = (this.globals.user.usr_rights == 1) ? 1 : 0;
      task.tsk_category = this.taskForm.controls.tsk_category.value;
  
  
      this.db.list('tasks').push(task);

      this.globals.makeToast("Dodano zadanie!");

      this.navCtrl.removeView(this.navCtrl.getActive());
    } 
    
  }

 
}
