import { Component, ElementRef, HostListener, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { LabelActionsT } from 'src/app/interfaces/labels';

@Component({
  selector: 'keep-sidebar',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @ViewChild("modalContainer ") modalContainer !: ElementRef<HTMLInputElement>;
  @ViewChild("modal") modal !: ElementRef<HTMLInputElement>;
  @ViewChild("labelInput") labelInput !: ElementRef<HTMLInputElement>;
  @ViewChild("labelError") labelError !: ElementRef<HTMLInputElement>;

  public router: Router = inject(Router);
  public shared: SharedService = inject(SharedService);
  private hasExecutedOnce = false
  ngOnInit(): void {
    this.shared.closeSideBar.subscribe(x => { if (x){
      this.hasExecutedOnce = false;
      this.collapseSideBar();
    }  })
    console.log(this.shared.label.list)
  }
  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event):void  {
    if (window.innerWidth <= 600 && !this.hasExecutedOnce) {
      this.collapseSideBar();
      this.hasExecutedOnce = true;
    }
  }
  // ? modal ----------------------------------------------------------
  openModal() {
    this.modalContainer.nativeElement.style.display = 'block';
    document.addEventListener('mousedown', this.mouseDownEvent)
  }
  hideModal() {
    this.modalContainer.nativeElement.style.display = 'none'
    document.removeEventListener('mousedown', this.mouseDownEvent)
  }
  mouseDownEvent = (event: Event) => {
    let modalEl = this.modal.nativeElement
    if (!(modalEl as any).contains(event.target)) {
      this.hideModal()
    }
  }
  // ? labels ----------------------------------------------------

  addLabel = (el: HTMLInputElement) => {
    console.log('addLabel', el);
    if (!el) return;
    this.shared.label.db.add({ name: el.value }).then(() => { this.labelError.nativeElement.hidden = true; el.value = ''; el.focus() })
      .catch(x => { if (x.name === "ConstraintError") this.labelError.nativeElement.hidden = false; el.focus() });
      
  }

  editLabel = (id: number) => {
    console.log('editLabel')
    this.shared.label.id = id
    let actions: LabelActionsT = {
      delete: () => {
        this.shared.label.db.delete()
        this.shared.label.db.updateAllLabels('')
      },
      update: (value: string) => {
        this.shared.label.db.update({ name: value })
        this.shared.label.db.updateAllLabels(value)
      }
    }
    return actions
  }
  collapseSideBar() {
    document.querySelector('[sideBar]')?.classList.toggle('close')
  }
}
