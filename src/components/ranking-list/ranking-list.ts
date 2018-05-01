import { Component } from '@angular/core';

/**
 * Generated class for the RankingListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'ranking-list',
  templateUrl: 'ranking-list.html'
})
export class RankingListComponent {

  text: string;

  constructor() {
    console.log('Hello RankingListComponent Component');
    this.text = 'Hello World';
  }

}
