import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { NoteI, UpdateKeyI } from '../interfaces/notes';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  private localStorageKey = 'keep-notes';

  private notesList$ = new BehaviorSubject<NoteI[]>([]);

  constructor() { 
    let notesStorage = this.getNotesFromLocalStorage();
    if(notesStorage) {
      this.notesList$.next(notesStorage);
    }
  }

  private getNotesFromLocalStorage(): NoteI[] {
    const notesString = localStorage.getItem(this.localStorageKey);
    return notesString ? JSON.parse(notesString) : [];
  }

  private saveNotesToLocalStorage(notes: NoteI[]): void {
    this.notesList$.next([...notes]);
    localStorage.setItem(this.localStorageKey, JSON.stringify(notes));
  }

  getNotes = () => {
    return this.notesList$.asObservable();
  }


  async add(noteObj: NoteI): Promise<number> {
    try {
      const notes = this.getNotesFromLocalStorage() ;
      const newId = notes.length > 0 ? Math.max(...notes.map((note) => note.id ?? 100)) + 1 : 1;
      const newNote = { ...noteObj, id: newId };
      notes.push(newNote);
      this.saveNotesToLocalStorage(notes);
      return newId;
    } catch (error) {
      console.log(error);
      return -1;
    }
  }

  update(object: NoteI, id: number): void {
    if (id !== -1) {
      try {
        const notes = this.getNotesFromLocalStorage();
        const index = notes.findIndex((note) => note.id === id);
        if (index !== -1) {
          notes[index] = { ...object, id };
          this.saveNotesToLocalStorage(notes);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  updateKey(object: UpdateKeyI, id: number): void {
    if (id !== -1) {
      try {
        const notes = this.getNotesFromLocalStorage();
        const index = notes.findIndex((note) => note.id === id);
  
        if (index !== -1) {
          // Actualizar la nota con los nuevos datos de UpdateKeyI
          notes[index] = { ...notes[index], ...object };
          this.saveNotesToLocalStorage(notes);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  
  async get(id: number): Promise<NoteI> {
    if (id !== -1) {
      const notes = this.getNotesFromLocalStorage();
      const noteData = notes.find((note) => note.id === id);
      return noteData || ({} as NoteI);
    } else {
      return {} as NoteI;
    }
  }
  async clone(id: number): Promise<void> {
    if (id !== -1) {
      try {
        const notes = this.getNotesFromLocalStorage();
        const clonedNote = notes.find((note) => note.id === id);

        if (clonedNote) {
          // Eliminar el ID existente para que se genere uno nuevo al agregar la nota clonada
          delete clonedNote.id;

          // Agregar la nota clonada
          await this.add(clonedNote);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  delete(id: number): void {
    if (id !== -1) {
      try {
        const notes = this.getNotesFromLocalStorage();
        const updatedNotes = notes.filter((note) => note.id !== id);
        console.log("notas now",notes);
        console.log("notas updatedNotes",updatedNotes);
        // Actualizar la lista de notas en el localStorage sin la nota eliminada
        this.saveNotesToLocalStorage(updatedNotes);
      } catch (error) {
        console.log(error);
      }
    }
  }
  updateAllLabels(labelId: number, labelValue: string): void {
    try {
      const notes = this.getNotesFromLocalStorage();
  
      notes.forEach((note) => {
        const labelIndex = note.labels.findIndex((label) => label.id === labelId);
  
        if (labelIndex !== -1) {
          if (labelValue === '') {
            // Eliminar la etiqueta si labelValue está vacío
            note.labels.splice(labelIndex, 1);
          } else {
            // Actualizar el nombre de la etiqueta
            note.labels[labelIndex].name = labelValue;
          }
        }
      });
  
      this.saveNotesToLocalStorage(notes);
    } catch (error) {
      console.log(error);
    }
  }
  
}
