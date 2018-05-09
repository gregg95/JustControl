import { Component } from '@angular/core';
import { Task } from '../../app/models/task.model';
import { AngularFireDatabase } from 'angularfire2/database';
import { Globals } from '../../app/Globals';
import { NavController, Platform } from 'ionic-angular';
import { TaskConfigPage } from '../../pages/task-config/task-config';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { User } from '../../app/models/user.model';
import { AlertController } from 'ionic-angular';


@Component({
  selector: 'tasks-list',
  templateUrl: 'tasks-list.html'
})
export class TasksListComponent {
  
  text: string;
  tasks = [];
lol : string = "";
  constructor(public db : AngularFireDatabase,
    public globals: Globals, public navCtrl : NavController, public localNotifications : LocalNotifications, public platform: Platform,
          public alertCtrl: AlertController) {
      

      if(this.platform.is('cordova')){this.platform
        .ready()
        .then(() =>
        {

            // Register click event listener for each local notification
            this.localNotifications.on('click').subscribe(notification =>
            {
              var title 	 	=	notification.title,
                  message  		= 	JSON.stringify(notification.data);

              // Display the supplied message to the user
              this.globals.makeLongToast(title + message + notification.id);


            });

        });
      }
      

    this.db.list('tasks/', ref => ref.orderByChild('tsk_fltId').equalTo(this.globals.flat.$key)).snapshotChanges().subscribe(t => {
      this.tasks = [];
      t.forEach(tsk => {
        var task = new Task;
        task = tsk.payload.val() as Task;
        task.$key = tsk.key;
        
        if (new Date(Date.parse(task.tsk_maxCompletationDate)) < (new Date()) && task.tsk_status != 2){
          this.db.object('tasks/' + task.$key).update(
            {
              tsk_status: 3 
            }
          );
        }

        if (this.globals.user.usr_rights == 1){ if (new Date(Date.parse(task.tsk_maxCompletationDate)) > (new Date()) &&
                 (task.tsk_status == 1 || task.tsk_status == 0) ){ 
  
              this.tasks.push(task);     
  
              if (task.tsk_usrId == this.globals.user.$key 
                  && task.tsk_notifyId == 0 && this.platform.is('cordova') && new Date(Date.parse(task.tsk_minCompletationDate)) > (new Date())) {
                  this.checkNotification(task);                      
              }
    
              this.db.object('users/' + task.tsk_usrId).snapshotChanges().subscribe(u => {          
                var usr = u.payload.val() as User;
                task.tsk_usrName = usr.usr_name;
              });
            }          
        } else {
          if (  !(this.globals.user.usr_rights == 2 && task.tsk_status == 0) || task.tsk_modifiedBy == this.globals.user.$key  ){

            if (new Date(Date.parse(task.tsk_maxCompletationDate)) > (new Date()) &&
                 (task.tsk_status == 1 || task.tsk_status == 0) && 
                 (task.tsk_usrId == this.globals.user.$key || task.tsk_usrId == "")){ 
  
              this.tasks.push(task);     
  
              if (task.tsk_usrId == this.globals.user.$key 
                  && task.tsk_notifyId == 0 && this.platform.is('cordova') && new Date(Date.parse(task.tsk_minCompletationDate)) > (new Date())) {
                  this.checkNotification(task);                      
              }
    
              this.db.object('users/' + task.tsk_usrId).snapshotChanges().subscribe(u => {          
                var usr = u.payload.val() as User;
                task.tsk_usrName = usr.usr_name;
              });
            }          
          }
        }
       
      });

      this.sortTaskList();
    });
  }


  sortTaskList(){
    this.tasks.sort((a: Task, b: Task) => {
      var aMin = new Date(Date.parse(a.tsk_minCompletationDate));
      var bMin = new Date(Date.parse(b.tsk_minCompletationDate));

      return (aMin > bMin) ? 1 : 0;
    });
  }

  ngAfterViewInit(){
    
  }

  checkDate(task){    
    return (new Date(Date.parse(task.tsk_minCompletationDate)) < (new Date())) && (new Date(Date.parse(task.tsk_maxCompletationDate)) > (new Date()));
  }

  async commentTask(task: Task){

    let alert = this.alertCtrl.create({
      title: 'Komentarz',
      inputs: [
        {
          name: 'comment',
          placeholder: 'komentarz ...'
        }
      ],
      buttons: [
        {
          text: 'Anuluj',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Skomentuj',
          handler: data => {            
            
              this.db.object('tasks/' + task.$key).update(
                {
                  tsk_commentary: data.comment
                }
              );

          }
        }
      ]
    });

    alert.present();


  }

  async checkNotification(task : Task){

    this.localNotifications.getIds().then(i => {

      var ids = i as Array<number>;
      var max = Math.max(...i);
      if (ids.length == 0){
        max = 1;
      }
      
      this.globals.makeToast(max);

      
      this.localNotifications.schedule({
        id: max + 1,
        title: "Nowe zadanie",
        text: task.tsk_category,
        trigger: {at: new Date(Date.parse(task.tsk_minCompletationDate)) },
        data: {mydata: "mu hidden message"}
      });

      this.db.object('tasks/' + task.$key)
        .update({ tsk_notifyId: max+1 });

    });
    

  }

  setCompletedStatus(task) {
    this.db.object('users/' + this.globals.user.$key).update(
      {
        usr_points: this.globals.user.usr_points + 1
      }
    );

    this.db.object('tasks/' + task.$key).update(
      {
        tsk_status: 2
      }
    );
  }

  editTask(task : Task){
    this.navCtrl.push(TaskConfigPage, task)
  }

  async deleteTask(task){
    
    this.db.object('tasks/' + task.$key).remove().then(() => {
      this.globals.makeToast("Item removed");
    }, err => {
      this.globals.makeToast(err);
    });
  }

  async showNotifs(){

    await new Promise(resolve => { 

      this.localNotifications.getIds().then(i => {
        this.globals.makeToast(i);
        resolve();
      });
    });
  }

  takeATask(task){
    this.db.object('tasks/' + task.$key).update(
      {
        tsk_usrId: this.globals.user.$key,
        tsk_usrName: this.globals.user.usr_name
      }
    );
  }

  acceptTask(task){
    console.log(task);
    this.db.object('tasks/' + task.$key)
      .update({ tsk_status: 1 });

  }

  refuseTask(task){
    this.db.object('tasks/' + task.$key).remove();

  }

}
