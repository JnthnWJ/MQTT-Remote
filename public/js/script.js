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
            button.removeAttribute('aria-busy');
            button.disabled = false;
        }
    }

    // Add event listeners for TV remote buttons
    const tvControls = document.querySelector('.tv-controls');
    if (tvControls) {
        tvControls.addEventListener('click', async (event) => {
            const button = event.target.closest('button[data-command]');
            if (button) {
                const command = button.dataset.command;

                // Show loading state
                button.setAttribute('aria-busy', 'true');
                button.disabled = true;

                try {
                    const response = await fetch(`/api/tv/${command}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await response.json();

                    if (data.success) {
                        // Store the original HTML content (the icon)
                        const originalHTML = button.innerHTML;
                        // Show success feedback
                        button.innerHTML = '<span>Sent!</span>';
                        setTimeout(() => {
                            button.innerHTML = originalHTML;
                        }, 1000);
                    } else {
                        // Show error feedback
                        alert(`Error sending command: ${data.message}`);
                    }
                } catch (error) {
                    console.error('Error sending TV command:', error);
                    alert('Error sending TV command. See console for details.');
                } finally {
                    // Reset button state
                    button.removeAttribute('aria-busy');
                    button.disabled = false;
                }
            }
        });
    }
});
