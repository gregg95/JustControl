import { Component, Input } from '@angular/core';
import { Task } from '../../app/models/task.model';
import { AngularFireDatabase } from 'angularfire2/database';
import { Globals } from '../../app/Globals';
import { NavController } from 'ionic-angular';
import { TaskConfigPage } from '../../pages/task-config/task-config';

/**
 * Generated class for the TaskComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'tasks-list',
  templateUrl: 'tasks-list.html'
})
export class TasksListComponent {
  
  text: string;
  tasks = [];


  constructor(public db : AngularFireDatabase,
    public globals: Globals, public navCtrl : NavController) {
    console.log('Hello TaskComponent Component');

    this.db.list('tasks/', ref => ref.orderByChild('tsk_fltId').equalTo(this.globals.flat.$key)).snapshotChanges().subscribe(t => {
      t.forEach(tsk => {
        var task = new Task;
        task = tsk.payload.val() as Task;
        task.$key = tsk.key;
        this.tasks.push(task);
      });
    });
  }

  ngAfterViewInit(){
    
  }

  editTask(task : Task){
    this.navCtrl.push(TaskConfigPage, task)
  }

  deleteTask(){

  }
}
