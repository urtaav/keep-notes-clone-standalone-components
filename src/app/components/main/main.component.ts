import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { InputComponent } from '../input/input.component';
import { NotesComponent } from '../notes/notes.component';

@Component({
  selector: 'keep-main',
  standalone: true,
  imports: [CommonModule,NavbarComponent,SidebarComponent,InputComponent,NotesComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

}
