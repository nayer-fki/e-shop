import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Brand } from '../../types/brand';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor() { }
  http=inject(HttpClient);
  

  getBrands(){
    return this.http.get<Brand[]>("http://localhost:3000/brand");
  }

  getBrandById(id:string){
    return this.http.get<Brand[]>("http://localhost:3000/brand/"+id);
  }

  addBrand(name:string){
    return this.http.post("http://localhost:3000/brand",{
      name: name,
    });
  }

  updateBrand(id: string, name: string) {
    const url = `http://localhost:3000/brand/${id}`; // Ajout du séparateur '/'
    return this.http.put(url, { name });
  }

  deleteBrandById(id:string){
    return this.http.delete("http://localhost:3000/brand/"+id);
  }
}
