// Data Models
class FeedbackItem {
    constructor(source, message, customerType, timestamp = new Date()) {
        this.id = Date.now() + Math.random();
        this.source = source;
        this.message = message;
        this.customerType = customerType;
        this.timestamp = timestamp;
        this.analysis = this.analyzeFeedback();
    }

    analyzeFeedback() {
        // Mock AI Analysis - In production, this would call OpenAI or similar
        const themes = ['Performance', 'UX', 'Pricing', 'Reliability', 'Docs', 'Features', 'Integration', 'Security'];
        const sentiments = ['Positive', 'Neutral', 'Negative'];
        const impacts = ['Low', 'Medium', 'High'];
        
        // Simple keyword-based analysis for demo
        const message = this.message.toLowerCase();
        let theme = themes[Math.floor(Math.random() * themes.length)];
        let sentiment = 'Neutral';
        let urgency = 3;
        let impact = impacts[1];

        // Theme detection based on keywords
        if (message.includes('slow') || message.includes('performance') || message.includes('speed')) {
            theme = 'Performance';
        } else if (message.includes('ui') || message.includes('interface') || message.includes('design')) {
            theme = 'UX';
        } else if (message.includes('price') || message.includes('cost') || message.includes('expensive')) {
            theme = 'Pricing';
        } else if (message.includes('bug') || message.includes('crash') || message.includes('error')) {
            theme = 'Reliability';
        } else if (message.includes('documentation') || message.includes('docs') || message.includes('guide')) {
            theme = 'Docs';
        } else if (message.includes('feature') || message.includes('add') || message.includes('request')) {
            theme = 'Features';
        } else if (message.includes('integration') || message.includes('api') || message.includes('connect')) {
            theme = 'Integration';
        } else if (message.includes('security') || message.includes('auth') || message.includes('permission')) {
            theme = 'Security';
        }

        // Sentiment detection
        if (message.includes('love') || message.includes('great') || message.includes('amazing') || message.includes('excellent')) {
            sentiment = 'Positive';
        } else if (message.includes('hate') || message.includes('terrible') || message.includes('awful') || message.includes('frustrated') || message.includes('angry')) {
            sentiment = 'Negative';
        } else if (message.includes('bug') || message.includes('issue') || message.includes('problem') || message.includes('broken')) {
            sentiment = 'Negative';
        }

        // Urgency scoring (1-5)
        if (message.includes('urgent') || message.includes('critical') || message.includes('blocking')) {
            urgency = 5;
        } else if (message.includes('important') || message.includes('priority')) {
            urgency = 4;
        } else if (sentiment === 'Negative' && (theme === 'Reliability' || theme === 'Security')) {
            urgency = 4;
        } else if (sentiment === 'Negative') {
            urgency = 3;
        } else if (sentiment === 'Positive') {
            urgency = 2;
        } else {
            urgency = Math.floor(Math.random() * 3) + 1;
        }

        // Impact assessment
        if (this.customerType === 'Enterprise') {
            impact = 'High';
        } else if (this.customerType === 'Mid-Market') {
            impact = 'Medium';
        } else if (urgency >= 4) {
            impact = 'High';
        } else if (urgency >= 3) {
            impact = 'Medium';
        } else {
            impact = 'Low';
        }

        // Generate summary
        const summary = this.generateSummary(theme, sentiment, urgency);

        return {
            theme,
            sentiment,
            urgency,
            impact,
            summary
        };
    }

    generateSummary(theme, sentiment, urgency) {
        const sentimentWords = {
            'Positive': ['praises', 'appreciates', 'likes'],
            'Neutral': ['mentions', 'notes', 'suggests'],
            'Negative': ['complains about', 'frustrated with', 'issues with']
        };

        const urgencyWords = {
            5: 'critically',
            4: 'very',
            3: 'somewhat',
            2: 'mildly',
            1: 'slightly'
        };

        const verb = sentimentWords[sentiment][Math.floor(Math.random() * sentimentWords[sentiment].length)];
        const adv = urgencyWords[urgency];
        
        return `User ${verb} ${theme} ${urgency > 3 ? 'issues' : 'aspects'} ${adv}.`;
    }
}

// Global State
let feedbackData = [];
let filteredData = [];
let currentPage = 1;
let itemsPerPage = 10;

// Chart instances
let sentimentTrendChart = null;
let themeDistributionChart = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    loadMockData();
    updateDashboard();
    updateThemeFilter();
    initializeCharts();
});

