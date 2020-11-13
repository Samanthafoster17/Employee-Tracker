const mysql = require("mysql");
const inquirer = require("inquirer");
let roleArr = [];
let mgrArr = [];
let emplArr = [];
let deptArr = [];
const cTable = require("console.table");
const connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "password123",
    database: "employeeTracker_DB"
});

const startMenu = [
    {
        name: "options",
        type: "list",
        message: "Please choose an option",
        choices: ["View All Employees",
            "View All Roles",
            "View All Departments",
            "View All Managers",
            "View All Employees By Department",
            "View All Employees By Manager",
            "View All Employees By Role",
            "Add Employee",
            "Add Role",
            "Add Department",
            "Remove Employee",
            "Remove Department",
            "Remove Role",
            "Update Employee Role",
            "Update Employee Manager",
            "View Utilized Budget Of Department",
            "Exit"
        ]
    }
]

connection.connect(function (err) {
    if (err) throw err;
    init();
});



function init() {
    inquirer.prompt(startMenu).then((response) => {
        switch (response.options) {
            case "View Employee":
                viewEmployee();
                break;

            case "View All Employees":
                viewAll();
                break;
            case "View All Departments":
                viewAllDept();
                break;
            case "View All Roles":
                viewAllRole();
                break;
            case "View All Managers":
                viewAllMngr();
                break;
            case "View All Employees By Department":
                viewByDept();
                break;
            case "View All Employees By Manager":
                viewByMngr();
                break;
            case "View All Employees By Role":
                viewByRole();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Add Department":
                addDept();
                break;
            case "Add Role":
                addRole();
                break;
            case "Remove Employee":
                removeEmpl();
                break;
            case "Remove Department":
                removeDept();
                break;
            case "Remove Role":
                removeRole();
                break;
            case "Update Employee Role":
                updateRole();
                break;
            case "Update Employee Manager":
                updateMngr();
                break;
            case "View Utilized Budget Of Department":
                viewBudgt();
                break;    
            case "Exit":
                connection.end();
                break;
            default:
                connection.end();
                break;
        }
    })

}



function viewAll() {
    console.log("displaying all employees...\n");
    connection.query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title,
        department.dept_name AS department,role.salary,CONCAT(a.first_name, " ", a.last_name) AS manager
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee a ON a.id = employee.manager_id`,
        function (err, res) {
            if (err) throw err;
            console.table(res);
            init();
        }
    );
}


function viewAllDept() {
    console.log("displaying all departments...\n");
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        init();
    })
}

function viewByDept() {
    console.log('displaying all employees by department...\n');
    connection.query(
        `SELECT employee.id, employee.first_name, employee.last_name, department.dept_name FROM employee
        INNER JOIN role ON employee.role_id = role.id
        INNER JOIN department ON role.department_id = department.id
        ORDER BY department.dept_name ASC`,
        function (err, res) {
            if (err) throw err;
            console.table(res);
            init();
        }
    )
}

function viewByRole() {
    console.log('displaying all employees by role...\n');
    connection.query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.dept_name FROM employee 
           INNER JOIN role ON employee.role_id = role.id
           INNER JOIN department ON role.department_id = department.id 
           ORDER BY role.title ASC`,
        function (err, data) {
            if (err) throw err;
            console.table(data);
            init();
        }
    )

}

