document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        console.log(username, password);
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        if (response.ok) {
            const data = await response.json();
            alert(data.message);
            window.location.href = '/dashboard.html';
        } else {
            console.log(username, password);
            const errorData = await response.json();
            alert(errorData.error);
        }
    } catch (error) {
        console.log(username, password);

        console.error('Error:', error);
        alert('Hubo un problema al iniciar sesión. Por favor, inténtalo de nuevo.');
    }
});
