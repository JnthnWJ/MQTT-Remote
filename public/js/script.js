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

    // Function to send a TV command
    async function sendTvCommand(command) {
        try {
            const response = await fetch(`/api/tv/${command}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return await response.json();
        } catch (error) {
            console.error(`Error sending TV command ${command}:`, error);
            throw error;
        }
    }

    // Function to show button feedback
    function showButtonFeedback(button, message = 'Sent!', duration = 1000) {
        const originalHTML = button.innerHTML;
        button.innerHTML = `<span>${message}</span>`;
        return new Promise(resolve => {
            setTimeout(() => {
                button.innerHTML = originalHTML;
                resolve();
            }, duration);
        });
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
                    // Special handling for Photos button
                    if (command === 'Photos') {
                        // Store the original HTML content (the icon)
                        const originalHTML = button.innerHTML;
                        
                        // Sequence: Home -> Wait -> Down -> Wait -> Down -> Enter
                        button.innerHTML = '<span>Home...</span>';
                        await sendTvCommand('Home');
                        
                        // Wait a moment (1.5 seconds)
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        
                        button.innerHTML = '<span>Down...</span>';
                        await sendTvCommand('Down');
                        
                        // Wait a moment (500ms)
                        await new Promise(resolve => setTimeout(resolve, 500));

                        button.innerHTML = '<span>Down...</span>';
                        await sendTvCommand('Down');

                        // Wait a moment (500ms)
                        await new Promise(resolve => setTimeout(resolve, 500));
                        
                        button.innerHTML = '<span>Enter...</span>';
                        await sendTvCommand('Enter');
                        
                        // Show success feedback and restore original icon
                        button.innerHTML = '<span>Done!</span>';
                        setTimeout(() => {
                            button.innerHTML = originalHTML;
                        }, 1000);
                    } else {
                        // Normal button handling
                        const data = await sendTvCommand(command);
                        
                        if (data.success) {
                            // Show success feedback
                            await showButtonFeedback(button);
                        } else {
                            // Show error feedback
                            alert(`Error sending command: ${data.message}`);
                        }
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
