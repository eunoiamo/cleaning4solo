class DarkModeToggle extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const toggleButton = document.createElement('button');
    toggleButton.classList.add('toggle-button');

    const storedMode = localStorage.getItem('darkMode');
    const currentMode = storedMode ? (storedMode === 'true' ? 'moon' : 'sun') : 'sun';
    toggleButton.innerHTML = getIcon(currentMode);

    toggleButton.addEventListener('click', () => {
      const isDarkMode = document.body.classList.toggle('dark-mode');
      toggleButton.innerHTML = getIcon(isDarkMode ? 'moon' : 'sun');
      localStorage.setItem('darkMode', isDarkMode);
    });

    const style = document.createElement('style');
    style.textContent = `
            .toggle-button {
                background-color: transparent;
                border: none;
                cursor: pointer;
                outline: none;
                width: 40px;
                height: 40px;
            }

            @media (max-width: 1199px) {
            .toggle-button svg {
                width: 100%;
                height: 100%;
                color:var(--text-color);
                padding: 10px 20px;
              }
            }
            @media (min-width: 1200px) {
              .toggle-button svg {
                width: 100%;
                height: 100%;
                color:var(--text-color);
              }
            }
        `;

    shadow.appendChild(style);
    shadow.appendChild(toggleButton);
  }
}

function getIcon(name) {
  switch (name) {
    case 'moon':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-moon-fill" viewBox="0 0 16 16">
                    <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278"/>
              </svg>`;
    case 'sun':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sun-fill" viewBox="0 0 16 16">
                    <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/>
              </svg>`;
    default:
      return '';
  }
}

customElements.define('dark-mode-toggle', DarkModeToggle);
