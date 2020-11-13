USE employeetracker_DB;

-- department --
INSERT INTO department (id , dept_name)
VALUES (1, "Human Resources");

INSERT INTO department (id , dept_name)
VALUES (2, "Sales");

INSERT INTO department (id , dept_name)
VALUES (3, "Customer Experience");

INSERT INTO department (id , dept_name)
VALUES (4, "Marketing");

INSERT INTO department (id , dept_name)
VALUES (5, "IT");

-- role --
INSERT INTO role (id, title, salary, department_id)
VALUES (1, "HR Coordinator", 60000, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (2, "HR Expert", 75000, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (3, "Sales Manager", 80000, 2);

INSERT INTO role (id, title, salary, department_id)
VALUES (4, "Sales Coordinator", 60000, 2);

INSERT INTO role (id, title, salary, department_id)
VALUES (5, "Customer Service Manager", 65000, 3);

INSERT INTO role (id, title, salary, department_id)
VALUES (6, "Account Manager", 70000, 3);

INSERT INTO role (id, title, salary, department_id)
VALUES (7, "Sr Marketing Manager", 85000, 4);

INSERT INTO role (id, title, salary, department_id)
VALUES (8, "Social Media Manager", 80000, 4);

INSERT INTO role (id, title, salary, department_id)
VALUES (9, "IT Coordinator", 75000, 5);

INSERT INTO role (id, title, salary, department_id)
VALUES (10, "IT Manager", 125000, 5);

-- employee --

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "Reagan", "Dunker", 3, null);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (2, "Celia", "Glenn", 2, null);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (3, "Han", "Weiner", 6, null);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (4, "Jodi", "Geise", 10, null);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (5, "Maye", "Alvear", 7, null);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (6, "Hassan", "Heywood", 4, 1);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (7, "Joaqin", "Cast", 8, 5);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (8, "Michele", "Mcfadin", 1, 2);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (9, "Jong", "Brisker", 9, 4);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (10, "Brigitte", "Osteen", 5, 3);