function viewByMngr() {
    console.log("displaying all employees by manager...\n");
    connection.query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title,
        department.dept_name AS department,role.salary,CONCAT(a.first_name, " ", a.last_name) AS manager
        FROM employee
        INNER JOIN role ON employee.role_id = role.id
        INNER JOIN department ON role.department_id = department.id
        INNER JOIN employee a ON a.id = employee.manager_id 
        ORDER BY manager ASC`,
        function (err, res) {
            if (err) throw err;
            console.table(res);
            init();
        }
    );
    }



function viewAllMngr() {
    console.log("displaying all managers...\n");
    connection.query(`SELECT * FROM employee WHERE employee.id IN (SELECT manager_id FROM employee) ORDER BY Id`, function (err, res) {
        if (err) throw err;
        let viewMgrArr = [];
        for (i = 0; i < res.length; i++) {
            viewMgrArr.push({Managers: res[i].first_name + " " + res[i].last_name,
                         Id: res[i].id});
        }
        console.table(viewMgrArr);
        init();
    })
}

function viewAllRole() {
    console.log("displaying all roles...\n");
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        console.table(res);
        init();
    })
}


function addEmployee() {

    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;

        for (i = 0; i < res.length; i++) {
            roleArr.push(res[i].title);
        }

        connection.query("SELECT * FROM employee", function (err, result) {

            for (i = 0; i < result.length; i++) {
                mgrArr.push(result[i].first_name + " " + result[i].last_name);
            }
            inquirer
                .prompt([
                    {
                        name: "first_name",
                        type: "input",
                        message: "Enter employee's first name"
                    },
                    {
                        name: "last_name",
                        type: "input",
                        message: "Enter employee last name"
                    },
                    {
                        name: "role",
                        type: "list",
                        message: "Choose employee role",
                        choices: roleArr
                    },
                    {
                        name: "manager",
                        type: "list",
                        message: "Choose employee's manager",
                        choices: mgrArr
                    }
                ])
                .then(function (answer) {

                    let role = res.find(function (role) {
                        return role.title === answer.role
                    })

                    let manager = result.find(function (manager) {
                        return (manager.first_name + " " + manager.last_name) === answer.manager
                    })
                    // 
                    console.log(role.id);
                    connection.query(
                        "INSERT INTO employee SET ?",
                        {
                            first_name: answer.first_name,
                            last_name: answer.last_name,
                            role_id: role.id,
                            manager_id: manager.id,

                        },
                        function (err) {
                            if (err) throw err;
                            console.log("Your employee was added successfully!");
                            init();
                        })
                })
        })



    })
}

function addRole() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;


        connection.query("SELECT * FROM department", function (err, result) {
            let deptArr = [];
            for (i = 0; i < result.length; i++) {
                deptArr.push(result[i].dept_name + " " + result[i].id);
            }
            inquirer
                .prompt([
                    {
                        name: "title",
                        type: "input",
                        message: "Enter the role title"
                    },
                    {
                        name: "salary",
                        type: "input",
                        message: "Enter the role salary"
                    },
                    {
                        name: "dept",
                        type: "list",
                        message: "Choose the department for this role",
                        choices: deptArr

                    }
                ])
                .then(function (answer) {


                    let dept = result.find(function (dept) {
                        return (dept.dept_name + " " + dept.id) === answer.dept
                    })
                    connection.query(
                        "INSERT INTO role SET ?",
                        {
                            title: answer.title,
                            salary: answer.salary,
                            department_id: dept.id,


                        },
                        function (err) {
                            if (err) throw err;
                            console.log("Your role was added successfully!");
                            init();
                        })
                })
        })
    })
}

function addDept() {
    connection.query("SELECT * FROM department", function (err, result) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "deptName",
                    type: "input",
                    message: "Enter the department name"
                }
            ])
            .then(function (answer) {

                connection.query(
                    "INSERT INTO department SET ?",
                    {
                        dept_name: answer.deptName

                    },
                    function (err) {
                        if (err) throw err;
                        console.log("Your department was added successfully!");
                        init();
                    })
            })
    })
}



function updateRole() {

    connection.query("SELECT * FROM employee", function (err, res) {
        for (i = 0; i < res.length; i++) {
            emplArr.push(res[i].first_name + " " + res[i].last_name);
        }

        connection.query("SELECT * FROM role", function (err, data) {
            if (err) throw err;
            for (i = 0; i < data.length; i++) {
                roleArr.push(data[i].title);
            }


            inquirer
                .prompt([
                    {
                        name: "updEmpl",
                        type: "list",
                        message: "Which employee would you like to update?",
                        choices: emplArr
                    },

                    {
                        name: "updRole",
                        type: "list",
                        message: "Choose employee's new role",
                        choices: roleArr
                    }


                ])
                .then(function (answer) {
                    let updEmpl = res.find(function (updEmpl) {
                        return (updEmpl.first_name + " " + updEmpl.last_name) === answer.updEmpl
                    });

                    let updRole = data.find(function (updRole) {
                        return updRole.title === answer.updRole 
                    
                    });



                    connection.query(
                        `UPDATE employee SET role_id = ?
                        WHERE id = (SELECT id FROM(SELECT id FROM employee WHERE CONCAT(first_name, " ", last_name) = ?)AS NAME)`,
                        [updRole.id, answer.updEmpl],
                        function (err) {
                            if (err) throw err;
                        
                            console.log("Your employee's role has been successfully updated!", updRole);
                            init();
                        }
                    );
                });
        });
    });
}

function updateMngr(){
    connection.query("SELECT * FROM employee", function (err, res) {
        for (i = 0; i < res.length; i++) {
            emplArr.push(res[i].first_name + " " + res[i].last_name);
        }

            inquirer
                .prompt([
                    {
                        name: "updEmpl",
                        type: "list",
                        message: "Which employee would you like to update?",
                        choices: emplArr
                    },

                    {
                        name: "updMgr",
                        type: "list",
                        message: "Choose employee's new manager",
                        choices: emplArr
                    }


                ])
                .then(function (answer) {
                    // console.log(response);
                    let updEmpl = res.find(function (updEmpl) {
                        return (updEmpl.first_name + " " + updEmpl.last_name) === answer.updEmpl
                    });

                    let updMgr = res.find(function (updMgr) {
                        return (updMgr.first_name + " " + updMgr.last_name) === answer.updMgr
                    });

                    connection.query(
                        `UPDATE employee SET manager_id = ? 
                        WHERE id = (SELECT id FROM(SELECT id FROM employee WHERE CONCAT(first_name, " ", last_name) = ?)AS NAME)`,
                        [updMgr.id, answer.updEmpl],
                        function (err) {
                            if (err) throw err;
                            console.log("Your employee's manager has been successfully updated!");
                            init();
                        }
                    );
                });
        });
    };



function removeEmpl() {
    connection.query(
        "SELECT id, CONCAT(first_name, ' ', last_name) AS Employee FROM employeetracker_db.employee; ",
        (err, results) => {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        name: "removeEmp",
                        type: "list",
                        message: "Which employee would you like to remove?",
                        choices: () => {
                            let choiceArray = [];
                            for (var i = 0; i < results.length; i++) {
                                choiceArray.push(results[i].Employee);
                            }
                            return choiceArray;
                        },
                    },
                ])
                .then((answer) => {
                    let chosenEmp;
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].Employee === answer.removeEmp) {
                            chosenEmp = results[i].id;
                            connection.query(
                                "DELETE FROM employee WHERE ?",
                                {
                                    id: chosenEmp
                                },
                                (err, res) => {
                                    if (err) throw err;
                                    console.log("You have sucessfully removed " + answer.removeEmp);
                                    init();
                                })
                        }
                    }
                })
        })
}

function removeRole() {
    connection.query(
        "SELECT id, CONCAT(title) AS Role FROM employeetracker_db.role; ",
        (err, results) => {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        name: "removeRole",
                        type: "list",
                        message: "Which role would you like to remove?",
                        choices: () => {
                            roleArray = [];
                            for (var i = 0; i < results.length; i++) {
                                roleArray.push(results[i].Role);
                            }
                            return roleArray;
                        },
                    },
                ])
                .then((answer) => {
                    let chosenRole;
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].Role === answer.removeRole) {
                            chosenRole = results[i].id;
                            connection.query(
                                "DELETE FROM role WHERE ?",
                                {
                                    id: chosenRole
                                },
                                (err, res) => {
                                    if (err) throw err;
                                    console.log("You have sucessfully removed " + answer.removeRole);
                                    init();
                                })
                        }
                    }
                })
        })
}

function removeDept() {
    connection.query(
        "SELECT id, CONCAT(dept_name) AS Department FROM employeetracker_db.department; ",
        (err, results) => {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        name: "removeDept",
                        type: "list",
                        message: "Which department would you like to remove?",
                        choices: () => {
                            deptArray = [];
                            for (var i = 0; i < results.length; i++) {
                                deptArray.push(results[i].Department);
                            }
                            return deptArray;
                        },
                    },
                ])
                .then((answer) => {
                    let chosenDept;
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].Department === answer.removeDept) {
                            chosenDept = results[i].id;
                            connection.query(
                                "DELETE FROM department WHERE ?",
                                {
                                    id: chosenDept
                                },
                                (err, res) => {
                                    if (err) throw err;
                                    console.log("You have sucessfully removed " + answer.removeDept);
                                    init();
                                })
                        }
                    }
                })
        })
}

function viewBudgt(){
    connection.query(
        `SELECT department.dept_name AS Department, SUM(salary) AS Budget 
        FROM role
        INNER JOIN department, employee
        WHERE role.id = employee.role_id || role.department_id = department.id 
        GROUP BY dept_name`,
        function (err, res){
            if(err) throw err;
            let budgt = [];
            for (let i = 0; i < res.length; i++){
                budgt.push({
                    Department: res[i].Department,
                    Budget: res[i].Budget
                })
               
            }
            console.log("displaying utilized budget for each department...\n");
            console.table(budgt);
            init();
        }
    )
}