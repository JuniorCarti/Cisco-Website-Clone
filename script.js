
  
  // DOM Elements
  const loginBtn = document.getElementById('login-btn');
  const mobileLoginBtn = document.getElementById('mobile-login-btn');
  const loginModal = document.getElementById('login-modal');
  const signupModal = document.getElementById('signup-modal');
  const closeLogin = document.getElementById('close-login');
  const closeSignup = document.getElementById('close-signup');
  const showSignup = document.getElementById('show-signup');
  const showLogin = document.getElementById('show-login');
  const loginSubmit = document.getElementById('login-submit');
  const signupSubmit = document.getElementById('signup-submit');
  const authButtons = document.getElementById('auth-buttons');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeMobileMenu = document.getElementById('close-mobile-menu');
  const newsletterSubmit = document.getElementById('newsletter-submit');
  const ctaGetStarted = document.getElementById('cta-get-started');
  const ctaContactSales = document.getElementById('cta-contact-sales');
 
  
  // Modal Functions
  function openModal(modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  
  function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
  
  // Event Listeners
  loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(loginModal);
  });
  
  mobileLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    mobileMenu.classList.remove('active');
    openModal(loginModal);
  });
  
  mobileMenuToggle.addEventListener('click', () => {
    mobileMenu.classList.add('active');
  });
  
  closeMobileMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
  });
  
  closeLogin.addEventListener('click', () => {
    closeModal(loginModal);
  });
  
  closeSignup.addEventListener('click', () => {
    closeModal(signupModal);
  });
  
  showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(loginModal);
    openModal(signupModal);
  });
  
  showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(signupModal);
    openModal(loginModal);
  });
  
  // Auth State Listener
  auth.onAuthStateChanged(user => {
    if (user) {
      // User is signed in
      authButtons.innerHTML = `
        <div class="user-dropdown" id="user-dropdown">
          <div class="user-avatar" id="user-avatar">
            ${user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
          </div>
          <div class="dropdown-menu">
            <a href="#">Dashboard</a>
            <a href="#">Account Settings</a>
            <a href="#" id="logout-btn">Logout</a>
          </div>
        </div>
      `;
  
      
      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!userDropdown.contains(e.target)) {
          userDropdown.classList.remove('active');
        }
      });
    } else {
      // User is signed out
      authButtons.innerHTML = '<a href="#" class="cta-button" id="login-btn">Login</a>';
      document.getElementById('login-btn').addEventListener('click', (e) => {
        e.preventDefault();
        openModal(loginModal);
      });
    }
  });
  
  // Login Function
  loginSubmit.addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const emailError = document.getElementById('login-email-error');
    const passwordError = document.getElementById('login-password-error');
  
    // Reset errors
    emailError.style.display = 'none';
    passwordError.style.display = 'none';
  
    // Validate inputs
    if (!email) {
      emailError.textContent = 'Email is required';
      emailError.style.display = 'block';
      return;
    }
  
    if (!password) {
      passwordError.textContent = 'Password is required';
      passwordError.style.display = 'block';
      return;
    }
  
    // Sign in with email and password
    auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        closeModal(loginModal);
      })
      .catch(error => {
        switch (error.code) {
          case 'auth/user-not-found':
            emailError.textContent = 'User not found';
            emailError.style.display = 'block';
            break;
          case 'auth/wrong-password':
            passwordError.textContent = 'Incorrect password';
            passwordError.style.display = 'block';
            break;
          case 'auth/invalid-email':
            emailError.textContent = 'Invalid email format';
            emailError.style.display = 'block';
            break;
          default:
            emailError.textContent = error.message;
            emailError.style.display = 'block';
        }
      });
  });
  
  // Signup Function
  signupSubmit.addEventListener('click', () => {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    
    const nameError = document.getElementById('signup-name-error');
    const emailError = document.getElementById('signup-email-error');
    const passwordError = document.getElementById('signup-password-error');
    const confirmError = document.getElementById('signup-confirm-error');
  
    // Reset errors
    nameError.style.display = 'none';
    emailError.style.display = 'none';
    passwordError.style.display = 'none';
    confirmError.style.display = 'none';
  
    // Validate inputs
    if (!name) {
      nameError.textContent = 'Name is required';
      nameError.style.display = 'block';
      return;
    }
  
    if (!email) {
      emailError.textContent = 'Email is required';
      emailError.style.display = 'block';
      return;
    }
  
    if (!password) {
      passwordError.textContent = 'Password is required';
      passwordError.style.display = 'block';
      return;
    }
  
    if (password.length < 6) {
      passwordError.textContent = 'Password must be at least 6 characters';
      passwordError.style.display = 'block';
      return;
    }
  
    if (password !== confirm) {
      confirmError.textContent = 'Passwords do not match';
      confirmError.style.display = 'block';
      return;
    }
  
    // Create user with email and password
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Update user profile with name
        return userCredential.user.updateProfile({
          displayName: name
        });
      })
      .then(() => {
        // Add user to Firestore
        return db.collection('users').doc(auth.currentUser.uid).set({
          name: name,
          email: email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      })
      .then(() => {
        closeModal(signupModal);
      })
      .catch(error => {
        switch (error.code) {
          case 'auth/email-already-in-use':
            emailError.textContent = 'Email already in use';
            emailError.style.display = 'block';
            break;
          case 'auth/invalid-email':
            emailError.textContent = 'Invalid email format';
            emailError.style.display = 'block';
            break;
          case 'auth/weak-password':
            passwordError.textContent = 'Password is too weak';
            passwordError.style.display = 'block';
            break;
          default:
            emailError.textContent = error.message;
            emailError.style.display = 'block';
        }
      });
  });
  
  // Newsletter Subscription
  newsletterSubmit.addEventListener('click', () => {
    const email = document.getElementById('newsletter-email').value;
    
    if (!email) {
      alert('Please enter your email address');
      return;
    }
  
    // Add to Firestore
    db.collection('newsletter').add({
      email: email,
      subscribedAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      alert('Thank you for subscribing!');
      document.getElementById('newsletter-email').value = '';
    })
    .catch(error => {
      alert('Error subscribing: ' + error.message);
    });
  });
  
  // CTA Buttons
  ctaGetStarted.addEventListener('click', (e) => {
    e.preventDefault();
    if (auth.currentUser) {
      // User is logged in - redirect to dashboard
      window.location.href = '#';
    } else {
      // User is not logged in - show signup modal
      openModal(signupModal);
    }
  });
  
  ctaContactSales.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Contact sales form would open here');
  });
  

  
  // Header scroll effect
  window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    const userDropdown = document.getElementById('user-dropdown');
    if (userDropdown && !userDropdown.contains(e.target)) {
      userDropdown.classList.remove('active');
    }
  });
  // Service Card Interactions
