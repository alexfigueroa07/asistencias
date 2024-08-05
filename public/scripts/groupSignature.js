document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const groupId = params.get('groupId');
    const materiaId = params.get('materiaId');
    if (groupId && materiaId) {
        fetchStudents(groupId, materiaId);
    } else {
        console.error('Falta algún ID para jalar los datos');
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
            drawChart(data.students);  // TAMBIEN LLAMAMOS A LA GRAFICA PARA QUE LA CARGHE LUEGO LUEGO
        })
        .catch(error => console.error('Error al hacer fetching de students:', error));
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

function drawChart(students) {
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(() => {
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Alumno');
        data.addColumn('number', 'Faltas');

        students.forEach(student => {
            data.addRow([student.nombre, student.total_faltas]);
        });

        const options = {
            title: 'Total de Faltas por Alumno',
            hAxis: { title: 'Alumno', titleTextStyle: { color: '#333' } },
            vAxis: { minValue: 0 }
        };

        const chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
        chart.draw(data, options);
    });
}
