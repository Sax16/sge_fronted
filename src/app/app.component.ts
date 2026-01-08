import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
import { register } from 'swiper/element';
import { registerLocaleData } from '@angular/common';
import localeEspe from '@angular/common/locales/es-PE';

registerLocaleData(localeEspe)

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Angular Ecommerce Dashboard | TailAdmin';
}