// Load mock data
function loadMockData() {
    const mockFeedback = [
        { source: 'Support', message: 'The dashboard is loading extremely slowly today, making it impossible to work efficiently.', customerType: 'Enterprise' },
        { source: 'GitHub', message: 'Love the new API endpoints! They are well-documented and easy to use.', customerType: 'Mid-Market' },
        { source: 'Discord', message: 'The UI redesign is confusing, I can\'t find the settings anymore.', customerType: 'Small Business' },
        { source: 'Twitter', message: 'Your pricing model is too expensive for small teams like ours.', customerType: 'Small Business' },
        { source: 'Email', message: 'Critical bug: Data export is failing for all our reports this morning.', customerType: 'Enterprise' },
        { source: 'Support', message: 'Integration with Salesforce keeps disconnecting, very frustrating.', customerType: 'Enterprise' },
        { source: 'GitHub', message: 'Feature request: Add dark mode to the dashboard interface.', customerType: 'Individual' },
        { source: 'Discord', message: 'The documentation for the new API is unclear and missing examples.', customerType: 'Mid-Market' },
        { source: 'Twitter', message: 'Amazing customer support! Resolved my issue in minutes.', customerType: 'Small Business' },
        { source: 'Email', message: 'Security concern: Two-factor authentication is not working properly.', customerType: 'Enterprise' },
        { source: 'Support', message: 'Performance has improved significantly after the last update. Great work!', customerType: 'Mid-Market' },
        { source: 'GitHub', message: 'Bug: Mobile responsive design is broken on iPhone devices.', customerType: 'Individual' },
        { source: 'Discord', message: 'Would love to see more customization options for the dashboard widgets.', customerType: 'Small Business' },
        { source: 'Twitter', message: 'Your platform has transformed how we handle customer feedback!', customerType: 'Enterprise' },
        { source: 'Email', message: 'Urgent: Our team cannot access the analytics module since yesterday.', customerType: 'Enterprise' }
    ];

    // Add some variety to timestamps
    const now = new Date();
    mockFeedback.forEach((item, index) => {
        const timestamp = new Date(now.getTime() - (index * 3600000 * 24)); // Spread over last 15 days
        feedbackData.push(new FeedbackItem(item.source, item.message, item.customerType, timestamp));
    });

    filteredData = [...feedbackData];
}

// UI Functions
function showIngestionModal() {
    document.getElementById('ingestionModal').classList.remove('hidden');
    setTimeout(() => lucide.createIcons(), 100);
}

function hideIngestionModal() {
    document.getElementById('ingestionModal').classList.add('hidden');
    // Clear form
    document.getElementById('manualMessage').value = '';
}

function switchTab(tab) {
    const manualTab = document.getElementById('manualTab');
    const csvTab = document.getElementById('csvTab');
    const manualForm = document.getElementById('manualForm');
    const csvForm = document.getElementById('csvForm');

    if (tab === 'manual') {
        manualTab.classList.add('border-blue-600', 'text-blue-600');
        manualTab.classList.remove('border-transparent', 'text-gray-500');
        csvTab.classList.remove('border-blue-600', 'text-blue-600');
        csvTab.classList.add('border-transparent', 'text-gray-500');
        manualForm.classList.remove('hidden');
        csvForm.classList.add('hidden');
    } else {
        csvTab.classList.add('border-blue-600', 'text-blue-600');
        csvTab.classList.remove('border-transparent', 'text-gray-500');
        manualTab.classList.remove('border-blue-600', 'text-blue-600');
        manualTab.classList.add('border-transparent', 'text-gray-500');
        csvForm.classList.remove('hidden');
        manualForm.classList.add('hidden');
    }
}

function addManualFeedback() {
    const source = document.getElementById('manualSource').value;
    const customerType = document.getElementById('manualCustomerType').value;
    const message = document.getElementById('manualMessage').value.trim();

    if (!message) {
        alert('Please enter a feedback message');
        return;
    }

    const feedback = new FeedbackItem(source, message, customerType);
    feedbackData.unshift(feedback);
    filteredData = [...feedbackData];
    currentPage = 1; // Reset to first page to show new feedback
    
    updateDashboard();
    updateThemeFilter();
    hideIngestionModal();
}

function handleCSVUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const csv = e.target.result;
        const lines = csv.split('\n');
        const headers = lines[0].toLowerCase().split(',');
        
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            
            const values = lines[i].split(',');
            if (values.length >= 3) {
                const source = values[0] || 'Support';
                const message = values[1] || '';
                const customerType = values[2] || 'Individual';
                
                if (message.trim()) {
                    const feedback = new FeedbackItem(source, message, customerType);
                    feedbackData.push(feedback);
                }
            }
        }
        
        filteredData = [...feedbackData];
        currentPage = 1; // Reset to first page after CSV upload
        updateDashboard();
        updateThemeFilter();
        hideIngestionModal();
    };
    reader.readAsText(file);
}

