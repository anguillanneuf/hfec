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

    // --- Poll Functionality ---

    const pollOptionsContainer = document.getElementById('poll-options');
    const pollButtons = document.querySelectorAll('.poll-option');
    const pollResultsContainer = document.getElementById('poll-results-container');

    const pollOptionsMap = {
        'onboarding': 'Developer Onboarding Time',
        'clarity': 'Feature Clarity',
        'misalignment': 'Cross-team Misalignment',
        'ambiguity': 'Bugs from Ambiguity'
    };

    // --- Mock Implementation (No Firebase) ---
    // This section uses localStorage to demonstrate the poll's functionality
    // without needing a live Firebase backend.

    function getMockPollResults() {
        const results = localStorage.getItem('pollResults');
        return results ? JSON.parse(results) : {};
    }

    function saveMockPollResults(results) {
        localStorage.setItem('pollResults', JSON.stringify(results));
    }

    function recordVote(option) {
        localStorage.setItem('votedInPoll', 'true');
        pollButtons.forEach(btn => btn.disabled = true);

        const results = getMockPollResults();
        results[option] = (results[option] || 0) + 1;
        saveMockPollResults(results);

        console.log("Mock vote recorded!");
        showPollResults();
    }

    function showPollResults() {
        pollOptionsContainer.style.display = 'none';
        pollResultsContainer.classList.remove('hidden');

        const results = getMockPollResults();
        const totalVotes = Object.values(results).reduce((sum, count) => sum + count, 0);

        if (totalVotes === 0) {
            pollResultsContainer.innerHTML = '<p>No votes have been cast yet.</p>';
            return;
        }

        let resultsHTML = '';
        for (const key in pollOptionsMap) {
            const count = results[key] || 0;
            const percentage = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);
            resultsHTML += `
                <div class="poll-result">
                    <div class="flex justify-between items-center mb-1">
                       <span class="poll-result-label">${pollOptionsMap[key]}</span>
                       <span class="poll-result-percentage">${percentage}%</span>
                    </div>
                    <div class="poll-result-bar">
                        <div class="poll-result-fill" style="width: ${percentage}%;">${count} votes</div>
                    </div>
                </div>
            `;
        }
        pollResultsContainer.innerHTML = resultsHTML;
    }

    const hasVoted = localStorage.getItem('votedInPoll') === 'true';

    if (hasVoted) {
        showPollResults();
    }

    pollButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (localStorage.getItem('votedInPoll') === 'true') return;
            const option = button.dataset.option;
            recordVote(option);
        });

        if (hasVoted) {
            button.disabled = true;
        }
    });


    /*
    // --- Firebase Implementation ---
    // To use Firebase, uncomment this section and replace the mock implementation above.
    // Make sure to also add your Firebase config.

    // 1. Add your Firebase config object here:
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
    };

    // 2. Initialize Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.firestore();
    const pollResultsRef = db.collection('poll-results').doc('votes');

    // 3. Uncomment the two functions below (recordVote and showPollResults)

    // function recordVote(option) {
    //     localStorage.setItem('votedInPoll', 'true');
    //     pollButtons.forEach(btn => btn.disabled = true);
    //
    //     db.runTransaction((transaction) => {
    //         return transaction.get(pollResultsRef).then((doc) => {
    //             if (!doc.exists) {
    //                 transaction.set(pollResultsRef, { [option]: 1 });
    //             } else {
    //                 const newCount = (doc.data()[option] || 0) + 1;
    //                 transaction.update(pollResultsRef, { [option]: newCount });
    //             }
    //         });
    //     }).then(() => {
    //         console.log("Vote recorded!");
    //         showPollResults();
    //     }).catch((error) => {
    //         console.error("Transaction failed: ", error);
    //     });
    // }

    // function showPollResults() {
    //     pollOptionsContainer.style.display = 'none';
    //     pollResultsContainer.classList.remove('hidden');
    //
    //     pollResultsRef.get().then((doc) => {
    //         if (!doc.exists) {
    //             pollResultsContainer.innerHTML = '<p>No votes have been cast yet.</p>';
    //             return;
    //         }
    //
    //         const results = doc.data();
    //         const totalVotes = Object.values(results).reduce((sum, count) => sum + count, 0);
    //
    //         let resultsHTML = '';
    //         for (const key in pollOptionsMap) {
    //             const count = results[key] || 0;
    //             const percentage = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);
    //             resultsHTML += `
    //                 <div class="poll-result">
    //                     <div class="flex justify-between items-center mb-1">
    //                        <span class="poll-result-label">${pollOptionsMap[key]}</span>
    //                        <span class="poll-result-percentage">${percentage}%</span>
    //                     </div>
    //                     <div class="poll-result-bar">
    //                         <div class="poll-result-fill" style="width: ${percentage}%;">${count} votes</div>
    //                     </div>
    //                 </div>
    //             `;
    //         }
    //         pollResultsContainer.innerHTML = resultsHTML;
    //     }).catch((error) => {
    //         console.error("Error getting poll results: ", error);
    //         pollResultsContainer.innerHTML = '<p>Could not load poll results.</p>';
    //     });
    // }
    */
});