import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditorState } from './editor-state';
import { MonacoEditorComponent } from './monaco-editor.component';
import { MonacoEditorConfig, MONACO_EDITOR_CONFIG } from './config';

@NgModule({
  imports: [CommonModule],
  declarations: [MonacoEditorComponent],
  exports: [MonacoEditorComponent]
})
export class MonacoEditorModule {
  public static forRoot(config: MonacoEditorConfig = {}): ModuleWithProviders<MonacoEditorModule> {
    EditorState.loadedMonaco = new Promise<void>((resolve: any) => {
      const baseUrl = config.baseUrl || './assets';
      const onGotAmdLoader = () => {
        // Load monaco
        (window as any).require.config({ paths: {vs: `${baseUrl}/monaco/vs`} });
        (window as any).require(['vs/editor/editor.main'], () => {
          if (typeof config.onMonacoLoad === 'function') {
            config.onMonacoLoad((window as any).monaco);
          }
          EditorState.monaco = (window as any).monaco;
          resolve();
        });
      };
      if (!(window as any).require) {
        const loaderScript: HTMLScriptElement = document.createElement('script');
        loaderScript.type = 'text/javascript';
        loaderScript.src = `${baseUrl}/monaco/vs/loader.js`;
        loaderScript.addEventListener('load', onGotAmdLoader);
        document.body.appendChild(loaderScript);
      }
    });

    return {
      ngModule: MonacoEditorModule,
      providers: [
        { provide: MONACO_EDITOR_CONFIG, useValue: config }
      ]
    };
  }
}
