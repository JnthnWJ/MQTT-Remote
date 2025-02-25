document.addEventListener('DOMContentLoaded', () => {
    // Get button elements
    const previousBtn = document.getElementById('previous-btn');
    const nextBtn = document.getElementById('next-btn');
    
    // Add click event listeners
    previousBtn.addEventListener('click', () => {
        sendCommand('previous');
    });
    
    nextBtn.addEventListener('click', () => {
        sendCommand('next');
    });
    
    // Function to send commands to the server
    async function sendCommand(action) {
        // Show loading state
        const button = action === 'next' ? nextBtn : previousBtn;
        const originalText = button.textContent;
        button.setAttribute('aria-busy', 'true');
        button.disabled = true;
        
        try {
            // Send request to the server
            const response = await fetch(`/api/wallpaper/${action}`);
            const data = await response.json();
            
            if (data.success) {
                // Show success feedback
                button.textContent = 'Success!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 1000);
            } else {
                // Show error feedback
                button.textContent = 'Error!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 1000);
            }
        } catch (error) {
            console.error('Error sending command:', error);
            // Show error feedback
            button.textContent = 'Error!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 1000);
        } finally {
            // Reset button state
            setTimeout(() => {
                button.removeAttribute('aria-busy');
                button.disabled = false;
            }, 500);
        }
    }
});
