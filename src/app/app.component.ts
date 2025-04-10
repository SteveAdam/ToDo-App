import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomeComponent, ],
  template: `
    <div>
    <h1>To-Do App</h1>
    <app-home></app-home>
    </div>
    
    <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent {
  title = 'ToDo-App';
}
