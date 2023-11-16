import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { LabelI } from '../interfaces/labels';

@Injectable({
  providedIn: 'root'
})
export class LabelsService {

  private localStorageKey = 'keep-labels';
  private labelsList$ = new BehaviorSubject<LabelI[]>([]);

  constructor() { 
    let labelsStorage = this.getLabelsFromLocalStorage();
    if(labelsStorage) {
      this.labelsList$.next(labelsStorage);
    }
  }

  private getLabelsFromLocalStorage(): LabelI[] {
    const labelsString = localStorage.getItem(this.localStorageKey);
    return labelsString ? JSON.parse(labelsString) : [];
  }

  private saveLabelsToLocalStorage(labels: LabelI[]): void {
    this.labelsList$.next([...labels]);
    localStorage.setItem(this.localStorageKey, JSON.stringify(labels));
  }

  
  getLabels = () => {
    return this.labelsList$.asObservable();
  }

  async add(labelObj: LabelI): Promise<number> {
    try {
      const labels = this.getLabelsFromLocalStorage();
      const newId = labels.length > 0 ? Math.max(...labels.map((label) => label.id ?? 200)) + 1 : 1;
      const newLabel = { ...labelObj, id: newId };
      labels.push(newLabel);
      this.saveLabelsToLocalStorage(labels);
      return newId;
    } catch (error) {
      console.log(error);
      return -1;
    }
  }

  delete(id: number): void {
    try {
      const labels = this.getLabelsFromLocalStorage();
      const updatedLabels = labels.filter((label) => label.id !== id);
      this.saveLabelsToLocalStorage(updatedLabels);
    } catch (error) {
      console.log(error);
    }
  }

  update(object: LabelI, id: number): void {
    if (id !== -1) {
      try {
        const labels = this.getLabelsFromLocalStorage();
        const index = labels.findIndex((label) => label.id === id);

        if (index !== -1) {
          labels[index] = { ...object, id };
          this.saveLabelsToLocalStorage(labels);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  
}
