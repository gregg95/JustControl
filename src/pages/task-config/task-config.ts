import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, DateTime } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { Task } from '../../app/models/task.model';
import { Globals } from '../../app/Globals';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public formBuilder : FormBuilder, public db : AngularFireDatabase,
    public globals : Globals) {

    this.taskForm = this.formBuilder.group({
      tsk_usrId: [''],
      tsk_minCompletationDate: [''],
      tsk_maxCompletationDate: [''],
      tsk_title: [''],
      tsk_description: [''],
      tsk_commentary: [''],
      tsk_category : ['']
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaskConfigPage');
  }

  addTask(){

    var task = new Task;
    task.tsk_modifiedBy = this.globals.user.$key;
    task.tsk_usrId = this.taskForm.controls.tsk_usrId.value; //?
    task.tsk_fltId = this.globals.flat.$key;
    task.tsk_createdAt = new Date().toISOString();
    task.tsk_minCompletationDate = new Date().toISOString();
    task.tsk_maxCompletationDate = new Date().toISOString();
    task.tsk_title = this.taskForm.controls.tsk_title.value;
    task.tsk_description = this.taskForm.controls.tsk_description.value;
    task.tsk_commentary = this.taskForm.controls.tsk_commentary.value;
    task.tsk_status = 1
    task.tsk_category = this.taskForm.controls.tsk_category.value;


    this.db.list('tasks').push(task);
  }
}
