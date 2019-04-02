import { Component, OnInit } from '@angular/core';
import { BudgetService } from 'src/app/services/budget.service';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { Budget, FREQ_TYPE } from 'src/app/models/budget';
import { makeToast } from 'src/app/shared/functions';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';
import Swal from 'sweetalert2'
import {  forkJoin } from 'rxjs';
import { delay } from 'rxjs/operators'
import { validateConfig } from '@angular/router/src/config';
@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {

  loading : boolean = false
  addBudgetForm : FormGroup
  editBudgetForm : FormGroup
  selected_budget : Budget

  budgets : Budget[]
  categories : Category[]
  parents : Category[]
  errors : []
  constructor(private budgetService : BudgetService , private fb : FormBuilder , private categoryService : CategoryService) { 
    let today = new Date()
    let tmpDate = new Date(today.getFullYear() , today.getMonth()+1 , 0)
    this.addBudgetForm =  this.fb.group({
      name : ['' , [Validators.required]],
      freq : FREQ_TYPE.MONTH,
      amount :[1 , [Validators.required , Validators.min(1)]],
      repeat : false,
      start_date : [today.getFullYear() + "-" + (today.getMonth() + 1) + "-01" , [Validators.required]],
      end_date :  today.getFullYear() + "-" + (today.getMonth() + 1) + "-"+tmpDate.getDate(),
      category_id : -1,
      actual : 0
    })
    this.editBudgetForm =  this.fb.group({
      id : [0 , [Validators.required]],
      name : ['' , [Validators.required]],
      freq : FREQ_TYPE.MONTH,
      amount :[1 , [Validators.required , Validators.min(1)]],
      repeat : false,
      start_date : today.getFullYear() + "-" + (today.getMonth() + 1) + "-01",
      end_date :  today.getFullYear() + "-" + (today.getMonth() + 1) + "-"+tmpDate.getDate(),
      category_id : -1,
      actual : 0
    })
    
    this.selected_budget = {
      id : -1,
      name : '',
      freq : FREQ_TYPE.MONTH,
      amount : 0,
      repeat : false,
      start_date : today.getFullYear() + "-" + (today.getMonth() + 1) + "-01",
      end_date :  today.getFullYear() + "-" + (today.getMonth() + 1) + "-"+tmpDate.getDate(),
      category_id : -1,
      actual : 0
    }
    this.categories = []
    this.budgets = []
  }

  ngOnInit() {
    this.loading = true
    const joined_requests = forkJoin(
      this.categoryService.getAllCategories(),
      this.budgetService.getAllBudgets().pipe(delay(500))
    )
    joined_requests.subscribe(data=>{
      this.categories = data[0]
      this.budgets = data[1]
      this.loading = false
    })
  }

  getCategoryName(id){
    return this.categories.filter(cat=>cat.id == id)[0].name
  }
  get parent_categories() : Category[]{
    return this.categories.filter(cat => cat.parent == null)
  }

  isExceeded(budget){
    let perc = Math.floor(budget.actual / budget.amount * 100)
    if(perc >= 100)
      return true
    return false
  }

  getUsage(budget){
    let perc = Math.floor(budget.actual / budget.amount * 100)
    if(perc >= 100)
      return 100
    return perc
  }
  onSubmit(){
    let start_date = (document.getElementById("add_budget_start_date") as HTMLInputElement).value
    let end_date = (document.getElementById("add_budget_end_date") as HTMLInputElement).value
    this.addBudgetForm.get("start_date").setValue(start_date)
    this.addBudgetForm.get("end_date").setValue(end_date)
    
    if(!this.validateDates(this.addBudgetForm.controls.start_date.value , this.addBudgetForm.controls.end_date.value ))
    this.addBudgetForm.controls.start_date.setErrors({'incorrect' : true})
    else
    this.addBudgetForm.controls.start_date.setErrors(null)
    if(this.addBudgetForm.valid){
      this.loading = true
      let tmpBudget : Budget = this.addBudgetForm.value
      if(tmpBudget.freq == FREQ_TYPE.CUSTOM)
        tmpBudget.repeat = false
      else 
        tmpBudget.repeat = true
      this.budgetService.createBudget(tmpBudget).subscribe(data=>{
        this.budgets.push(data)
        this.updateBudgetsList()
        makeToast("Амжилттай нэмлээ " , "success")
        this.loading = false
      } , error=>{
        makeToast(error.message , "error")
        this.loading = false
      })
    }
    else {
     makeToast("Бүх талбаруудыг зөв бөглөнө үү " , "warning")
     this.loading= false
    }
  }

  validateDates(start , end){
    let _start = new Date(start)
    let _end = new Date(end)
    let today = new Date()
    let tmpDate = new Date(_end.getFullYear() , _end.getMonth()+1 , 0)
    if(_start.getDate() != 1)
      return false
    if(_end.getDate() != tmpDate.getDate())
      return false
    if(_start > _end)
      return false
    if(today >= start)
      return false
    return true
  }
  setDate(type){
    if(type==='start'){
      let start_date = (document.getElementById("add_budget_start_date") as HTMLInputElement).value
      this.addBudgetForm.get("start_date").setValue(start_date)
    }
    else{
      let end_date = (document.getElementById("add_budget_end_date") as HTMLInputElement).value
      this.addBudgetForm.get("end_date").setValue(end_date)
    }
  }
  selectBudget(budget){
    Object.keys(budget).map(key=>{
      this.selected_budget[key] = budget[key]
    })
  }

  updateBudget(){
    this.editBudgetForm.setValue(this.selected_budget)
    if(this.selected_budget.freq == FREQ_TYPE.CUSTOM)
      this.selected_budget.repeat = false
    else 
      this.selected_budget.repeat = true
    if(this.editBudgetForm.valid){
      this.budgetService.updateBudget(this.selected_budget).subscribe(data=>{
          this.budgets.map((budget , index)=>{
            if(budget.id == this.selected_budget.id){
              this.budgets[index] = this.selected_budget
              this.updateBudgetsList()
            }
          })
          makeToast("Амжилттай өөрчиллөө" , "success")
      } , error=>{
        makeToast(error.message , "error")

      })
    }
    else {
      makeToast("Бүх талбарыг зөв бөглөнө үү." , "warning")
    }
  }

  deleteBudget(budget){
    Swal.fire({
      title: '"' +budget.name + '" төсвийг устгах уу?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Тийм, устга!',
      cancelButtonText: "Үгүй"
    }).then((result) => {
      if (result.value) {
        this.loading = true
        this.budgetService.deleteBudget(budget.id).subscribe(data=>{
          this.budgets.splice(this.budgets.indexOf(budget) , 1)
          makeToast("Амжилттай устгалаа","success") 
          this.loading = false
        } , error=>{
          makeToast(error.message,"error")
          this.loading = false
        })
      }
    })
    
  }
  updateBudgetsList(){
    this.budgetService.getAllBudgets().subscribe(data=>{
      this.budgets = data
    })
  }
}