document.querySelectorAll('.service-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceTitle = e.target.closest('.service-card').querySelector('.service-title').textContent;
      
      if (auth.currentUser) {
        // Logged in users go to detailed service page
        window.location.href = `services.html?service=${encodeURIComponent(serviceTitle)}`;
      } else {
        // Others see a modal prompting login
        openModal(loginModal);
        document.getElementById('login-modal').insertAdjacentHTML('beforeend', 
          `<div class="service-login-prompt">
            <p>Please login to view detailed service information about ${serviceTitle}.</p>
          </div>`
        );
      }
    });
  });
  
  // Contact form handler for services CTA
  document.querySelector('.services-cta .btn-primary').addEventListener('click', (e) => {
    e.preventDefault();
    
    if (auth.currentUser) {
      // Redirect to contact form with service prefilled
      window.location.href = 'contact.html?interest=services';
    } else {
      // Show signup modal with service interest noted
      openModal(signupModal);
      document.getElementById('signup-modal').insertAdjacentHTML('beforeend',
        `<input type="hidden" id="service-interest" value="services">`
      );
    }
  });
  // Resources Tab Functionality
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all buttons and contents
    tabBtns.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to clicked button
    btn.classList.add('active');
    
    // Show corresponding content
    const tabId = btn.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');
  });
});

// Resource Download Tracking
document.querySelectorAll('.resource-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const resourceTitle = this.closest('.resource-card').querySelector('h3').textContent;
    
    if (auth.currentUser) {
      // Log download in Firestore
      db.collection('resource_downloads').add({
        userId: auth.currentUser.uid,
        resource: resourceTitle,
        downloadedAt: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        window.location.href = this.href; // Proceed with download
      });
    } else {
      openModal(loginModal);
      document.getElementById('login-modal').insertAdjacentHTML('beforeend', 
        `<div class="resource-login-prompt">
          <p>Please login to download "${resourceTitle}"</p>
        </div>`
      );
    }
  });
});