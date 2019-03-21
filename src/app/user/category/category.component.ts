import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  selectedCategory : Category
  categories : Category[]
  parent_categories : Category[]
  constructor(private categoryService : CategoryService) { }

  ngOnInit() {
      this.categoryService.getAllCategories().subscribe(data=>{
        this.categories = data
        localStorage.setItem("categories" , JSON.stringify(this.categories))
      })
  }
  selectCategory(category){
    console.log(category)
    this.selectCategory = Object.assign(category)
  }
  formatCategory(){
    this.parent_categories = this.categories.filter(cat => cat.id == null)
  }
}
