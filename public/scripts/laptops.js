document.addEventListener('DOMContentLoaded', () => {
    fetchLaptops();
});

function fetchLaptops() {
    fetch('/api/laptops')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayLaptops(data.laptops);
        })
        .catch(error => console.error('Error fetching laptops:', error));
}

function displayLaptops(laptops) {
    const divlaps = document.getElementById('servicio');
    divlaps.innerHTML = ''; // Limpiar contenido previo

    laptops.forEach(laptop => {
        const divlap = document.createElement('div');
        divlap.innerHTML = `
            <a href="datos_llenado_laptops.html">
                <img src="https://cdn-icons-png.flaticon.com/128/4439/4439476.png" alt="Laptop">
                <p>${laptop.equipo}</p>
            </a>
        `;
        divlaps.appendChild(divlap);
    });
}
