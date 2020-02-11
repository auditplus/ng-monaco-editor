import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  forwardRef,
  Inject,
  NgZone,
  Input,
  OnDestroy
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { MonacoEditorConfig, MONACO_EDITOR_CONFIG } from './config';
import { MONACO_EDITOR_STATE, MonacoEditorState } from './editor-state';
import { Subscription, fromEvent } from 'rxjs';

@Component({
  selector: 'ng-monaco-editor',
  template: '<div class="editor-container" #container></div>',
  styles: [`
    :host {
      display: block;
      height: 200px;
    }
    .editor-container {
      width: 100%;
      height: 100%;
    }
  `],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MonacoEditorComponent),
    multi: true
  }]
})
export class MonacoEditorComponent implements OnInit, ControlValueAccessor, OnDestroy {

  value = '';

  private editor: any;

  private editorOptions: any;

  private windowResizeSubscription: Subscription;

  @ViewChild('container', {static: true}) editorContainer: ElementRef;

  @Output() loaded: EventEmitter<any> = new EventEmitter<any>();

  onChanged = (_: any) => {};

  onTouched = () => {};

  @Input('options')
  set options(options: any) {
    this.editorOptions = Object.assign({}, this.config.defaultOptions, options);
    if (this.editor) {
      this.editor.dispose();
      this.initMonaco(options);
    }
  }

  get options(): any {
    return this.editorOptions;
  }

  constructor(
    private zone: NgZone,
    @Inject(MONACO_EDITOR_CONFIG) private config: MonacoEditorConfig,
    @Inject(MONACO_EDITOR_STATE) private editorState: MonacoEditorState
  ) { }

  ngOnInit() {
    this.editorState.loadedMonaco.then(() => {
      const options = (this.options) ? this.options : this.config;
      this.initMonaco(options);
    });
  }

  writeValue(value: any) {
    this.value = value || '';
    // Fix for value change while dispose in process.
    setTimeout(() => {
      if (this.editor) {
        this.editor.setValue(this.value);
      }
    });
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  protected initMonaco(options: any): void {

    const monaco = this.editorState.monaco;
    const hasModel = !!options.model;

    this.editor = monaco.editor.create(this.editorContainer.nativeElement, options);

    if (!hasModel) {
      this.editor.setValue(this.value);
    }

    this.editor.onDidChangeModelContent((e: any) => {
      const value = this.editor.getValue();

      // value is not propagated to parent when executing outside zone.
      this.zone.run(() => {
        this.onChanged(value);
        this.value = value;
      });
    });

    this.editor.onDidBlurEditorWidget(() => {
      this.onTouched();
    });

    if (this.windowResizeSubscription) {
      this.windowResizeSubscription.unsubscribe();
    }
    this.windowResizeSubscription = fromEvent(window, 'resize').subscribe(() => this.editor.layout());

    this.loaded.emit(this.editor);
  }

  ngOnDestroy() {
    if (this.windowResizeSubscription) {
      this.windowResizeSubscription.unsubscribe();
    }
    if (this.editor) {
      this.editor.dispose();
      this.editor = undefined;
    }
  }

}