// Filter Functions
function applyFilters() {
    const sourceFilter = document.getElementById('sourceFilter').value;
    const sentimentFilter = document.getElementById('sentimentFilter').value;
    const themeFilter = document.getElementById('themeFilter').value;

    filteredData = feedbackData.filter(item => {
        if (sourceFilter && item.source !== sourceFilter) return false;
        if (sentimentFilter && item.analysis.sentiment !== sentimentFilter) return false;
        if (themeFilter && item.analysis.theme !== themeFilter) return false;
        return true;
    });

    currentPage = 1; // Reset to first page when filtering
    updateDashboard();
}

function clearFilters() {
    document.getElementById('sourceFilter').value = '';
    document.getElementById('sentimentFilter').value = '';
    document.getElementById('themeFilter').value = '';
    filteredData = [...feedbackData];
    currentPage = 1; // Reset to first page when clearing filters
    updateDashboard();
}

function updateThemeFilter() {
    const themes = [...new Set(feedbackData.map(item => item.analysis.theme))].sort();
    const themeFilter = document.getElementById('themeFilter');
    themeFilter.innerHTML = '<option value="">All Themes</option>';
    themes.forEach(theme => {
        themeFilter.innerHTML += `<option value="${theme}">${theme}</option>`;
    });
}

// Dashboard Update Functions
function updateDashboard() {
    updateFeedbackCount();
    updateTopThemes();
    updateUrgentFeedback();
    updateSentimentHotspots();
    updateRecommendations();
    updateFeedbackList();
    updatePagination();
    updateFeedbackGrid();
    updateCharts();
}

// Chart Functions
function initializeCharts() {
    // Add loading states to chart containers
    document.querySelectorAll('.chart-container').forEach(container => {
        container.classList.add('loading');
    });
    
    initializeSentimentTrendChart();
    initializeThemeDistributionChart();
}

