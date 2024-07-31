document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const groupId = params.get('groupId');
    const materiaId = params.get('materiaId');

    if (groupId && materiaId) {
        fetchGroupInfo(groupId);
    } else {
        console.error('falta algun id :( ');
    }

    document.getElementById('attendance-form').addEventListener('submit', (event) => {
        event.preventDefault();
        alert("Form submitted");
        submitAttendance(materiaId, groupId);
    });

    // PA PONER LA FECHA
    const currentDateElement = document.getElementById('current-date');
    const currentDate = new Date().toLocaleDateString();
    currentDateElement.textContent = currentDate;
});

function fetchGroupInfo(groupId) {
    fetch(`/api/group-info?groupId=${groupId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayGroupInfo(data.students);
        })
        .catch(error => console.error('Error fetching group info:', error));
}

function displayGroupInfo(students) {
    const container = document.getElementById('attendance-container');
    container.innerHTML = '';

    //este show es para las horas, ignorar
    const now = new Date();
    const nowString = now.toTimeString().split(' ')[0].substring(0, 5);
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    const oneHourLaterString = oneHourLater.toTimeString().split(' ')[0].substring(0, 5);

    students.forEach(student => {
        const studentElement = document.createElement('div');
        studentElement.className = 'student-row';
        studentElement.innerHTML = `
            <p id="student_id_${student.id}">${student.matricula} | ${student.nombre}</p>
            <input type="time" id="hora_entrada_${student.id}" class="input-time" value="${nowString}">
            <input type="time" id="hora_salida_${student.id}" class="input-time" value="${oneHourLaterString}">
            <select id="tipo_asistencia_${student.id}" class="input-select">
                <option value="asiste">Asiste</option>
                <option value="no asiste">No Asiste</option>
                <option value="retardo">Retardo</option>
            </select>
        `;
        container.appendChild(studentElement);
    });
}

function submitAttendance(materiaId, groupId) {
    const students = Array.from(document.querySelectorAll('.student-row'));
    const attendance = students.map(student => {
        const studentIdElement = student.querySelector('p').id;
        const studentId = studentIdElement.split('_')[2];

        const horaEntrada = document.getElementById(`hora_entrada_${studentId}`);
        const horaSalida = document.getElementById(`hora_salida_${studentId}`);
        const tipoAsistencia = document.getElementById(`tipo_asistencia_${studentId}`);

        if (horaEntrada && horaSalida && tipoAsistencia) {
            return {
                id_alumno: studentId,
                hora_entrada: horaEntrada.value,
                hora_salida: horaSalida.value,
                tipo_asistencia: tipoAsistencia.value
            };
        } else {
            console.error('olvidaste algo', studentId);
            return null;
        }
    }).filter(item => item !== null);

    fetch('/api/record-attendance', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id_materia: materiaId,
            id_grupo: groupId,
            attendance: attendance
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert('Asistencia registrada correctamente');

        })
        .catch(error => {
            console.error('Error recording attendance:', error);
            alert(`Error recording attendance: ${error.message}`); // Alerta para errores, generales
        });
}
