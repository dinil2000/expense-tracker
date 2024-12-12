import { Component, OnInit } from '@angular/core';
import { ApexChart, ApexAxisChartSeries, ApexXAxis, ApexTitleSubtitle ,NgApexchartsModule} from 'ng-apexcharts';
import { ExpenseService } from '../../services/expense.service';
import { AddExpenseComponent } from '../expenses/add-expense/add-expense.component';
import { ExpenseHistoryComponent } from '../expenses/expense-history/expense-history.component';
import { CommonModule } from '@angular/common';

interface Expense {
  name: string;
  amount: number;
  date: string;
  category: string;
  userName: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AddExpenseComponent, ExpenseHistoryComponent,NgApexchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public barChartOptions: any = {
    chart: { type: 'bar', height: 350 },
    series: [],
    xaxis: { categories: [] },
    title: { text: 'Expenses by Category', align: 'center' }
  };

  public pieChartOptions: any = {
    chart: { type: 'pie', height: 350 },
    series: [],
    labels: [],
    title: { text: 'Expense Summary', align: 'center' }
  };

  expenses: Expense[] = [];
  filteredExpenses: Expense[] = [];
  categoryTotals: { [category: string]: number } = {};

  constructor(private expenseService: ExpenseService) {}

  updateCharts(data: any): void {
    const totals = Object.values(data.totals);
    const categories = Object.keys(data.totals);

    // Update Bar Chart
    this.barChartOptions.series = [{ name: 'Expenses', data: totals.length ? totals : [0] }];
    this.barChartOptions.xaxis.categories = categories.length ? categories : ['No Data'];

    // Update Pie Chart
    this.pieChartOptions.series = totals.length ? totals : [1];
    this.pieChartOptions.labels = categories.length ? categories : ['No Data'];
  }

  ngOnInit() {
    
    const currentUser = this.expenseService.getCurrentUser();
    if (!currentUser) {
      alert('Session expired. Please log in again.');
      return;
    }
       // Listen for updates from the ExpenseService
       this.expenseService.getExpenseUpdates().subscribe((expenses) => {
        this.updateCharts({ expenses, totals: this.calculateTotals(expenses) });
      });

    this.expenseService.getExpenses(currentUser).subscribe((data: Expense[]) => {
      this.filteredExpenses = data.filter(expense => expense.userName === currentUser);
      this.calculateCategoryTotals();
      this.loadCharts();
    });
  };

  
  calculateTotals(expenses: any[]): { [category: string]: number } {
    const totals: { [category: string]: number } = {};
    expenses.forEach((expense) => {
      totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    });
    return totals;
  }

  calculateCategoryTotals() {
    this.categoryTotals = {};
    this.filteredExpenses.forEach(expense => {
      if (!this.categoryTotals[expense.category]) {
        this.categoryTotals[expense.category] = 0;
      }
      this.categoryTotals[expense.category] += expense.amount;
    });
  }

  loadCharts() {
    const totals = this.getCategoryTotals();
    const categories = this.getCategoryNames();

    // Update bar chart
    this.barChartOptions.series = [{ name: 'Expenses', data: totals.length ? totals : [0] }];
    this.barChartOptions.xaxis.categories = categories.length ? categories : ['No Data'];

    // Update pie chart
    this.pieChartOptions.series = totals.length ? totals : [1];
    this.pieChartOptions.labels = categories.length ? categories : ['No Data'];
  }

  getCategoryTotals(): number[] {
    return Object.values(this.categoryTotals).map(total => Math.round(total));
  }

  getCategoryNames(): string[] {
    return Object.keys(this.categoryTotals);
  }
}
