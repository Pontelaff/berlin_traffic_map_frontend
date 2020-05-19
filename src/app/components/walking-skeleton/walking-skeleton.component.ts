import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-walking-skeleton',
  templateUrl: './walking-skeleton.component.html',
  styleUrls: ['./walking-skeleton.component.css']
})
export class WalkingSkeletonComponent implements OnInit {
  
  output:number = 0;

  constructor(private apiService: ApiService) { }
  //constructor() { }

  ngOnInit(): void {
    let btnTmp = document.getElementById("btn0");
    btnTmp.addEventListener("click", (e:Event) => this.count());

    btnTmp = document.getElementById("btn1");
    btnTmp.addEventListener("click", (e:Event) => this.reset());
  }

  count()
  {
     this.apiService.fetchDataCount().subscribe((data: number)=>{
      console.log(data);
      this.output = data;
     })
  }

  reset()
  {
    this.output = 0; 
  }

}
