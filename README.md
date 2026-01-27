# Signal - Product Feedback Analysis MVP

A fast, functional prototype that aggregates feedback from multiple sources and surfaces key insights for product managers.

## 🎯 Goal

Help product managers make better roadmap decisions by:
- Identifying recurring themes across feedback sources
- Prioritizing urgency vs noise
- Understanding customer sentiment patterns
- Translating feedback into actionable recommendations

## 🚀 Features

### 1. Feedback Ingestion
- **Manual Entry**: Quick form for adding individual feedback items
- **CSV Upload**: Bulk import from existing feedback systems
- **Sources Supported**: Support tickets, GitHub issues, Discord, Twitter, Email

### 2. AI Analysis Layer
Each feedback item is automatically analyzed for:
- **Theme Classification**: Performance, UX, Pricing, Reliability, Docs, Features, Integration, Security
- **Sentiment Analysis**: Positive, Neutral, Negative
- **Urgency Scoring**: 1-5 scale based on content and customer type
- **Impact Assessment**: Low/Medium/High based on customer segment
- **AI Summary**: One-sentence summary for quick scanning

### 3. Insights Dashboard
- **Top 5 Themes**: Most frequently mentioned topics with counts
- **Urgent Feedback**: High-priority items from the past week
- **Negative Sentiment Hotspots**: Sources with the most negative feedback
- **Smart Recommendations**: "What should we work on next?" based on combined urgency + impact + frequency

### 4. PM-Friendly UX
- Clean, minimal interface designed for decision-making
- Interactive filters by source, sentiment, and theme
- Click-through to see underlying feedback for any theme
- Real-time updates as new feedback is added

## 🛠 Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS (via CDN)
- **Icons**: Lucide Icons
- **Storage**: In-memory (for MVP)
- **AI Analysis**: Mock logic (production would use OpenAI/LLM APIs)

## 📁 Project Structure

```
signal/
├── index.html          # Main application interface
├── app.js             # Core application logic and data models
└── README.md          # This file
```

## 🚀 Quick Start

1. Open `index.html` in your web browser
2. The app loads with 15 realistic mock feedback items
3. Click "Add Feedback" to add new items manually or via CSV
4. Explore the dashboard insights and filters
5. Click on themes or items to drill down into details

## 📊 Mock Data

The MVP includes 15 pre-loaded feedback items covering:
- Multiple sources (Support, GitHub, Discord, Twitter, Email)
- Various customer types (Enterprise, Mid-Market, Small Business, Individual)
- Different themes, sentiments, and urgency levels
- Realistic timestamps spread over the past 2 weeks

## 🔍 How It Works

### Feedback Analysis Algorithm
The mock AI analysis uses keyword-based logic:

```javascript
// Theme Detection
- "slow", "performance", "speed" → Performance
- "ui", "interface", "design" → UX
- "price", "cost", "expensive" → Pricing
- "bug", "crash", "error" → Reliability
// ... etc

// Sentiment Detection
- "love", "great", "amazing" → Positive
- "hate", "terrible", "frustrated" → Negative
- "bug", "issue", "problem" → Negative
// ... etc

// Urgency Scoring
- "urgent", "critical", "blocking" → 5/5
- "important", "priority" → 4/5
- Negative sentiment + critical themes → 4/5
// ... etc
```

### Recommendation Engine
Priority scores combine:
- **Frequency Score**: How often the theme appears
- **Urgency Score**: Average urgency level
- **Impact Score**: Percentage of high-impact customers
- **Sentiment Score**: Negative sentiment ratio

## 🎨 Design Decisions

### PM-Focused Interface
- **Insight over analytics**: Emphasizes actionable insights over raw metrics
- **Visual hierarchy**: Most important information prominently displayed
- **One-click actions**: Every element is clickable for deeper exploration
- **Color coding**: Intuitive visual signals for sentiment and urgency

### Smart Tradeoffs
- **Mock AI**: Fast, deterministic analysis vs real API calls
- **In-memory storage**: Simplicity vs persistence
- **Single page**: Cohesive experience vs complex navigation
- **Keyword analysis**: Transparent logic vs black-box ML

## 🔮 Production Considerations

For a production version, consider:

1. **Real AI Integration**: OpenAI GPT-4 or Claude API for analysis
2. **Database**: PostgreSQL or similar for persistent storage
3. **Authentication**: User accounts and team collaboration
4. **Real Integrations**: Actual API connections to feedback sources
5. **Advanced Analytics**: Trend analysis, correlation insights
6. **Export Features**: PDF reports, CSV exports for stakeholder sharing

## 📈 Sample Use Cases

### Scenario 1: Quarterly Planning
> "Our Q3 roadmap should focus on Performance and Reliability. These themes have the highest combined urgency (4.2/5) and impact (75% enterprise customers), with increasing negative sentiment over the past 6 weeks."

### Scenario 2: Triage Meeting
> "This week's urgent feedback shows 3 critical reliability issues from enterprise customers. The dashboard shows these are blocking data exports and API integrations - we should prioritize these for immediate hotfixes."

### Scenario 3: Customer Success
> "Negative sentiment is highest in Discord (35% of messages) around UX confusion. The theme analysis shows dashboard navigation is the primary pain point. Let's create tutorial content and consider UX improvements."

## 🤝 Contributing

This is an MVP prototype. Key areas for enhancement:
- More sophisticated AI analysis
- Real-time collaboration features
- Advanced filtering and search
- Mobile responsiveness
- Data visualization charts

## 📝 License

MIT License - feel free to use this as inspiration for your own product feedback tools!
