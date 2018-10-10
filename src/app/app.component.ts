import { Component, OnInit } from '@angular/core';
import { User } from './core/domain/customer';
import { CustomersService } from './services/customers.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'app';
  user: User;
  users: [User];
  loading: boolean;
  selectedRow: number;

  constructor( private dataService: CustomersService ) {}

  ngOnInit(): void {
    this.loading = true;
    this.loadUsers();
  }

  private loadUsers() {
    this.dataService.getCustomers().subscribe(
      (response => { this.users = response;
      }),
      (error) => console.log('Error happened' + error),
      () => { console.log('the subscription is completed'); this.loading = false; } );
  }

  private rowSelected(itemSelected: any, row: number) {
    this.user = itemSelected;
    this.selectedRow = row;
  }
}
