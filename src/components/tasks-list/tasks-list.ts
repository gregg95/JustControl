import { Component, Input } from '@angular/core';
import { Task } from '../../app/models/task.model';
import { AngularFireDatabase } from 'angularfire2/database';
import { Globals } from '../../app/Globals';
import { NavController, Platform } from 'ionic-angular';
import { TaskConfigPage } from '../../pages/task-config/task-config';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { TasksFilterPipe } from '../../pipes/tasks-filter/tasks-filter';
import { dateDataSortValue } from 'ionic-angular/util/datetime-util';
import { User } from '../../app/models/user.model';
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
lol : string = "";
  constructor(public db : AngularFireDatabase,
    public globals: Globals, public navCtrl : NavController, public localNotifications : LocalNotifications, public platform: Platform) {
    console.log('Hello TaskComponent Component');

    this.db.list('tasks/', ref => ref.orderByChild('tsk_fltId').equalTo(this.globals.flat.$key)).snapshotChanges().subscribe(t => {
      this.tasks = [];
      t.forEach(tsk => {
        var task = new Task;
        task = tsk.payload.val() as Task;
        task.$key = tsk.key;
        this.tasks.push(task);

        if (task.tsk_usrId == this.globals.user.usr_id 
            && task.tsk_notifyId == 0 && this.platform.is('cordova') && new Date(Date.parse(task.tsk_minCompletationDate)) > (new Date())) {
                 
          this.checkNotification(task);
                     
        }

        this.db.object('users/' + task.tsk_usrId).snapshotChanges().subscribe(u => {
          
          var usr = u.payload.val() as User;
          task.tsk_usrName = usr.usr_name;
        });
      });
    });
  }

  ngAfterViewInit(){
    
  }

  async checkNotification(task : Task){

    this.localNotifications.getIds().then(i => {

      var ids = i as Array<number>;

      var max = Math.max(...i);

      this.globals.makeToast(max);

      this.localNotifications.schedule({
        id: max + 1,
        title: "Nowe zadanie",
        text: task.tsk_title,
        trigger: {at: new Date(Date.parse(task.tsk_minCompletationDate)) },
        data: {mydata: "mu hidden message"}
      });

    });
    

  }

  editTask(task : Task){
    this.navCtrl.push(TaskConfigPage, task)
  }

  async deleteTask(){
    
  }

  async showNotifs(){
    var notifs : Array<number> = [];

    await new Promise(resolve => { 

      this.localNotifications.getIds().then(i => {
        //notifs = i as Array<number>;
        this.globals.makeToast(i);
        resolve();
      });
    });
  }
}
