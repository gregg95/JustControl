import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { RegisterPage } from '../pages/register/register';
import { GooglePlus } from '@ionic-native/google-plus';
import { MainPage } from '../pages/main/main';
import { UserConfigPage } from '../pages/user-config/user-config';
import { AboutPage } from '../pages/about/about';
import { CommonExpensesPage } from '../pages/common-expenses/common-expenses';
import { SettingsPage } from '../pages/settings/settings';
import { RankingPage } from '../pages/ranking/ranking';
import { TasksHistoryPage } from '../pages/tasks-history/tasks-history';
import { FlatConfigPage } from '../pages/flat-config/flat-config';
import { Globals } from './Globals';
import { TaskConfigPage } from '../pages/task-config/task-config';
import { TasksListComponent } from '../components/tasks-list/tasks-list';

const firebaseConfig = {
  apiKey: "AIzaSyCpJ_KAdkIpjqwcE6SNcea4jCfiZ1juzWM",
  authDomain: "justcontrol-ab259.firebaseapp.com",
  databaseURL: "https://justcontrol-ab259.firebaseio.com",
  projectId: "justcontrol-ab259",
  storageBucket: "justcontrol-ab259.appspot.com",
  messagingSenderId: "426681299685"
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    MainPage,
    UserConfigPage,
    AboutPage,
    CommonExpensesPage,
    SettingsPage,
    RankingPage,
    TasksHistoryPage,
    FlatConfigPage,
    TaskConfigPage,
    TasksListComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    MainPage,
    UserConfigPage,
    AboutPage,
    CommonExpensesPage,
    SettingsPage,
    RankingPage,  
    TasksHistoryPage,
    FlatConfigPage,
    TaskConfigPage
  ],
  providers: [
    GooglePlus,
    StatusBar,
    SplashScreen,
    Globals,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
