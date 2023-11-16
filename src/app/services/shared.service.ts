import { Injectable, inject } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { NotesService } from "./notes.service";
import { LabelsService } from "./labels.service";
import { NoteI, UpdateKeyI } from "../interfaces/notes";
import { LabelI, LabelModelI } from "../interfaces/labels";
import * as Snackbar from "node-snackbar";
import { createPopper } from '@popperjs/core';

@Injectable({
    providedIn: 'root'
})
export class SharedService {

    private Notes: NotesService = inject(NotesService);
    private Labels: LabelsService = inject(LabelsService);


    constructor(){
        this.get.labels();
        this.get.notes();
    }
    private get = {
        notes: () => {
            this.Notes.getNotes().subscribe({
              next: (result: NoteI[]) => {
                console.log('result getNotes',result)
                this.note.pinned = result.filter(x => x.pinned === true).reverse()
                this.note.unpinned = result.filter(x => x.pinned === false).reverse()
                this.note.all = result.reverse()
              },
              error: error => console.error(error)
            })
          },
          labels: () => {
            this.Labels.getLabels().subscribe({
              next: (result: LabelI[]) => this.label.list = result.reverse(),
              error: error => console.error(error)
            })
          }
      
    };


    closeSideBar = new Subject<boolean>()
    saveNote = new Subject<boolean>()
    closeModal = new Subject<boolean>()
    noteViewType = new BehaviorSubject<'list' | 'grid'>('grid')


    // ? note -------------------------------------------------

    note: any = {
        id: -1,
        pinned: [],
        unpinned: [],
        all: [],
        db: {
            add: (data: NoteI) => this.Notes.add(data),
            update: (data: NoteI) => this.Notes.update(data, this.note.id),
            updateKey: (data: UpdateKeyI) => this.Notes.updateKey(data, this.note.id),
            updateAllLabels: (labelId: number, labelValue: string) => this.Notes.updateAllLabels(labelId, labelValue),
            get: () => this.Notes.get(this.note.id),
            clone: () => this.Notes.clone(this.note.id),
            delete: () => this.Notes.delete(this.note.id),
            trash: () => {
                console.log("trash");
                this.note.db.updateKey({ trashed: true, archived: false })
                this.snackBar({ action: 'trashed', opposite: 'restored' }, { trashed: false }, this.note.id)
            },
        },

    }

    // ? labell -------------------------------------------------

    label: LabelModelI = {
        id: -1,
        list: [],
        db: {
            add: async (data: LabelI) => this.Labels.add(data),
            update: (data: LabelI) => this.Labels.update(data, this.label.id),
            delete: () => this.Labels.delete(this.label.id),
            updateAllLabels: (value) => this.note.db.updateAllLabels(this.label.id, value),
        }
    }

      // ? snakebar (aka toast) --------------------------------------

  snackBar(text: { action: string, opposite: string }, obj: UpdateKeyI, noteId: number) {
    Snackbar.show({
      pos: 'bottom-left',
      text: `Note ${text.action}`,
      actionText: 'Undo',
      duration: 4200,
      onActionClick: () => {
        this.note.id = noteId
        this.note.db.updateKey(obj)
        Snackbar.show({
          pos: 'bottom-left',
          text: `Note ${text.opposite}`,
          duration: 3000,
        })
      }
    })
  }

  
    // ? Tooltip --------------------------------------

    createTooltip(button: HTMLDivElement, tooltipEl: HTMLDivElement) {
        tooltipEl.dataset['isTooltipOpen'] = 'true'
        createPopper(button, tooltipEl)
        //
        let fct = (event: Event) => {
            if (!(tooltipEl as any).contains(event.target)) {
                document.removeEventListener('mousedown', fct);
                tooltipEl.dataset['isTooltipOpen'] = 'false'
            }
        }
        document.addEventListener('mousedown', fct)
    }

    closeTooltip(tooltipEl: HTMLDivElement) {
        tooltipEl.dataset['isTooltipOpen'] = 'false'
    }

}