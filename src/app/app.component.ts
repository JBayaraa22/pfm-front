import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Хувийн санхүүгийн менежер';
  defaultLang = "mn"
  constructor(private translate: TranslateService) {
    let lang = sessionStorage.getItem("lang")
    if(lang)
      translate.setDefaultLang(lang);
    else {
      translate.setDefaultLang(this.defaultLang)
      sessionStorage.setItem("lang" , this.defaultLang)
    }
  }
}
