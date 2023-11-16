import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainComponent } from './components/main/main.component';

@Component({
  selector: 'keep-root',
  template: '<keep-main></keep-main>',
  standalone:true,
  imports:[RouterModule,MainComponent]
})
export class AppComponent {
}
