import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    PageBreadcrumbComponent,
  ],
  templateUrl: './users.component.html',
  styles: ``
})
export class UsersComponent {

}
