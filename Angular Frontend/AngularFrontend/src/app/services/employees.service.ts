import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Employee } from '../models/employee.model';
import { AddEmployee } from '../models/addEmployee.model';
import { Position } from '../models/position.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  constructor(private http: HttpClient) {}
  baseApiUrl: string = environment.baseApiUrl;
  notification: boolean = false;
  notificationMessage: string = '';

  /**
   * Gets and returns all employees in the database
   * @returns an array of all employees
   */
  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.baseApiUrl + '/api/employees');
  }

  /**
   * Gets and returns all positions in the database
   * @returns an array of all positions
   */
  getAllPositions(): Observable<Position[]> {
    return this.http.get<Position[]>(this.baseApiUrl + '/api/position');
  }

  /**
   * Takes user selected day(s) and position(s) to find corresponding and available employees
   * for, finds those employees and returns them.
   * @param days - array of days employee(s) need to be available for
   * @param positions - array of positions employee(s) need to be qualified for
   * @returns an array of employee(s) matching available days and positions
   */
  findEmployees(days: string[], positions: string[]): Observable<Employee[]> {
    return this.http.post<Employee[]>(this.baseApiUrl + '/api/employees/find',
      {
        Days: days,
        Positions: positions
      }
    );
  }

  /**
   * Takes a user selected position, finds all employee(s) qualified for that position, and returns them.
   * @param positionTitle - title of position to find employee(s) qualified for
   * @returns an array of employee(s) matching available days and positions
   */
  findEmployeesByQualifiedPosition(positionTitle: string): Observable<Employee[]>{
    return this.http.get<Employee[]>(this.baseApiUrl + '/api/employees/findByQualifiedPosition/' + positionTitle);
  }

  /**
   * Takes a new employee and adds them to the database
   * @param addEmployeeRequest - Object containing the employee's information
   * @returns true if request was successful, false if an error occurred
   */
  addEmployee(addEmployeeRequest: AddEmployee, positions:string[]): Observable<Employee> {
    let data = {employee: addEmployeeRequest, positions: positions};
    return this.http.post<Employee>(this.baseApiUrl + '/api/employees/add', data);


    /*
    this.http.post<Employee>(this.baseApiUrl + '/api/employees/add', addEmployeeRequest)
      .subscribe({
        next: (newEmployee) => {
          for(let position of positions){
            this.getPosition(position)
              .subscribe({
                next: (positionInfo) => {
                  let newPosition: Position = {
                    id: '00000000-0000-0000-0000-000000000000',
                    employeeID: newEmployee.id,
                    title: position,
                    rate: positionInfo.rate,
                  };

                  //test if works without next!!!!!!!!!!!!!!!!!!!!!
                  this.addPosition(newPosition)
                    .subscribe({
                      next: (addedPosition) => {
                        console.log('done.');
                      },
                      error: (error) => {
                        return false;
                      }
                    });
                },
                error: (error) => {
                  return false;
                }
              });
          }
          return newEmployee;
        },
        error: (error) => {
          return false;
        }
      });
    //return true;
    */
  }

  /**
   * Takes a new position and adds it to the database
   * @param addPositionRequest - Object containing the position's information and qualified employee's id
   * @returns an object containing the position's information and qualified employee's id
   */
  addPosition(addPositionRequest: Position): Observable<Position>{
    addPositionRequest.id = '00000000-0000-0000-0000-000000000000';
    return this.http.post<Position>(this.baseApiUrl + '/api/position/add', addPositionRequest);
  }

  /**
   * Takes an employee id, retrieves the employee's information, and returns it
   * @param employeeId - id of the employee to get information of
   * @returns an object containing the employee's information
   */
  getEmployee(employeeId: string): Observable<Employee> {
    return this.http.get<Employee>(this.baseApiUrl + '/api/employees/' + employeeId);
  }

  /**
   * Takes a position title, retrieves the information about the position, and returns it
   * @param title - title of the position
   * @returns an object containing the position information
   */
  getPosition(title: string): Observable<Position> {
    return this.http.get<Position>(this.baseApiUrl + '/api/position/' + title);
  }

  /**
   * Takes a employee id, retrieves all the positions the employee is qualified for, and returns them
   * @param employeeId - id of the employee
   * @returns an array of every position the employee is qualified for
   */
  getEmployeePositions(employeeId: string): Observable<Position[]> {
    return this.http.get<Position[]>(this.baseApiUrl + '/api/position/' + employeeId);
  }

  /**
   * Takes an employee id and new employee information, updates the employee's information in the database,
   * and returns the updated employee
   * @param employeeId - id of the employee to find and update
   * @param updateEmployeeRequest - object containing new employee information to update
   * @returns an object containing the updated employee information
   */
  updateEmployee(employeeId: string, updateEmployeeRequest: Employee): Observable<Employee> {
    return this.http.put<Employee>(this.baseApiUrl + '/api/employees/update/' + employeeId, updateEmployeeRequest);
  }

  /**
   * Takes a position title and new position information, updates the position's information in the database,
   * and returns the updated position
   * @param positionTitle - title of the position to update
   * @param updatePositionRequest - object containing new position information to update
   * @returns an object containing the updated position information
   */
  updatePosition(positionTitle: string, updatePositionRequest: Position): Observable<Position> {
    return this.http.put<Position>(this.baseApiUrl + '/api/position/update/' + positionTitle, updatePositionRequest);
  }

  /**
   * Takes an employee id, finds and deletes the employee from the database, and returns the employee
   * @param employeeId - id of the employee to find and delete
   * @returns an object containing the deleted employee's information
   */
  deleteEmployee(employeeId: string): Observable<Employee> {
    return this.http.delete<Employee>(this.baseApiUrl + '/api/employees/delete/' + employeeId);
  }

  /**
   * Takes a position, finds and deletes that position from the database, and returns the position
   * @param position - object containing the position information to delete
   * @returns an object containing the deleted position's information
   */
  deleteEmployeePosition(position: Position): Observable<Position> {
    return this.http.delete<Position>(this.baseApiUrl + '/api/position/deleteEmployee/' + position.employeeID + '/' + position.title);
  }

  /**
   * Takes a position title, finds and deletes every position with the same title from the database, and returns the position
   * @param positionTitle - title of the position to delete
   * @returns an object containing the deleted position's information
   */
  deletePosition(positionTitle: string): Observable<Position> {
    return this.http.delete<Position>(this.baseApiUrl + '/api/position/delete/' + positionTitle);
  }

  setNotification(message: string) {
    this.notification = true;
    this.notificationMessage = message;
  }

  closeNotification(){
    this.notification = false;
    this.notificationMessage = '';
  }

  getNotification(){
    if(this.notification){
      return this.notificationMessage;
    } else {
      return '';
    }
  }
}
