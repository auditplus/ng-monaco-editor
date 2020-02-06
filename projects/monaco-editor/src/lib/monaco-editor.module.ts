import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { editorStateProviderFactory, MONACO_EDITOR_STATE } from './editor-state';
import { MonacoEditorComponent } from './monaco-editor.component';
import { MonacoEditorConfig, MONACO_EDITOR_CONFIG } from './config';

@NgModule({
  imports: [CommonModule],
  declarations: [MonacoEditorComponent],
  exports: [MonacoEditorComponent]
})
export class MonacoEditorModule {
  public static forRoot(config: MonacoEditorConfig = {}): ModuleWithProviders<MonacoEditorModule> {
    return {
      ngModule: MonacoEditorModule,
      providers: [
        {
          provide: MONACO_EDITOR_CONFIG,
          useValue: config
        },
        {
          provide: MONACO_EDITOR_STATE,
          useFactory: editorStateProviderFactory,
          deps: [MONACO_EDITOR_CONFIG]
        }
      ]
    };
  }
}