function initializeSentimentTrendChart() {
    const ctx = document.getElementById('sentimentTrendChart').getContext('2d');
    sentimentTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Positive',
                    data: [],
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    pointBackgroundColor: 'rgb(34, 197, 94)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                },
                {
                    label: 'Neutral',
                    data: [],
                    borderColor: 'rgb(250, 204, 21)',
                    backgroundColor: 'rgba(250, 204, 21, 0.1)',
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    pointBackgroundColor: 'rgb(250, 204, 21)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                },
                {
                    label: 'Negative',
                    data: [],
                    borderColor: 'rgb(239, 68, 68)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    pointBackgroundColor: 'rgb(239, 68, 68)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart',
                onComplete: function() {
                    // Add pulse effect to chart container
                    const container = document.getElementById('sentimentTrendChart').closest('.chart-container');
                    container.classList.remove('loading');
                }
            },
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#ddd',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + ' items';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    });
}

function initializeThemeDistributionChart() {
    const ctx = document.getElementById('themeDistributionChart').getContext('2d');
    themeDistributionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Feedback Count',
                data: [],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(147, 51, 234, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(250, 204, 21, 0.8)',
                    'rgba(251, 146, 60, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(107, 114, 128, 0.8)'
                ],
                borderColor: [
                    'rgb(59, 130, 246)',
                    'rgb(147, 51, 234)',
                    'rgb(236, 72, 153)',
                    'rgb(34, 197, 94)',
                    'rgb(250, 204, 21)',
                    'rgb(251, 146, 60)',
                    'rgb(239, 68, 68)',
                    'rgb(107, 114, 128)'
                ],
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1200,
                easing: 'easeOutBounce',
                onComplete: function() {
                    const container = document.getElementById('themeDistributionChart').closest('.chart-container');
                    container.classList.remove('loading');
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#ddd',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return 'Count: ' + context.parsed.y + ' items';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 11
                        },
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function initializeHeatMapChart() {
    const ctx = document.getElementById('heatMapChart').getContext('2d');
    
    // Create heat map data
    const sources = ['Support', 'GitHub', 'Discord', 'Twitter', 'Email'];
    const themes = ['Performance', 'UX', 'Pricing', 'Reliability', 'Docs', 'Features', 'Integration', 'Security'];
    
    heatMapChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Feedback Intensity',
                data: [],
                backgroundColor: function(context) {
                    const value = context.parsed.v;
                    const alpha = Math.min(value / 10, 1);
                    return `rgba(147, 51, 234, ${alpha})`;
                },
                borderColor: 'rgba(147, 51, 234, 0.8)',
                borderWidth: 2,
                pointRadius: function(context) {
                    const value = context.parsed.v;
                    return Math.max(10, Math.min(25, value * 2));
                },
                pointHoverRadius: function(context) {
                    const value = context.parsed.v;
                    return Math.max(15, Math.min(30, value * 2.5));
                },
                pointStyle: 'rect'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart',
                onComplete: function() {
                    const container = document.getElementById('heatMapChart').closest('.chart-container');
                    container.classList.remove('loading');
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#ddd',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        title: function(context) {
                            const source = sources[context[0].parsed.x];
                            const theme = themes[context[0].parsed.y];
                            return `${source} → ${theme}`;
                        },
                        label: function(context) {
                            const value = context.parsed.v;
                            return `Feedback Count: ${value} items`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: -0.5,
                    max: sources.length - 0.5,
                    ticks: {
                        callback: function(value) {
                            return sources[Math.round(value)] || '';
                        },
                        stepSize: 1,
                        font: {
                            size: 11,
                            weight: 'bold'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Source',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    type: 'linear',
                    min: -0.5,
                    max: themes.length - 0.5,
                    ticks: {
                        callback: function(value) {
                            return themes[Math.round(value)] || '';
                        },
                        stepSize: 1,
                        font: {
                            size: 11,
                            weight: 'bold'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Theme',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                v: {
                    display: false
                }
            }
        }
    });
}

function updateCharts() {
    updateSentimentTrendChart();
    updateThemeDistributionChart();
}

function updateFeedbackGrid() {
    const container = document.getElementById('feedbackGrid');
    const gridData = filteredData.slice(0, 9); // Show max 9 items in grid
    
    if (gridData.length === 0) {
        container.innerHTML = '<div class="col-span-full text-center text-gray-500 py-8">No feedback items to display</div>';
        return;
    }
    
    container.innerHTML = gridData.map((item, index) => {
        const gradientClass = item.analysis.sentiment === 'Positive' ? 'gradient-positive' : 
                              item.analysis.sentiment === 'Negative' ? 'gradient-negative' : 'gradient-neutral';
        
        return `
            <div class="feedback-grid-item ${gradientClass} p-4 cursor-pointer" 
                 onclick="viewFeedback('${item.id}')" 
                 style="animation-delay: ${index * 0.1}s">
                <div class="flex items-start justify-between mb-3">
                    <span class="grid-badge px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(item.source)}">
                        ${item.source}
                    </span>
                    <span class="grid-badge px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(item.analysis.impact)}">
                        ${item.customerType}
                    </span>
                </div>
                <h4 class="font-semibold text-sm mb-2 line-clamp-2">${item.analysis.theme}</h4>
                <p class="text-xs opacity-90 mb-3 line-clamp-3">${item.message}</p>
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                        <span class="grid-badge px-2 py-1 rounded text-xs ${getSentimentColor(item.analysis.sentiment)}">
                            ${item.analysis.sentiment}
                        </span>
                        <span class="grid-badge px-2 py-1 rounded text-xs ${getUrgencyColor(item.analysis.urgency)}">
                            U: ${item.analysis.urgency}/5
                        </span>
                    </div>
                    <span class="text-xs opacity-75 grid-badge px-2 py-1 rounded bg-gradient-to-r from-gray-400 to-gray-500 text-white">${formatDate(item.timestamp)}</span>
                </div>
            </div>
        `;
    }).join('');
    
    // Add staggered animation
    container.querySelectorAll('.feedback-grid-item').forEach((item, index) => {
        item.style.animation = 'slideInUp 0.4s ease-out';
        item.style.animationDelay = `${index * 0.1}s`;
        item.style.animationFillMode = 'both';
    });
}

function updateFeedbackCount() {
    document.getElementById('feedbackCount').textContent = `${filteredData.length} feedback items`;
}

function updateTopThemes() {
    const themeCounts = {};
    filteredData.forEach(item => {
        themeCounts[item.analysis.theme] = (themeCounts[item.analysis.theme] || 0) + 1;
    });

    const sortedThemes = Object.entries(themeCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const container = document.getElementById('topThemes');
    container.innerHTML = sortedThemes.map(([theme, count], index) => `
        <div class="theme-item flex items-center justify-between p-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg cursor-pointer" onclick="filterByTheme('${theme}')" style="animation-delay: ${index * 0.1}s">
            <div class="flex items-center space-x-3">
                <span class="text-lg font-bold text-white number-badge bg-white bg-opacity-30 px-2 py-1 rounded">#${index + 1}</span>
                <span class="font-medium text-white">${theme}</span>
            </div>
            <span class="bg-white bg-opacity-30 px-3 py-1 rounded-full text-sm font-medium number-badge text-white">${count}</span>
        </div>
    `).join('');
    
    // Add staggered animation
    container.querySelectorAll('.theme-item').forEach((item, index) => {
        item.style.animation = 'slideInLeft 0.3s ease-out';
        item.style.animationDelay = `${index * 0.1}s`;
        item.style.animationFillMode = 'both';
    });
}

function updateUrgentFeedback() {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const urgentThisWeek = filteredData
        .filter(item => item.timestamp > oneWeekAgo && item.analysis.urgency >= 4)
        .sort((a, b) => b.analysis.urgency - a.analysis.urgency)
        .slice(0, 5);

    const container = document.getElementById('urgentFeedback');
    if (urgentThisWeek.length === 0) {
        container.innerHTML = '<p class="text-white text-sm opacity-80">No urgent feedback this week</p>';
    } else {
        container.innerHTML = urgentThisWeek.map((item, index) => `
            <div class="urgent-item p-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg cursor-pointer" onclick="viewFeedback('${item.id}')" style="animation-delay: ${index * 0.1}s">
                <div class="flex items-start justify-between mb-2">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-30 number-badge text-white">
                        Urgency: ${item.analysis.urgency}/5
                    </span>
                    <span class="text-xs text-white bg-white bg-opacity-30 px-2 py-1 rounded">${item.source}</span>
                </div>
                <p class="text-sm text-white opacity-90 line-clamp-2">${item.message}</p>
            </div>
        `).join('');
        
        // Add staggered animation
        container.querySelectorAll('.urgent-item').forEach((item, index) => {
            item.style.animation = 'slideInLeft 0.3s ease-out';
            item.style.animationDelay = `${index * 0.1}s`;
            item.style.animationFillMode = 'both';
        });
    }
}

function updateSentimentHotspots() {
    const sentimentBySource = {};
    filteredData.forEach(item => {
        if (!sentimentBySource[item.source]) {
            sentimentBySource[item.source] = { Positive: 0, Neutral: 0, Negative: 0, total: 0 };
        }
        sentimentBySource[item.source][item.analysis.sentiment]++;
        sentimentBySource[item.source].total++;
    });

    const hotspots = Object.entries(sentimentBySource)
        .filter(([source, data]) => data.Negative > 0)
        .map(([source, data]) => ({
            source,
            negativeCount: data.Negative,
            negativePercentage: (data.Negative / data.total * 100).toFixed(1),
            total: data.total
        }))
        .sort((a, b) => b.negativePercentage - a.negativePercentage);

    const container = document.getElementById('sentimentHotspots');
    if (hotspots.length === 0) {
        container.innerHTML = '<p class="text-white text-sm opacity-80">No negative sentiment detected</p>';
    } else {
        container.innerHTML = hotspots.map((hotspot, index) => `
            <div class="sentiment-item p-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg cursor-pointer" onclick="filterBySourceAndSentiment('${hotspot.source}', 'Negative')" style="animation-delay: ${index * 0.1}s">
                <div class="flex items-center justify-between mb-2">
                    <span class="font-medium text-white">${hotspot.source}</span>
                    <span class="text-xs text-white bg-white bg-opacity-30 px-2 py-1 rounded">${hotspot.total} total</span>
                </div>
                <div class="flex items-center space-x-2">
                    <div class="flex-1 bg-white bg-opacity-30 rounded-full h-2">
                        <div class="bg-white h-2 rounded-full progress-bar" style="width: ${hotspot.negativePercentage}%"></div>
                    </div>
                    <span class="text-sm font-medium text-white number-badge bg-white bg-opacity-30 px-2 py-1 rounded">${hotspot.negativePercentage}%</span>
                </div>
                <p class="text-xs text-white opacity-90 mt-1">${hotspot.negativeCount} negative items</p>
            </div>
        `).join('');
        
        // Add staggered animation
        container.querySelectorAll('.sentiment-item').forEach((item, index) => {
            item.style.animation = 'slideInLeft 0.3s ease-out';
            item.style.animationDelay = `${index * 0.1}s`;
            item.style.animationFillMode = 'both';
        });
    }
}

function updateRecommendations() {
    // Calculate priority scores for each theme
    const themeScores = {};
    filteredData.forEach(item => {
        const theme = item.analysis.theme;
        if (!themeScores[theme]) {
            themeScores[theme] = {
                count: 0,
                totalUrgency: 0,
                highImpactCount: 0,
                negativeCount: 0
            };
        }
        themeScores[theme].count++;
        themeScores[theme].totalUrgency += item.analysis.urgency;
        if (item.analysis.impact === 'High') themeScores[theme].highImpactCount++;
        if (item.analysis.sentiment === 'Negative') themeScores[theme].negativeCount++;
    });

    // Calculate priority score (frequency + urgency + impact + sentiment)
    const recommendations = Object.entries(themeScores).map(([theme, data]) => {
        const avgUrgency = data.totalUrgency / data.count;
        const frequencyScore = Math.min(data.count / 3, 5); // Cap at 5
        const urgencyScore = avgUrgency;
        const impactScore = (data.highImpactCount / data.count) * 5;
        const sentimentScore = (data.negativeCount / data.count) * 5;
        
        const totalScore = frequencyScore + urgencyScore + impactScore + sentimentScore;
        
        return {
            theme,
            score: totalScore,
            reasoning: generateRecommendationReasoning(data, avgUrgency)
        };
    }).sort((a, b) => b.score - a.score).slice(0, 3);

    const container = document.getElementById('recommendations');
    container.innerHTML = recommendations.map((rec, index) => `
        <div class="bg-white bg-opacity-10 backdrop-blur rounded-lg p-4 hover-lift cursor-pointer" onclick="filterByTheme('${rec.theme}')">
            <div class="flex items-center space-x-2 mb-2">
                <span class="text-2xl font-bold">${index + 1}</span>
                <h4 class="font-semibold text-lg">${rec.theme}</h4>
            </div>
            <p class="text-sm text-white text-opacity-90 mb-2">${rec.reasoning}</p>
            <div class="flex items-center space-x-2">
                <span class="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">Priority Score: ${rec.score.toFixed(1)}</span>
            </div>
        </div>
    `).join('');
}

function generateRecommendationReasoning(data, avgUrgency) {
    const reasons = [];
    if (data.count >= 3) reasons.push(`${data.count} mentions`);
    if (avgUrgency >= 4) reasons.push('high urgency');
    if (data.highImpactCount > 0) reasons.push('high impact customers');
    if (data.negativeCount >= 2) reasons.push('negative sentiment trend');
    
    if (reasons.length === 0) return 'Emerging pattern worth monitoring';
    return reasons.join(', ') + '. Prioritize this area.';
}

function updateFeedbackList() {
    const container = document.getElementById('feedbackList');
    const sortedData = [...filteredData].sort((a, b) => b.timestamp - a.timestamp);
    
    // Calculate pagination
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, sortedData.length);
    const paginatedData = sortedData.slice(startIndex, endIndex);
    
    if (sortedData.length === 0) {
        container.innerHTML = '<div class="p-6 text-center text-gray-500">No feedback items found</div>';
        return;
    }

    container.innerHTML = paginatedData.map((item, index) => {
        const gradientClass = item.analysis.sentiment === 'Positive' ? 'list-gradient-positive' : 
                              item.analysis.sentiment === 'Negative' ? 'list-gradient-negative' : 'list-gradient-neutral';
        
        return `
            <div class="feedback-list-item ${gradientClass} p-4 cursor-pointer" 
                 onclick="viewFeedback('${item.id}')" 
                 style="animation-delay: ${index * 0.05}s">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center space-x-3">
                        <span class="list-badge px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(item.source)}">
                            ${item.source}
                        </span>
                        <span class="list-badge px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(item.analysis.sentiment)}">
                            ${item.analysis.sentiment}
                        </span>
                        <span class="list-badge px-2 py-1 rounded-full text-xs font-medium ${getThemeColor(item.analysis.theme)}">
                            ${item.analysis.theme}
                        </span>
                    </div>
                    <div class="flex items-center space-x-2 text-xs text-gray-600">
                        <span class="list-badge px-2 py-1 rounded ${getUrgencyColor(item.analysis.urgency)}">
                            U: ${item.analysis.urgency}/5
                        </span>
                        <span class="list-badge px-2 py-1 rounded ${getImpactColor(item.analysis.impact)}">
                            ${item.analysis.impact}
                        </span>
                    </div>
                </div>
                <p class="text-gray-700 mb-3 leading-relaxed">${item.message}</p>
                <div class="flex items-center justify-between">
                    <p class="text-sm text-gray-600 italic">${item.analysis.summary}</p>
                    <span class="text-xs text-gray-500 list-badge px-2 py-1 rounded bg-gradient-to-r from-gray-400 to-gray-500 text-white">${formatDate(item.timestamp)}</span>
                </div>
            </div>
        `;
    }).join('');
    
    // Add staggered animation
    container.querySelectorAll('.feedback-list-item').forEach((item, index) => {
        item.style.animation = 'slideInLeft 0.3s ease-out';
        item.style.animationDelay = `${index * 0.05}s`;
        item.style.animationFillMode = 'both';
    });
}

// Pagination Functions
function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, filteredData.length);
    
    // Update showing info
    document.getElementById('showingStart').textContent = filteredData.length > 0 ? startIndex : 0;
    document.getElementById('showingEnd').textContent = endIndex;
    document.getElementById('totalItems').textContent = filteredData.length;
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;
    
    // Update buttons state
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    // Update page numbers
    const pageNumbers = document.getElementById('pageNumbers');
    pageNumbers.innerHTML = '';
    
    if (totalPages <= 7) {
        // Show all pages if 7 or fewer
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.innerHTML += createPageButton(i);
        }
    } else {
        // Show smart pagination for many pages
        if (currentPage <= 4) {
            for (let i = 1; i <= 5; i++) {
                pageNumbers.innerHTML += createPageButton(i);
            }
            pageNumbers.innerHTML += '<span class="px-2 text-gray-400">...</span>';
            pageNumbers.innerHTML += createPageButton(totalPages);
        } else if (currentPage >= totalPages - 3) {
            pageNumbers.innerHTML += createPageButton(1);
            pageNumbers.innerHTML += '<span class="px-2 text-gray-400">...</span>';
            for (let i = totalPages - 4; i <= totalPages; i++) {
                pageNumbers.innerHTML += createPageButton(i);
            }
        } else {
            pageNumbers.innerHTML += createPageButton(1);
            pageNumbers.innerHTML += '<span class="px-2 text-gray-400">...</span>';
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                pageNumbers.innerHTML += createPageButton(i);
            }
            pageNumbers.innerHTML += '<span class="px-2 text-gray-400">...</span>';
            pageNumbers.innerHTML += createPageButton(totalPages);
        }
    }
}

