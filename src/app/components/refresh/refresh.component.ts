import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-refresh',
  templateUrl: './refresh.component.html',
  styleUrls: ['./refresh.component.css']
})
export class RefreshComponent implements OnInit {

  constructor(private route : ActivatedRoute , private router : Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params=>{
      if(params.returnUrl)
        this.router.navigate([params.returnUrl])
    })
  }

}
