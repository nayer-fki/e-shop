import { H } from '@angular/cdk/keycodes';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Category } from '../types/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  http=inject(HttpClient);
  constructor() { }

  getCategories(){
    return this.http.get<Category[]>("http://localhost:3000/category");
  }

  getCategoryById(id:string){
    return this.http.get<Category[]>("http://localhost:3000/category/"+id);
  }

  addcategory(name:string){
    return this.http.post("http://localhost:3000/category",{
      name: name,
    });
  }

  updatecategory(id: string, name: string) {
    const url = `http://localhost:3000/category/${id}`; // Ajout du séparateur '/'
    return this.http.put(url, { name });
  }

  deleteCategoryById(id:string){
    return this.http.delete("http://localhost:3000/category/"+id);
  }
  


}