function createPageButton(pageNum) {
    const isActive = pageNum === currentPage;
    return `
        <button onclick="goToPage(${pageNum})" class="page-btn px-3 py-1 border rounded-md text-sm ${isActive ? 'active' : 'border-gray-300 border-opacity-50 bg-white bg-opacity-70 backdrop-blur-sm hover:bg-opacity-90'}">
            ${pageNum}
        </button>
    `;
}

function changePage(direction) {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        updateFeedbackList();
        updatePagination();
    }
}

function goToPage(pageNum) {
    currentPage = pageNum;
    updateFeedbackList();
    updatePagination();
}

function updatePaginationSettings() {
    itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    currentPage = 1; // Reset to first page
    updateFeedbackList();
    updatePagination();
}

// Helper Functions
function getSourceColor(source) {
    const colors = {
        'Support': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0',
        'GitHub': 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0',
        'Discord': 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0',
        'Twitter': 'bg-gradient-to-r from-sky-500 to-sky-600 text-white border-0',
        'Email': 'bg-gradient-to-r from-green-500 to-green-600 text-white border-0'
    };
    return colors[source] || 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0';
}

function getSentimentColor(sentiment) {
    const colors = {
        'Positive': 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0',
        'Neutral': 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0',
        'Negative': 'bg-gradient-to-r from-red-500 to-red-600 text-white border-0'
    };
    return colors[sentiment] || 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0';
}

