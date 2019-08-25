import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EmployeeService} from '../../shared/employee.service';
import {Employee} from '../../model/employee';
import {DepartmentService} from '../../shared/department.service';
import {Department} from '../../model/department';
import {NotificationService} from '../../shared/notification.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  providers: [DepartmentService]
})
export class EmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employeeModel: Employee;
  departmentList: Department[];

  constructor(private formBuilder: FormBuilder, private employeeService: EmployeeService,
              private departmentService: DepartmentService, private notificationService: NotificationService,
              private dialogRef: MatDialogRef<EmployeeComponent>, @Inject(MAT_DIALOG_DATA) public data: Employee) {
  }

  ngOnInit() {
    this.employeeForm = this.formBuilder.group({
      id: [null],
      fullName: ['', Validators.compose(
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      mobile: ['', Validators.compose([Validators.required, Validators.minLength(9)])],
      city: ['', Validators.required],
      gender: ['1'],
      department: ['', Validators.required],
      hireDate: ['', Validators.required],
      isPermanent: [false]
    });
    this.employeeService.getAll();
    this.loadDepartmentList();

    // when click the update button
    if (this.data) {
      this.employeeForm.setValue({
        id: this.data.id,
        fullName: this.data.fullName,
        email: this.data.email,
        mobile: this.data.mobile,
        city: this.data.city,
        gender: this.data.gender,
        department: this.data.department,
        hireDate: new Date(this.data.hireDate.seconds),
        isPermanent: this.data.isPermanent
      });
      const date = new Date(this.data.hireDate.seconds);
      console.log('Current date ' + date.toString());
    }
    console.log('Selected data' + JSON.stringify(this.data));
  }

  loadDepartmentList() {
    this.departmentService
      .getDepartments()
      .subscribe(actionArray => {
        this.departmentList = actionArray.map(item => {
          return {
            id: item.payload.doc.id,
            ...item.payload.doc.data()
          } as Department;
        });
      });
  }

  get formControls() {
    return this.employeeForm.controls;
  }

  onClear() {
    this.employeeForm.reset();
    this.initializeForm();
  }

  initializeForm() {
    this.employeeForm.setValue({
      id: null,
      fullName: '',
      email: '',
      mobile: '',
      city: '',
      gender: '1',
      department: '',
      hireDate: '',
      isPermanent: false
    });
  }

  onSubmit() {
    this.employeeModel = this.employeeForm.value;
    if (this.employeeForm.valid) {
      if (this.data) {
        this.employeeService.update(this.employeeModel);
      } else {
        this.employeeService.create(this.employeeModel);
      }
      this.onClear();
      this.notificationService.successMessage('Employee added Successfully...!!!');
      this.onClose();
    }
  }

  onClose() {
    this.onClear();
    this.dialogRef.close();
  }
}
