import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'keep-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  @ViewChild("form23zSaZ") form23zSaZ?: ElementRef<HTMLDivElement>;

  private Shared:SharedService  = inject(SharedService)

  
  closeSideBar = () => { this.Shared.closeSideBar.next(true) };
  refresh = () => window.location.reload();
  view = () => {
    this.Shared.noteViewType.value === 'grid' ? this.Shared.noteViewType.next('list') : this.Shared.noteViewType.next('grid')
  };
  
}
