import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { User } from 'src/app/models/user';
import { TransactionService } from 'src/app/services/transaction.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  start_date : string
  end_date : string
  currentUser : User
  mask = {
    amount : true,
    description : true
  }
  constructor(private router: Router ) {
    this.currentUser = JSON.parse( sessionStorage.getItem("currentUser"))
    let url = this.router.url
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/blank') {
          this.router.navigate([url]); 
        }
      }
    })
  }

  ngOnInit() {
    let today = new Date()
    let tmpDate = new Date(today.getFullYear() , today.getMonth()+1 , 0)
    this.start_date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-01"
    this.end_date   = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + tmpDate.getDate()
    let dateRange = {
      start_date : this.start_date,
      end_date : this.end_date
    }
    let tmpMask = JSON.parse(sessionStorage.getItem("mask"))
    if(tmpMask)
      this.mask = tmpMask
    sessionStorage.setItem("date_range" , JSON.stringify(dateRange))
    this.loadScript()

  }
  setDateRange(){
    let start  = (document.getElementById("start_date") as HTMLInputElement).value
    let end = (document.getElementById("end_date") as  HTMLInputElement).value
    this.start_date = start
    this.end_date = end
    let dateRange = {
      start_date : start,
      end_date : end
    }
    sessionStorage.setItem("date_range" , JSON.stringify(dateRange))
    this.router.navigate(["/user/blank"] , {queryParams : {returnUrl : this.router.url}})
  }

  setMask(prop){
    this.mask[prop] = !this.mask[prop]
    sessionStorage.setItem("mask" , JSON.stringify(this.mask))
    this.router.navigate(["/user/blank"] ,{queryParams : {returnUrl : this.router.url}})
  }
  logout(){
    Swal.fire({
      title: 'Системээс гарах уу?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Тийм',
      cancelButtonText: "Үгүй"
    }).then((result) => {
      if (result.value) {
        sessionStorage.removeItem('currentUser')
        this.router.navigate(["/login"])
      }
    })
  }
  public loadScript() {
    var dynamicScripts = ["../../../assets/js/script.js" , "../../../assets/js/bracket.js"];        
    var isFound = false;
    var scripts = document.getElementsByTagName("script")
    for (var i = 0; i < scripts.length; ++i) {
        if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes("bracket")) {
            isFound = true;
        }
    }

    if (!isFound) {
        for (var i = 0; i < dynamicScripts .length; i++) {
            let node = document.createElement('script');
            node.src = dynamicScripts [i];
            node.type = 'text/javascript';
            node.async = false;
            node.charset = 'utf-8';
            document.getElementsByTagName('head')[0].appendChild(node);
        }

    }
}
}
