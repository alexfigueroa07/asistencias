document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const suggestionsContainer = document.getElementById('suggestions-container');
    const showDetailsBtn = document.getElementById('show-details-btn');
    const alumnoDetails = document.getElementById('alumno-details');
    let selectedAlumnoId = null;

    searchInput.addEventListener('input', () => {
        const query = searchInput.value;
        if (query.length > 0) {
            fetch(`/api/alumnos/search?query=${query}`)
                .then(response => response.json())
                .then(data => {
                    suggestionsContainer.innerHTML = '';
                    data.alumnos.forEach(alumno => {
                        const suggestion = document.createElement('div');
                        suggestion.className = 'suggestion';
                        suggestion.textContent = `${alumno.nombre} (${alumno.matricula})`;
                        suggestion.addEventListener('click', () => {
                            selectedAlumnoId = alumno.id;
                            searchInput.value = alumno.nombre;
                            suggestionsContainer.innerHTML = '';
                            showDetailsBtn.style.display = 'block';
                        });
                        suggestionsContainer.appendChild(suggestion);
                    });
                })
                .catch(error => console.error('Error fetching students:', error));
        } else {
            suggestionsContainer.innerHTML = '';
            showDetailsBtn.style.display = 'none';
        }
    });

    showDetailsBtn.addEventListener('click', () => {
        if (selectedAlumnoId) {
            fetch(`/api/alumnos/${selectedAlumnoId}`)
                .then(response => response.json())
                .then(data => {
                    alumnoDetails.innerHTML = `
                        <p>Nombre: ${data.alumno.nombre}</p>
                        <p>Matrícula: ${data.alumno.matricula}</p>
                        <p>Edad: ${data.alumno.edad}</p>
                        <p>Email: ${data.alumno.email}</p>
                    `;
                    alumnoDetails.style.display = 'block';
                })
                .catch(error => console.error('Error fetching student details:', error));
        }
    });
});