function getUrgencyColor(urgency) {
    if (urgency >= 4) return 'bg-gradient-to-r from-red-500 to-red-600 text-white border-0';
    if (urgency >= 3) return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0';
    if (urgency >= 2) return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0';
    return 'bg-gradient-to-r from-green-500 to-green-600 text-white border-0';
}

function getImpactColor(impact) {
    const colors = {
        'High': 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0',
        'Medium': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0',
        'Low': 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0'
    };
    return colors[impact] || 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0';
}

function getThemeColor(theme) {
    const colors = {
        'Performance': 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-0',
        'UX': 'bg-gradient-to-r from-pink-500 to-pink-600 text-white border-0',
        'Pricing': 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0',
        'Reliability': 'bg-gradient-to-r from-red-500 to-red-600 text-white border-0',
        'Docs': 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0',
        'Features': 'bg-gradient-to-r from-green-500 to-green-600 text-white border-0',
        'Integration': 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0',
        'Security': 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0'
    };
    return colors[theme] || 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0';
}

function formatDate(date) {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return date.toLocaleDateString();
}

// Filter helper functions
function filterByTheme(theme) {
    document.getElementById('themeFilter').value = theme;
    applyFilters();
}

function filterBySourceAndSentiment(source, sentiment) {
    document.getElementById('sourceFilter').value = source;
    document.getElementById('sentimentFilter').value = sentiment;
    applyFilters();
}

