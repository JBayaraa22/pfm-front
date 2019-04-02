import Chart from 'chart.js'
import { forkJoin } from 'rxjs';
import { Budget } from 'src/app/models/budget';
import { Raw } from 'src/app/models/transaction';
import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { CustomAccount } from 'src/app/models/account';
import { TransactionService } from 'src/app/services/transaction.service';
import { BudgetService } from 'src/app/services/budget.service';
import { CategoryService } from 'src/app/services/category.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  mask = {
    amount : true,
    description : true
  }

  credit_amount : number
  debit_amount :  number

  loading = false
  accounts : CustomAccount[]
  categories : Category[] = []
  categories_total : any[] = []

  budgets : Budget[] = []
  budgets_total : any[] = []

  recent_transactions : Raw[] = []

  FILL_COLORS : string[]
  PEITY_INNER_RADIUS : 50
  PEITY_RADIUS : 80

  constructor(private transactionService : TransactionService , private budgetService : BudgetService , private categoryService : CategoryService , private translate : TranslateService) { }
  
  ngOnInit() {
    let tmpMask = JSON.parse(sessionStorage.getItem("mask"))
    if(tmpMask)
      this.mask = tmpMask
    this.loading = true
    this.FILL_COLORS = [
      '#2196F3' , 
      '#66BB6A' , 
      '#FF7043' , 
      '#EC407A' , 
      '#303F9F' , 
      '#1ABC9C' ,
      '#29B0D0', 
      '#4C6579', 
      '#F57E2E',
      '#C8E0E4',
      '#A6A7AC'
    ]
    const combined = forkJoin(
      this.categoryService.getAllCategories(),
      this.categoryService.getCategoryTotal(),
      this.budgetService.getAllBudgets(),
      this.transactionService.getRecentTransactions(1 , {}),
      this.transactionService.getRawTotal(),
      this.transactionService.getAccountList()
    )

    combined.subscribe(data=>{
      this.categories = data[0]
      this.categories_total = data[1]
      this.budgets = data[2]
      this.recent_transactions = data[3]["results"]
      this.debit_amount = data[4]["debit"]
      this.credit_amount = data[4]["credit"]
      this.accounts = data[5]
      this.categories_total.sort((a ,  b) =>  (a.id > b.id) ? 1 : (b.id > a.id) ? -1 : 0 )
      this.categories.sort((a ,  b) =>  (a.id > b.id) ? 1 : (b.id > a.id) ? -1 : 0 )
      this.initChart()
    })
  }
  getActual(id){
    let actual = 0
    this.categories_total.forEach(category=>{
      if(category.id == id)
        actual = category.actual
    })
    return actual
  }
  checkIfCredit(id){
    let bool = false
    this.categories.forEach(cat=>{
      if(cat.id === id && cat.part === "C")
        bool = true
    })
    return bool
  }
  getAccountNumber(account_id){
    let accnumber = null
    this.accounts.forEach(account => {
      if(account.acct.id === account_id)
        accnumber = account.acct.acct_num
    })
    return accnumber
  }
  initChart(){
    var colors = []
    var labels = ["Ангилагдаагүй гүйлгээ"]
    var data = [0]
    this.categories_total.forEach(color=>{
      colors.push(this.getRandomColor())
    })
    this.categories.forEach(category=>{
      if(category.parent == null && this.getActual(category.id) > 0 && category.part != "C")
        labels.push(this.translate.instant(category.name))
    })
    this.categories_total.forEach(category => {
      if(!this.checkIfCredit(category.id))
        data.push(category.actual)
    });

    var options = {
      responsive : true,
      legend : {
        display : true,
        position : 'bottom'
      },
      title : {
        display : true,
        text : "Ангилалын график"
      },
      animation : {
        animateScale : true,
        animateRotate : true
      }
    }

    var doughnutData = {
      datasets : [{
        data : data , 
        backgroundColor : colors,
        label : 'Зарцуулсан мөнгөн дүн'
      }],
      labels : labels 
    }
    var config = {
      type : 'doughnut',
      data : doughnutData,
      options : options
    }

    var ctx = (document.getElementById('categoryChart') as HTMLCanvasElement).getContext('2d')
    var doughnutChart = new Chart(ctx , config )
    doughnutChart.update()
    this.loading = false
  }
  getCategoryName(id){
    let cat = this.categories.filter(cat=>cat.id == id)[0]
    if(cat === undefined)
      return 'NOT_CATEGORIZED'
    return cat.name
  }

  getBudgetTotal(budgetId){
    return this.budgets_total.filter(budget=>budgetId == budget.id)["total"]
  }
  getPercentage(budget){
    let perc = budget.actual / budget.amount * 100
    return perc > 100 ? 100 : perc
  }
  availableAmount(budget){
    let av = budget.amount - budget.getActual
    return av < 0 ? 0 : av
  }
  getRandomColor(){
    return this.FILL_COLORS[Math.floor(Math.random() * this.FILL_COLORS.length)]
  }
  maskDescription(description: string, visibleDigits: number = 4): string {
    //const visibleDigits = 4;
    let maskedSection = description.slice(0, -visibleDigits);
    let visibleSection = description.slice(-visibleDigits);
    return maskedSection.replace(/./g, 'X') + visibleSection;
  }
  
}