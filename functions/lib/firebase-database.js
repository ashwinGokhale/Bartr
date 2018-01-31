// Client and Server Data Fetching Logic
// Uses either the client firebase (initialized from hosting init script)
// Or serverside firebase
const firebase = global.firebase || require('firebase');
// Initialize Firebase SDK
// Only should be called once on the server
// the client should already be initialized from hosting init script
const initializeApp = config => {
    if (firebase.apps.length === 0) {
        firebase.initializeApp(config);
    }
};
// Get and return all employees
const getAllEmployees = () => {
    return firebase.database().ref('/employees').orderByChild('level').once('value').then(snap => {
        return { employees: snap.val() };
    });
};
// Get and return an employee by their id number
// also fetch all of the employee's direct reports (if any)
const getEmployeeById = employeeId => {
    return firebase.database().ref(`/employees/${employeeId}`).once('value').then(snap => {
        const promises = [];
        const snapshot = snap.val();
        if (snapshot.reports) {
            Object.keys(snapshot.reports).forEach(userId => {
                promises.push(firebase.database().ref(`/employees/${userId}`).once('value').then(snap => snap.val()));
            });
        }
        return firebase.Promise.all(promises).then((resp) => {
            return { currentEmployee: { employee: snapshot, reports: resp } };
        });
    });
};
module.exports = {
    getAllEmployees,
    getEmployeeById,
    initializeApp
};
//# sourceMappingURL=firebase-database.js.map