function viewFeedback(id) {
    const item = feedbackData.find(f => f.id == id);
    if (item) {
        alert(`Feedback Details:\n\nSource: ${item.source}\nCustomer Type: ${item.customerType}\nTheme: ${item.analysis.theme}\nSentiment: ${item.analysis.sentiment}\nUrgency: ${item.analysis.urgency}/5\nImpact: ${item.analysis.impact}\n\nMessage: ${item.message}\n\nAI Summary: ${item.analysis.summary}`);
    }
}

// Delivery Modal Functions
function showDeliveryModal() {
    document.getElementById('deliveryModal').classList.remove('hidden');
    setTimeout(() => lucide.createIcons(), 100);
}

function hideDeliveryModal() {
    document.getElementById('deliveryModal').classList.add('hidden');
}

function generateSummaryContent() {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentFeedback = feedbackData.filter(item => item.timestamp > oneWeekAgo);
    
    // Get top themes
    const themeCounts = {};
    recentFeedback.forEach(item => {
        themeCounts[item.analysis.theme] = (themeCounts[item.analysis.theme] || 0) + 1;
    });
    const topThemes = Object.entries(themeCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([theme, count]) => `• ${theme}: ${count} mentions`);

    // Get urgent items
    const urgentItems = recentFeedback
        .filter(item => item.analysis.urgency >= 4)
        .slice(0, 3)
        .map(item => `• ${item.analysis.theme} (${item.source}): ${item.message.substring(0, 60)}...`);

    // Get recommendations
    const recommendations = getTopRecommendations();

    const summary = `📊 **Signal Feedback Summary** - ${formatDate(new Date())}

**🔥 Top Themes This Week:**
${topThemes.join('\n')}

**⚠️ Urgent Items:**
${urgentItems.length > 0 ? urgentItems.join('\n') : '• No urgent items this week'}

**🎯 Priority Recommendations:**
${recommendations.map((rec, i) => `${i + 1}. **${rec.theme}** - ${rec.reasoning}`).join('\n')}

---
Generated by Signal - Product Feedback Analysis
Total feedback analyzed: ${recentFeedback.length} items`;

    return summary;
}

