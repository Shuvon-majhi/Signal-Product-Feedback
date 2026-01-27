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

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    loadMockData();
    updateDashboard();
    updateThemeFilter();
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
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover-lift cursor-pointer" onclick="filterByTheme('${theme}')">
            <div class="flex items-center space-x-3">
                <span class="text-lg font-bold text-gray-400">#${index + 1}</span>
                <span class="font-medium text-gray-900">${theme}</span>
            </div>
            <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">${count}</span>
        </div>
    `).join('');
}

function updateUrgentFeedback() {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const urgentThisWeek = filteredData
        .filter(item => item.timestamp > oneWeekAgo && item.analysis.urgency >= 4)
        .sort((a, b) => b.analysis.urgency - a.analysis.urgency)
        .slice(0, 5);

    const container = document.getElementById('urgentFeedback');
    if (urgentThisWeek.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-sm">No urgent feedback this week</p>';
    } else {
        container.innerHTML = urgentThisWeek.map(item => `
            <div class="p-3 bg-red-50 border border-red-200 rounded-lg hover-lift cursor-pointer" onclick="viewFeedback('${item.id}')">
                <div class="flex items-start justify-between mb-2">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Urgency: ${item.analysis.urgency}/5
                    </span>
                    <span class="text-xs text-gray-500">${item.source}</span>
                </div>
                <p class="text-sm text-gray-700 line-clamp-2">${item.message}</p>
            </div>
        `).join('');
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
        container.innerHTML = '<p class="text-gray-500 text-sm">No negative sentiment detected</p>';
    } else {
        container.innerHTML = hotspots.map(hotspot => `
            <div class="p-3 bg-orange-50 border border-orange-200 rounded-lg hover-lift cursor-pointer" onclick="filterBySourceAndSentiment('${hotspot.source}', 'Negative')">
                <div class="flex items-center justify-between mb-2">
                    <span class="font-medium text-gray-900">${hotspot.source}</span>
                    <span class="text-xs text-gray-500">${hotspot.total} total</span>
                </div>
                <div class="flex items-center space-x-2">
                    <div class="flex-1 bg-gray-200 rounded-full h-2">
                        <div class="bg-orange-500 h-2 rounded-full" style="width: ${hotspot.negativePercentage}%"></div>
                    </div>
                    <span class="text-sm font-medium text-orange-800">${hotspot.negativePercentage}%</span>
                </div>
                <p class="text-xs text-gray-600 mt-1">${hotspot.negativeCount} negative items</p>
            </div>
        `).join('');
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

    container.innerHTML = paginatedData.map(item => `
        <div class="feedback-item hover:bg-gray-50 cursor-pointer" onclick="viewFeedback('${item.id}')">
            <div class="flex items-start justify-between mb-3">
                <div class="flex items-center space-x-3">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(item.source)}">
                        ${item.source}
                    </span>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(item.analysis.sentiment)}">
                        ${item.analysis.sentiment}
                    </span>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        ${item.analysis.theme}
                    </span>
                </div>
                <div class="flex items-center space-x-2 text-xs text-gray-500">
                    <span>Urgency: ${item.analysis.urgency}/5</span>
                    <span>Impact: ${item.analysis.impact}</span>
                </div>
            </div>
            <p class="text-gray-700 mb-3 leading-relaxed">${item.message}</p>
            <div class="flex items-center justify-between">
                <p class="text-sm text-gray-600 italic">${item.analysis.summary}</p>
                <span class="text-xs text-gray-500">${formatDate(item.timestamp)}</span>
            </div>
        </div>
    `).join('');
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
        'Support': 'bg-blue-100 text-blue-800',
        'GitHub': 'bg-purple-100 text-purple-800',
        'Discord': 'bg-indigo-100 text-indigo-800',
        'Twitter': 'bg-sky-100 text-sky-800',
        'Email': 'bg-green-100 text-green-800'
    };
    return colors[source] || 'bg-gray-100 text-gray-800';
}

function getSentimentColor(sentiment) {
    const colors = {
        'Positive': 'bg-green-100 text-green-800',
        'Neutral': 'bg-yellow-100 text-yellow-800',
        'Negative': 'bg-red-100 text-red-800'
    };
    return colors[sentiment] || 'bg-gray-100 text-gray-800';
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
