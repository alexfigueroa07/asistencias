document.addEventListener("DOMContentLoaded", () => {
    fetchProfessorName();
    fetchSubjects();
});
// obtenemos el name del profesor
function fetchProfessorName() {
    fetch('/api/professor')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error fetching professor name:', data.error);
                return;
            }
            displayProfessorName(data.professor_name);
        })
        .catch(error => console.error('Fetch error:', error));
}

//lo renderizamos al html, si 
function displayProfessorName(name) {
    const nameContainer = document.getElementById('professor-name');
    nameContainer.textContent = `Dashboard de ${name}`;
}
//obtenemos las materias de la ruta de materias por profesor
function fetchSubjects() {
    fetch('/api/subjects')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error fetching subjects:', data.error);
                return;
            }
            displaySubjects(data.subjects);
        })
        .catch(error => console.error('Fetch error:', error));
}

// renderizamos las matrisa
function displaySubjects(subjects) {
    const container = document.getElementById('subjects-container');
    container.innerHTML = '';

    if (subjects.length === 0) {
        container.innerHTML = '<p>No tienes materias asignadas amigo.</p>';
        return;
    }

    subjects.forEach(subject => {
        const subjectDiv = document.createElement('div');
        subjectDiv.className = 'subject';

        subjectDiv.innerHTML = `
            <h2>${subject.nombre_materia}</h2>
            <p><strong>Profesor:</strong> ${subject.nombre_profesor}</p>
            <p><strong>Grupo:</strong> ${subject.nombre_grupo}</p>
            <div class="dropdown-options" style="display: none;">
                <button onclick="navigateTo('groupSignature.html', ${subject.id_grupo}, ${subject.id_materia})">Ver Asistencias</button>
                <button onclick="navigateTo('asistencia.html', ${subject.id_grupo}, ${subject.id_materia})">Pasar Asistencia</button>
            </div>
        `;

        // Evento click para desplegar opciones del menu por cda unoa materia
        subjectDiv.addEventListener('click', () => {
            const dropdown = subjectDiv.querySelector('.dropdown-options');
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        });

        container.appendChild(subjectDiv);
    });
}

// Función para navegar a las diferentes páginas, dependiendo lo que se elija y enviar tipo props en la naevgacion
function navigateTo(page, groupId, materiaId) {
    window.location.href = `${page}?groupId=${groupId}&materiaId=${materiaId}`;
}