import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { UserTableComponent } from '../../shared/components/tables/user-table/user-table.component';

@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    PageBreadcrumbComponent,
    UserTableComponent,
  ],
  templateUrl: './users.component.html',
  styles: ``
})
export class UsersComponent {

}
