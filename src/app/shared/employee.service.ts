import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {AngularFirestore} from '@angular/fire/firestore';
import {Employee} from '../model/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  selectedEmployee: Employee;

  constructor(private fireBase: AngularFireDatabase, private firestore: AngularFirestore) {
  }

  employList: AngularFireList<any>;

  getAllEmployee() {
    this.employList = this.fireBase.list('employees');
    return this.employList.snapshotChanges();
  }

  saveEmployee(employee: any) {
    this.employList.push({
      fullName: employee.fullName,
      email: employee.email,
      mobile: employee.mobile,
      city: employee.city,
      gender: employee.gender,
      department: employee.department,
      hireDate: employee.hireDate,
      isPermanent: employee.isPermanent
    });
  }

  updateEmployee(employee: any) {
    this.employList.update(employee.id, employee);
  }

  deleteEmployee(empId: string) {
    this.employList.remove(empId);
  }

  getAll() {
    return this.firestore.collection('employees').snapshotChanges();
  }

  create(employee: Employee) {
    return this.firestore.collection('employees').add(employee);
  }

  update(employee: Employee) {
    console.log('updated value ' + JSON.stringify(employee));
    this.firestore.doc('employees/' + employee.id).set(employee);
  }

  delete(employee: Employee) {
    this.firestore.doc('employees/' + employee.id).delete();
  }

  selectedEmployeeDetails(employee: Employee) {
    this.selectedEmployee = employee;
  }
}
