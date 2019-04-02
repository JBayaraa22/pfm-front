import { Component, OnInit } from '@angular/core';
import { makeToast } from 'src/app/shared/functions';
import { Category, PARTS } from 'src/app/models/category';
import { UserService } from 'src/app/services/user.service';
import { CategoryService } from 'src/app/services/category.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2'
import Chart from 'chart.js'
import { forkJoin } from 'rxjs';
import { getPluralCategory } from '@angular/common/src/i18n/localization';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  date_range: Date[]
  categories: Category[]
  parents : Category[]
  category_list : []
  loading: boolean = false
  addCategoryForm: FormGroup
  editCategoryForm: FormGroup
  selectedCategory: Category = {
    id: 0,
    name: "",
    part: PARTS.INCOME,
    parent: null,
    children : null
  }

  total = []
  constructor(
    private categoryService: CategoryService, 
    private fb: FormBuilder, 
    private userService: UserService,
    private translate : TranslateService) 
  {
    this.addCategoryForm = this.fb.group({
      name: ['', [Validators.required , Validators.maxLength(50) , Validators.minLength(1)] ],
      part: [PARTS.INCOME, [Validators.required]],
      parent: -1,
      icon : ''
    })
    this.editCategoryForm = this.fb.group({
      id : ['', [Validators.required]],
      name: ['', [Validators.required , Validators.maxLength(50) , Validators.minLength(1)] ],
      part: ['', [Validators.required]],
      translate: ['', [Validators.required]],
      parent: '',
      children : '',
      icon : ''
    })
    this.date_range = this.userService.getDateRange()
    this.categories = []
  }

  ngOnInit() {
    this.loading = true
    const combined = forkJoin(
      this.categoryService.getAllCategories()
    )
    combined.subscribe(data=>{
      this.categories = data[0]
      this.setParents()
      this.loading = false

    })    
  }
  selectCategory(child){
    Object.keys(child).forEach(key=>{
      this.selectedCategory[key] = child[key]
    })
  }
  setParents(){
    this.parents = this.main_categories
    for(var i = 0 ; i < this.parents.length ; i++){
      this.parents[i].children = []
        for(var k = 0; k < this.categories.length ; k++){
          if(this.parents[i].id == this.categories[k].parent)
            this.parents[i].children.push(this.categories[k])
        }
      
    }
  }

  get main_categories() : Category[]{
    return this.categories.filter(cat => cat.parent == null)
  }
  deleteCategory(category) {
    Swal.fire({
      title: category.name + ' ангилалыг устгах уу?',
      text: "Үндсэн ангилал бол тухайн ангилалын дэд ангилалууд устана!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Тийм, устга!',
      cancelButtonText: "Үгүй"
    }).then((result) => {
      if (result.value) {
        this.loading = true
        this.categoryService.deleteCategory(category.id).subscribe(data => {
          this.categories.splice(this.categories.indexOf(category) , 1)
          this.categories.forEach(cat => {
            if(cat.parent == category.id)
            this.categories.splice(this.categories.indexOf(cat) , 1)
          });
          makeToast("Амжилттай устгалаа", "success")
          this.refreshsessionStorage()
          this.loading = false
        },
          error => {
            makeToast(error.message, "error")
          })
      }
      this.loading = false
    })
  }
  refreshsessionStorage(){
    sessionStorage.setItem("categories" , JSON.stringify(this.categories))
    this.setParents()
  }
  onSubmit() {
    this.loading = true
    if (this.addCategoryForm.valid) {
      let tmpCat : Category = this.addCategoryForm.value
      if(tmpCat.parent == -1){
        tmpCat.parent = null
      }
      this.categoryService.createCategory(this.addCategoryForm.value).subscribe(data => {
        this.categories = (this.categories.reverse().concat(data)).reverse()
        makeToast("Амжилттай нэмлээ" , "success")
        this.refreshsessionStorage()
        this.loading = false
        this.addCategoryForm.reset()
      }
      ,
      error => {
        this.loading = false
        makeToast(error.message, "error")
      })
    }
    else {
      this.loading = false
      makeToast("Бүх талбарыг зөв бөглөнө үү ?", "error")
    }
  }

  updateCategory(){
    this.loading = true
    this.selectedCategory.children = []
    this.editCategoryForm.setValue(this.selectedCategory)
    let tmpCat = this.editCategoryForm.value
    if(tmpCat.parent == "-1")
      tmpCat.parent = null
    if(this.editCategoryForm.valid){
      this.categoryService.updateCategory(tmpCat).subscribe(data=>{
        let i = this.getCategoryIndex(data.id)
        this.categories[i] = data
        this.refreshsessionStorage()
        this.loading = false

        makeToast("Амжилттай өөрчиллөө" , "success")
      } , error=>{
        makeToast("Алдаа гарлаа" , "error")
        this.loading = false

      })
    }
    else{
      this.loading = false
      makeToast("Талбаруудыг зөв бөглөнө үү" , 'warning')
    }
    this.editCategoryForm.reset()

  }
  getCategoryIndex(id)
  {
    let index = -1
    this.categories.forEach(cat => {
      if(cat.id === id)
      { 
        index = this.categories.indexOf(cat)
        return 
      }
    });
    return index
  }
}
