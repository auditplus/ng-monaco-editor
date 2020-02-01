import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MonacoEditorService {

  onLoaded: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }
}
