import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public employees: Employee[];  
  public editEmployee: Employee;
  public deleteEmployee: Employee;

  constructor(private employeeService: EmployeeService) { }

  ngOnInit() {
      this.getEmployees();
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response : Employee[]) => {
        this.employees = response;     
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onOpenModal(mode: string) : void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle','modal');
    if ( mode === 'add') {
      button.setAttribute('data-target','#addEmployeeModal');
    }
    if ( mode === 'edit') {
      button.setAttribute('data-target','#updateEmployeeModal');
    }
    if ( mode === 'delete') {
      button.setAttribute('data-target','#deleteEmployeeModal');
    }
container?.appendChild(button); 
button.click();
  }
  
  public catchEmployee(employee : Employee, mode : string) : void {
    if(mode == 'edit'){
      this.editEmployee = employee;
    }
    if(mode == 'delete') {
      this.deleteEmployee = employee;
    }
    
    
  }


  public onAddEmployee(addForm: NgForm) :void {
    console.log(addForm.value);
    if(addForm.value.imageUrl == "" ) {
        addForm.value.imageUrl = "https://www.bootdey.com/app/webroot/img/Content/avatar/avatar7.png";
        console.log("inside if    "+addForm.value);
    }

    document.getElementById('add-employee-form')?.click();
    this.employeeService.addEmployee(addForm.value).subscribe(
(response: Employee) => {
  console.log(response);
  this.getEmployees();
  addForm.reset();
  
},
(error: HttpErrorResponse) => {
  alert(error.message);
}
    );
  }

  public onUpdateEmployee(employee : Employee) :void {
    console.log(employee);
    this.employeeService.updateEmployee(employee).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public onDeleteEmployee(employee : Employee) : void {
   
    this.employeeService.deleteEmployee(employee.id).subscribe(
      () => {   
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )

  }

  public searchEmployees(key: string) : void {
    const results: Employee[] = [];
    for(const employee of this.employees) {
      if(employee.name.toLowerCase().indexOf(key.toLowerCase()) != -1 || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) != -1 ) {
        results.push(employee);
      }
    }
    
    if(results.length == 0 || !key) {
      this.getEmployees();
    }
    else {
      this.employees = results;
    } 
  }
  
}
