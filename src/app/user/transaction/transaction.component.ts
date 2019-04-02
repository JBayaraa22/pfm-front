import { Component, OnInit, ViewChild } from '@angular/core';
import { TransactionService } from 'src/app/services/transaction.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { Raw, TRAN_PART_TYPES, TRAN_SRC_TYPES } from 'src/app/models/transaction';
import { makeToast , MODAL_MODE, maskDescription } from 'src/app/shared/functions';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category';
import { CustomAccount } from 'src/app/models/account';
import { TranslateService } from '@ngx-translate/core';

declare var $ : any
@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  maskDescription = maskDescription
  mask = {
    amount : true,
    description : true
  }

  MODAL_MODE = MODAL_MODE
  mode : MODAL_MODE
  
  count : 0
  pageNumber = 1
  batchSize = 30
  number_of_page = 1
  
  loading = false
  
  firstTime = true
  filters : FormGroup
  parents : Category[]
  addTxnForm : FormGroup
  transactions : [Raw[]]
  categories : Category[]
  selectedTransaction: Raw
  accounts : CustomAccount[]
  active_accounts : CustomAccount[] 

  selectize_options = []
  selectize_config = {
    labelField : "label",
    valueField : 'value',
    highlight : false,
    create : false,
    persist : false,
    plugins: ['dropdown_direction', 'remove_button'],
    dropdownDirection: 'down',
    maxItems: 15
  }
  constructor(
    private transactionService : TransactionService ,
    private fb : FormBuilder , private categoryService : CategoryService , 
    private translate: TranslateService) {
    this.addTxnForm = this.fb.group({
      id : 0 ,
      account_id : 0 ,
      amount_mnt : [1, [Validators.required , Validators.min(1)]],
      cpty_account : ["" , [Validators.maxLength(100)]],
      cpty_name : ["" , [Validators.maxLength(100)]],
      deleted : false ,
      description : ["" , [Validators.required , Validators.minLength(4) , Validators.maxLength(500)]],
      tran_category : {} ,
      tran_datetime : '',
      tran_date : ["" , [Validators.required]],
      tran_part : [TRAN_PART_TYPES.INCOME , [Validators.required]],
      tran_src : TRAN_SRC_TYPES.CUSTOM
    })

    this.filters = this.fb.group({
      min_amount : null,
      max_amount : null,
      description : "",
      categories : [[]],
      is_deleted : false,
      tran_part : null,
      accounts : null
    })

    this.selectedTransaction = {
      id : 0,
      account_id : 0,
      amount_mnt : 0,
      cpty_account : "0",
      cpty_name : "",
      deleted : false,
      description : "",
      tran_category : 0,
      tran_date : "",
      tran_part : TRAN_PART_TYPES.INCOME,
      tran_src : TRAN_SRC_TYPES.CUSTOM
    }
    this.parents = []
    this.categories = []
    this.transactions = [[]]
    let tmpMask = JSON.parse(sessionStorage.getItem("mask"))
    if(tmpMask)
      this.mask = tmpMask
  }

  get txn_filters(){
    return this.filters.controls
  }
  get parent_categories() : Category[]{
    return this.categories.filter(cat => cat.parent == null)
  }
  getCategoryName(id){
    return this.categories.filter(cat=>cat.id == id)[0].name
  }
  setFilters(){
    this.firstTime = false
    this.getPage(this.pageNumber , true)
  }
  ngOnInit() {
    this.categories = []
    this.categoryService.getAllCategories().subscribe(data=>{
      this.categories = data
      this.setParents('C')
      this.initSelectize()
    } , error=>{
    })
    this.getPage(this.pageNumber , false)
    this.transactionService.getAccountList().subscribe(data=>{
      this.accounts = data
      this.active_accounts = this.accounts.filter(acc=> acc.acct.active_flg && acc.acct.acct_type === "SBA")
    } , error=>{})
    $('.fc-datepicker').datepicker({
      showOtherMonths: true,
      selectOtherMonths: true,
      numberOfMonths: 1
    });

    
  }

  setParents(part){
    this.parents = []
    this.categories.forEach(cat=>{
      if(part==cat.part && cat.parent == null)
          this.parents.push(cat) 
    })

    for(var i = 0 ; i < this.parents.length ; i++){
      this.parents[i].children = []
      if(part!="" && part == this.parents[i].part)
      {
        for(var k = 0; k < this.categories.length ; k++){
          if(this.parents[i].id == this.categories[k].parent)
            this.parents[i].children.push(this.categories[k])
        }
      }
    }
  }

  getAccountNumber(id){
    if(this.accounts === undefined) return ''
    return this.accounts.filter(acc=> acc.acct.id == id)[0].acct.acct_num
  }
  initSelectize(){
    this.parent_categories.forEach(cat => {
      let tmp = {label : "" , value : 0}
      tmp.label = this.translate.instant(cat.name)
      tmp.value = cat.id 
      this.selectize_options.push(tmp)
     });
     $('[data-toggle="tooltip"]').tooltip();
  }
  selectTransaction(txn , mode){
    this.mode = mode
    Object.keys(txn).map(key=>{
      this.selectedTransaction[key] = txn[key]
    })
  }
  updateTransaction(){
    this.addTxnForm.setValue(this.selectedTransaction)
    if(this.addTxnForm.valid){
      this.transactionService.updateTransaction(this.selectedTransaction).subscribe(data=>{
        this.getPage(this.pageNumber , true)
        makeToast("Амжилттай өөрчиллөө", "success")
        this.addTxnForm.reset()
      } , error=>{
        makeToast("Алдаа гарлаа" , "error")
        this.addTxnForm.reset()
      })
    }
    else{
      makeToast('Талбаруудыг зөв бөглөнө үү' , 'warning')
    }
  }
  deleteTransaction(txn){
    let title = ' Гүйлгээг устгах уу?'
    if(txn.deleted)
      title = ' Гүйлгээг нэмэх үү?'
    Swal.fire({
      title: title,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Тийм',
      cancelButtonText: "Үгүй"
    }).then((result) => {
      if (result.value) {
        this.loading = true
        this.transactionService.deleteTransaction(txn.id , !txn.deleted).subscribe(data=>{
          this.loading = false
          makeToast("Амжилттай өөрчиллөө" , "success")
          this.getPage(this.pageNumber , true)
          
        } , error=>{})
      }
    })
  }
  getPage(pNumber , reload){
    document.body.scrollTop = window.innerHeight
    let pn = this.validatepn(pNumber)
    if(this.transactions[pn] == undefined)
     {
      this.transactions[pn] = []
      this.getData(pn)
    }   
    else if(reload)
      this.getData(pn)
    else 
      this.pageNumber = this.validatepn(pNumber)
  }
  
  getData(pnumber){
    let filter = this.filters.value
    if(this.firstTime)
      filter = {}
    else{
      let categories = ""
      if(filter.categories instanceof Array)
      filter.categories.forEach(e => {
        categories+= e +","
        this.categories.forEach(cat => {
          if(cat.parent == e)
            categories+= cat.id + ","
        });
      });
      filter.categories = categories
    }
    this.loading = true
    this.transactionService.getRecentTransactions(pnumber , filter).subscribe(data=>{   
      this.count = data["count"]
      this.transactions[pnumber] = data["results"]
      this.number_of_page = Math.floor(this.count / this.batchSize)
      if(this.number_of_page < 1) this.number_of_page = 1
      this.pageNumber = pnumber
      this.loading = false
      } , error=>{
        this.loading  = false
        makeToast(error.message , 'error')
        console.log(error.error.message)
      })
  }
  getDateRange(){
    const db = sessionStorage.getItem("date_b")
    const da = sessionStorage.getItem("date_a")
    return { db , da }
  }
  validatepn(pnumber){
    if(pnumber > this.number_of_page)
      return this.number_of_page
    else  if(pnumber < 1)
      return 1
    return pnumber
  }

  onSubmit(){
    this.addTxnForm.removeControl("id")
    let tran_date = (document.getElementById("tran_date") as HTMLInputElement).value
    this.addTxnForm.get("tran_date").setValue(tran_date)
    this.addTxnForm.get("account_id").setValue(parseInt(this.addTxnForm.get("account_id").value))
    this.addTxnForm.patchValue({"tran_datetime" :  this.addTxnForm.get("tran_date").value +" 00:00:00"})

    if(!this.validateDate(this.addTxnForm.controls.tran_date.value))
      this.addTxnForm.controls.tran_date.setErrors({'incorrect' : true})
    else
      this.addTxnForm.controls.tran_date.setErrors(null)

    if(this.addTxnForm.valid){
      this.transactionService.createTransaction(this.addTxnForm.value).subscribe(data=>{
        makeToast("Амжилттай нэмлээ" , "success")
        this.addTxnForm.reset()
      } , error=>{
        makeToast("Алдаа гарлаа" , "error")
      })
    }
  }

  setTranDate(){
    let tran_date = (document.getElementById("tran_date") as HTMLInputElement).value
    this.addTxnForm.get("tran_date").setValue(tran_date)
    this.addTxnForm.patchValue({"tran_datetime" :  this.addTxnForm.get("tran_date").value +" 00:00:00"})
  }
  
  validateDate(string){
    let today = new Date()
    let trdate = new Date(string)
    if(today >= trdate)
      return true
    return false
  }
}
