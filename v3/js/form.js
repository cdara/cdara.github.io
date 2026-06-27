// Contact form validation and submission
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Validate
        let isValid = true;
        let errors = [];
        
        if (!name) {
            errors.push('Name is required');
            isValid = false;
        }
        
        if (!email) {
            errors.push('Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            errors.push('Please enter a valid email');
            isValid = false;
        }
        
        if (!subject) {
            errors.push('Subject is required');
            isValid = false;
        }
        
        if (!message) {
            errors.push('Message is required');
            isValid = false;
        }
        
        if (!isValid) {
            alert('Please fix the following errors:\n' + errors.join('\n'));
            return;
        }
        
        // Simulate form submission
        // In production, you would send this to a server
        console.log('Form submitted:', { name, email, subject, message });
        
        // Show success message
        contactForm.style.display = 'none';
        formSuccess.style.display = 'block';
        
        // Reset form after delay
        setTimeout(() => {
            contactForm.reset();
            contactForm.style.display = 'block';
            formSuccess.style.display = 'none';
        }, 5000);
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
