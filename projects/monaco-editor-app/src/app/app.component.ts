import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'monaco-editor-app';

  editorOptions = {theme: 'vs-dark', language: 'html'};
  code = 'function x() {\nconsole.log("Hello world!");\n}';
}
