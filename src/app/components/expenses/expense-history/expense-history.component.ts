import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ExpenseService } from '../../../services/expense.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';  // <-- import MatIconModule

@Component({
  selector: 'app-expense-history',
  standalone: true,
  imports: [CommonModule, MatTableModule, FormsModule,MatIconModule],
  templateUrl: './expense-history.component.html',
  styleUrls: ['./expense-history.component.css'], // Fixed property name
})
export class ExpenseHistoryComponent implements OnInit {
  @Output() filteredData = new EventEmitter<any>(); // Emit filtered data
  @Output() allDataEvent = new EventEmitter<any>(); // Emit all data

  expenses: any[] = []; // All expenses from the service
  filteredExpenses: any[] = []; // Filtered expenses to display
  displayedColumns: string[] = ['name', 'amount', 'date', 'category','actions']; // Columns for the table
  totalAmount: number = 0; // Total amount for filtered expenses
  categoryTotals: { [category: string]: number } = {}; // Totals by category

  
  allfetchedData:boolean=false;
  filteredDataExpense:boolean=true


  // Filter options
  months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString('default', { month: 'long' })
  );
  selectedMonth: number = new Date().getMonth(); // Current month (0-indexed)
  selectedYear: number = new Date().getFullYear(); // Current year
  years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i); // Last 5 years

  constructor(private expenseService: ExpenseService) {
    // this.loadExpenses();
    // console.log("expeeee: ",this.expenses);
    
  }

  // ngOnInit(): void {
  //   this.loadExpenses(); // Load expenses when the component initializes
  // }
  ngOnInit(): void {
    const currentUser = this.expenseService.getCurrentUser();
    if (!currentUser) {
      alert('Session expired. Please log in again.');
      return;
    }
  
    // Load initial expenses
    this.expenseService.getExpenses(currentUser).subscribe((data) => {
      this.expenses = data;
      this.applyFilter(); // Apply initial filter
    });
  
    // Listen for updates
    this.expenseService.getExpenseUpdates().subscribe((updatedExpenses) => {
      this.expenses = updatedExpenses.filter(
        (expense) => expense.userName === currentUser
      );
      this.applyFilter(); // Reapply filters with updated data
    });
  }
  

  // Load expenses from the service
  loadExpenses(): void {
    const currentUser = this.expenseService.getCurrentUser();
    if (!currentUser) {
      alert('Session expired. Please log in again.');
      return;
    }

    this.expenseService.getExpenses(currentUser).subscribe((data: any[]) => {
      // Filter expenses for the current user
      this.expenses = data.filter((expense) => expense.userName === currentUser);

      // Ensure dates are properly converted to Date objects
      this.expenses.forEach((expense) => {
        if (typeof expense.date === 'string') {
          expense.date = new Date(expense.date);
        }
      });

      console.log('Loaded Expenses:', this.expenses); // Debug log
      this.applyFilter(); // Apply initial filter for the current month and year
    });
  }

  // Triggered when the filter changes (month or year selection)
  onFilterChange(): void {
    this.allfetchedData = false; // Reset to indicate we are viewing filtered data
    this.filteredDataExpense = true;   // Indicate filtered data view
    this.applyFilter();         // Apply the filter
      }
//all data
      allData(){
        this.filteredExpenses = [...this.expenses];
        this.calculateTotals();
        this.allfetchedData = true;
        this.filteredDataExpense = false;
        this.allDataEvent.emit({ expenses: this.filteredExpenses, totals: this.categoryTotals }); // Emit all data


        console.log("expeeee: ",this.expenses);
     console.log("Total Amount for All Data:", this.totalAmount);
      }

  // Apply the selected month and year filters
  applyFilter(): void {
    console.log(
      'Filtering data for month:',
      this.selectedMonth,
      'year:',
      this.selectedYear
    );

    // Filter expenses based on selected month and year
    this.filteredExpenses = this.expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      console.log("expenseDate", this.selectedYear);
      
      return (
        expenseDate.getMonth() == this.selectedMonth &&
        expenseDate.getFullYear() == this.selectedYear
      );
    });

    if (this.filteredExpenses.length === 0) {
      console.warn('No data found for the selected month and year.');
    }

    console.log('Filtered Expenses:', this.filteredExpenses);
    this.calculateTotals();
    this.filteredData.emit({ expenses: this.filteredExpenses, totals: this.categoryTotals }); // Emit filtered data
  }
  // Calculate total expenses and totals by category
  calculateTotals(): void {
    this.totalAmount = 0;
    this.categoryTotals = {};

    this.filteredExpenses.forEach((expense) => {
      this.totalAmount += expense.amount;

      // Update category totals
      if (!this.categoryTotals[expense.category]) {
        this.categoryTotals[expense.category] = 0;
      }
      this.categoryTotals[expense.category] += expense.amount;
    });

    console.log('Category Totals:', this.categoryTotals);
    console.log('Total Amount:', this.totalAmount);
  }



  //edit

  onEditExpense(expenseId: string, expense: any): void {
    const updatedName = prompt('Enter new name:', expense.name);
    const updatedAmount = prompt('Enter new amount:', expense.amount.toString());
    const updatedCategory = prompt('Enter new category:', expense.category);
    console.log('Expense ID:', expenseId); // Should log the ID
    console.log('Expense object:', expense); // Should log the full object
  
    if (updatedName && updatedAmount && updatedCategory) {
      // Create a sanitized object to send to the backend
      const updatedExpense = {
        name: updatedName,
        amount: parseFloat(updatedAmount),
        category: updatedCategory,
        date: expense.date, // Ensure the date remains unchanged
      };
  
      // Call the update service
      this.expenseService.updateExpense(expenseId, updatedExpense).subscribe({
        next: () => {
          console.log('Expense updated successfully!');
          this.loadExpenses(); // Refresh the expense list
        },
        error: (err) => {
          console.error('Error updating expense:', err);
          alert('Failed to update expense. Please try again.');
        }
      });
    }
  }
  

  //delete

  onDeleteExpense(id: string): void {
    const confirmDelete = confirm('Are you sure you want to delete this expense?');
    if (confirmDelete) {
      // Call the delete service using _id
      this.expenseService.deleteExpense(id).subscribe({
        next: () => {
          console.log('Expense deleted successfully!');
          this.loadExpenses(); // Refresh the expense list
        },
        error: (err) => {
          console.error('Error deleting expense:', err);
        }
      });
    }
  }
  
  // both edit and delete
  //edit


//  onEditExpense(expense: any): void {
//   const updatedName = prompt('Enter new name:', expense.name);
//   const updatedAmount = prompt('Enter new amount:', expense.amount.toString());
//   const updatedCategory = prompt('Enter new category:', expense.category);

//   if (updatedName && updatedAmount && updatedCategory) {
//     expense.name = updatedName;
//     expense.amount = parseFloat(updatedAmount);
//     expense.category = updatedCategory;

//     // Update the expense via the service (if using a backend API)
//     this.expenseService.updateExpense(expense.id, expense).subscribe(() => {
//       console.log('Expense updated successfully!');
//       this.loadExpenses(); // Refresh the data
//     });
//   }
// };

// //delete

// onDeleteExpense(id: number): void {
//   const confirmDelete = confirm('Are you sure you want to delete this expense?');
//   if (confirmDelete) {
//     this.expenseService.deleteExpense(id).subscribe(() => {
//       console.log('Expense deleted successfully!');
//       this.loadExpenses(); // Refresh the data
//     });
//   }
// }


  
  
}
