import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { ExpenseService } from '../../../services/expense.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { MatMomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';

import { MAT_DATE_FORMATS ,  DateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';



import { MatDateFormats } from '@angular/material/core';

export const CUSTOM_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatMomentDateModule, // Use this for Moment.js
  ],
  
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.css',
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ],

})
export class AddExpenseComponent {
  // expense = { name: '', amount: 0, date: new Date(), category: '' };
  expenseForm: FormGroup;


  constructor(private fb: FormBuilder, private expenseService: ExpenseService) {
    this.expenseForm = this.fb.group({
      name: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      date: ['', Validators.required],
      category: ['', Validators.required],
    });
  }
  addExpense() {
    this.expenseService.addExpense(this.expenseForm);
  };

  onSubmit() {
    const currentUser = this.expenseService.getCurrentUser();
    if (!currentUser) {
      alert('Session expired. Please log in again.');
      return;
    }
  
    if (this.expenseForm.valid) {
      const expenseData = {
        ...this.expenseForm.value,
        date: new Date(this.expenseForm.value.date).toISOString(),
        userName: currentUser,
      };
      this.expenseService.addExpense(expenseData).subscribe(() => {
        alert('Expense added!');
        this.expenseForm.reset();
      });
    }
  }
  
  
}