function getTopRecommendations() {
    const themeScores = {};
    filteredData.forEach(item => {
        const theme = item.analysis.theme;
        if (!themeScores[theme]) {
            themeScores[theme] = {
                count: 0,
                totalUrgency: 0,
                highImpactCount: 0,
                negativeCount: 0
            };
        }
        themeScores[theme].count++;
        themeScores[theme].totalUrgency += item.analysis.urgency;
        if (item.analysis.impact === 'High') themeScores[theme].highImpactCount++;
        if (item.analysis.sentiment === 'Negative') themeScores[theme].negativeCount++;
    });

    return Object.entries(themeScores).map(([theme, data]) => {
        const avgUrgency = data.totalUrgency / data.count;
        const frequencyScore = Math.min(data.count / 3, 5);
        const urgencyScore = avgUrgency;
        const impactScore = (data.highImpactCount / data.count) * 5;
        const sentimentScore = (data.negativeCount / data.count) * 5;
        
        const totalScore = frequencyScore + urgencyScore + impactScore + sentimentScore;
        
        return {
            theme,
            score: totalScore,
            reasoning: generateRecommendationReasoning(data, avgUrgency)
        };
    }).sort((a, b) => b.score - a.score).slice(0, 3);
}

function sendToSlack() {
    const summary = generateSummaryContent();
    
    // Simulate sending to Slack
    console.log('Sending to Slack:', summary);
    
    // Show success message
    hideDeliveryModal();
    showNotification('✅ Summary sent to #product-team on Slack!', 'success');
    
    // In production, this would make an actual API call:
    // fetch('https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ text: summary })
    // });
}

function sendToDiscord() {
    const summary = generateSummaryContent();
    
    // Simulate sending to Discord
    console.log('Sending to Discord:', summary);
    
    // Show success message
    hideDeliveryModal();
    showNotification('📢 Summary sent to #feedback-insights on Discord!', 'success');
    
    // In production, this would make an actual API call:
    // fetch('https://discord.com/api/webhooks/YOUR/DISCORD/WEBHOOK', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ content: summary })
    // });
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg fade-in ${
        type === 'success' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
