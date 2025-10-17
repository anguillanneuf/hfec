document.addEventListener('DOMContentLoaded', () => {

    const componentDetailsContent = {
        'ui': {
            title: 'UI & User Flows',
            text: 'This section translates visual designs (e.g., from Figma) into a structured definition. It includes a component library, state variations (e.g., loading, error, empty), and strict user flow logic. For example, it defines that from the "Login" screen, a successful authentication must always lead to the "Dashboard".'
        },
        'data': {
            title: 'Data & State Models',
            text: 'Defines the `shape` of all client-side data. It specifies types, required fields, and validation rules (e.g., an email must match a specific regex). This ensures data integrity and consistency throughout the application, preventing common bugs related to unexpected data structures.'
        },
        'api': {
            title: 'API Contracts',
            text: 'This serves as a client-side mirror of the backend API documentation (like OpenAPI/Swagger). It details every endpoint, the exact structure of request and response bodies, HTTP methods, and all possible success and error codes. Development can proceed using mock data that adheres to this contract.'
        },
        'logic': {
            title: 'Business & Domain Logic',
            text: 'This captures complex rules that are central to the product\'s value. For example, in an e-commerce app, this section would define the rules for calculating shipping costs, applying discounts, and handling inventory logic. This logic is specified independently of any UI representation.'
        },
        'auth': {
            title: 'Permissions & Roles',
            text: 'Clearly defines user roles (e.g., Admin, Editor, Viewer) and maps them to specific actions or visible UI elements. For instance, it would state that only users with the "Admin" role can see the "Delete User" button. This prevents security holes and clarifies functionality for different user types.'
        },
        'non-functional': {
            title: 'Non-Functional Specs',
            text: 'Covers critical requirements that aren\'t direct features. This includes performance budgets (e.g., "page load must be under 2 seconds"), accessibility standards (e.g., "must be WCAG 2.1 AA compliant"), and security protocols (e.g., "all user input must be sanitized to prevent XSS").'
        }
    };

    const flowDetailsContent = {
        'inputs': {
            title: 'Inputs: PRD & Figma',
            text: 'Product Requirement Documents (PRDs) define the "why" and "what" of a feature. Figma (or other design tools) provides the visual and user experience blueprint. These are the conceptual sources for the spec.'
        },
        'spec': {
            title: 'The Code Spec',
            text: 'The central artifact. It synthesizes the requirements and designs into a detailed, unambiguous technical plan. It becomes the single source of truth that engineers build against. It is version-controlled alongside the code.'
        },
        'code': {
            title: 'Production Code',
            text: 'The final implementation. Because it is built directly from the spec, it accurately reflects the initial requirements and design. The spec serves as a reference for code reviews, testing, and future modifications.'
        }
    };

    const componentCards = document.querySelectorAll('.component-card');
    const detailsContainer = document.getElementById('component-details');

    componentCards.forEach(card => {
        card.addEventListener('click', () => {
            const componentKey = card.dataset.component;
            const content = componentDetailsContent[componentKey];
            detailsContainer.innerHTML = `
                <div class="text-left">
                    <h4 class="font-bold text-xl mb-2 text-amber-700">${content.title}</h4>
                    <p class="text-gray-700">${content.text}</p>
                </div>
            `;
        });
    });

    const flowNodes = document.querySelectorAll('.flow-node');
    const flowDetailsContainer = document.getElementById('flow-details');

    flowNodes.forEach(node => {
        node.addEventListener('click', () => {
            flowNodes.forEach(n => n.classList.remove('active'));
            node.classList.add('active');
            const flowKey = node.dataset.flow;
            const content = flowDetailsContent[flowKey];
            flowDetailsContainer.innerHTML = `
                <div>
                    <h4 class="font-bold text-lg mb-2">${content.title}</h4>
                    <p class="text-gray-600">${content.text}</p>
                </div>
            `;
        });
    });

    const chartData = {
        labels: ['Developer Onboarding Time', 'Feature Clarity', 'Cross-Team Misalignment', 'Bugs from Ambiguity'],
        before: {
            label: 'Before Spec (Lower is Better for Time/Bugs)',
            data: [100, 40, 80, 75],
            backgroundColor: 'rgba(200, 150, 150, 0.6)',
            borderColor: 'rgba(200, 150, 150, 1)',
        },
        after: {
            label: 'After Spec (Higher is Better for Clarity)',
            data: [30, 95, 20, 15],
            backgroundColor: 'rgba(217, 119, 6, 0.6)',
            borderColor: 'rgba(217, 119, 6, 1)',
        }
    };

    const ctx = document.getElementById('benefitsChart').getContext('2d');
    const benefitsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.labels,
            datasets: [chartData.before]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Relative Score / Effort'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.x !== null) {
                                label += context.parsed.x + '%';
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });

    const btnBefore = document.getElementById('btn-before');
    const btnAfter = document.getElementById('btn-after');

    function updateChart(state) {
        if (state === 'before') {
            benefitsChart.data.datasets = [chartData.before];
            btnBefore.classList.add('bg-amber-600', 'text-white');
            btnBefore.classList.remove('bg-transparent', 'text-gray-700');
            btnAfter.classList.remove('bg-amber-600', 'text-white');
            btnAfter.classList.add('bg-transparent', 'text-gray-700');
        } else {
            benefitsChart.data.datasets = [chartData.after];
            btnAfter.classList.add('bg-amber-600', 'text-white');
            btnAfter.classList.remove('bg-transparent', 'text-gray-700');
            btnBefore.classList.remove('bg-amber-600', 'text-white');
            btnBefore.classList.add('bg-transparent', 'text-gray-700');
        }
        benefitsChart.update();
    }

    btnBefore.addEventListener('click', () => updateChart('before'));
    btnAfter.addEventListener('click', () => updateChart('after'));

    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.4
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === entry.target.id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      observer.observe(section);
    });
});