document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');
    const messageDiv = document.getElementById('message');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Clear previous messages
            messageDiv.className = '';
            messageDiv.textContent = '';
            
            // Get form data
            const formData = new FormData(form);
            const userData = {
                username: formData.get('username'),
                password: formData.get('password'),
                college: formData.get('college'),
                email: formData.get('email'),
                phone: formData.get('phone')
            };
            
            try {
                // Send data to server
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    // Success message
                    messageDiv.className = 'success';
                    messageDiv.textContent = 'Registration successful! We look forward to seeing you at the workshop.';
                    form.reset();
                } else {
                    // Error message
                    messageDiv.className = 'error';
                    messageDiv.textContent = result.message || 'Registration failed. Please try again.';
                }
            } catch (error) {
                console.error('Error:', error);
                messageDiv.className = 'error';
                messageDiv.textContent = 'An error occurred. Please try again later.';
            }
        });
    }
});