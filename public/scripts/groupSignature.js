document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const groupId = params.get('groupId');
    const materiaId = params.get('materiaId');
    if (groupId && materiaId) {
        fetchStudents(groupId, materiaId);
    } else {
        console.error('falta algun id pa jalar');
    }
});

function fetchStudents(groupId, materiaId) {
    fetch(`/api/students?groupId=${groupId}&materiaId=${materiaId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayStudents(data.students);
        })
        .catch(error => console.error('Error al ahcer fetching students:', error));
}

function displayStudents(students) {
    const tbody = document.querySelector('#students-container tbody');
    tbody.innerHTML = ''; 
    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.nombre}</td>
            <td>${student.matricula}</td>
            <td>${student.email}</td>
            <td>${student.edad}</td>
            <td>${student.total_faltas}</td>
        `;
        tbody.appendChild(row);
    });
}
