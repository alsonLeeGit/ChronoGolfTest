import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import customersCollection from '../../../../assets/data/customers.json';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  @Input() user: any = {};
  searchResults: Array<any> = [];
  resultsInfo = {};
  loading: boolean = true;
  userInfoForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.user = {};

    // note have added form validation in case this move forward to require Adding Users using same UI
    this.userInfoForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.minLength(7)]],
      phone: ['', [Validators.required ]],
      memberNo: ['', Validators.minLength(1)]
    });
  }

  /**
   * PUBLIC
   */

  onUserChange(attribute) {
    let value = this.user[attribute];
    console.log({ value, user: this.user });
    if (value) {
      this.searchUser(attribute, value);
    } else {
      this.closeResults();
    }
  }

  resetUser() {
    this.user = {};
  }

  closeResults() {
    this.searchResults = [];
  }

  setUser(user) {
    this.user = user;
    this.closeResults();
  }

  /**
   * PRIVATE
   */

  private hasMinimumOfCharacters(attribute, value) {
    if (attribute == 'email') {
      return value.length >= 5;
    } else if (attribute == 'memberNo') {
      return value.length >= 1;
    } else if (attribute == 'firstName') {
      return value.length >= 5;
    } else if (attribute == 'phone') {
      return value.length >= 3;
    } else {
      return value.length >= 3;
    }
  }

  private searchUser(prop, value) {
    const deferred = new Promise(async (resolve, reject) => {
      if (this.hasMinimumOfCharacters(prop, value)) {
        console.log('SEARCH USER', prop, value);

        let usersFound = [];
        usersFound = customersCollection.filter(
          item =>
            item[prop] &&
            item[prop]
              .toString()
              .toLowerCase()
              .indexOf(value) != -1
        );

        if (prop === 'email' && usersFound.length === 1) {
          this.setUser(usersFound[0]);
        } else {
          this.searchResults = usersFound;
          this.setResultsInfo();
        }

        setTimeout(() => {
          this.loading = false;
          resolve(usersFound);
        }, 500);
      } else {
        resolve();
      }
    });

    return deferred;
  }

  private setResultsInfo() {
    this.resultsInfo = {
      length: this.searchResults.length
    };
  }
}
