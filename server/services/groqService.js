import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';
import { getCoachSystemPrompt } from '../utils/promptTemplates.js';

dotenv.config();

const apiKey = process.env.GROQ_API_KEY;
const isApiKeyConfigured = apiKey && !apiKey.includes('your_groq_api_key');

let groq = null;
if (isApiKeyConfigured) {
  try {
    groq = new Groq({ apiKey });
  } catch (error) {
    console.warn('Failed to initialize Groq SDK with provided API key. Falling back to Mock mode.', error.message);
  }
} else {
  console.log('Groq API Key is not set or is using placeholder. Running in Mock fallback mode.');
}

/**
 * Clean LLM response to ensure we only parse JSON content
 */
const cleanJsonString = (str) => {
  let cleaned = str.trim();
  // Remove markdown formatting like ```json ... ```
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\n/, '').replace(/\n```$/, '');
  }
  return cleaned.trim();
};

export const callGroqChat = async (systemPrompt, userPrompt, jsonMode = true) => {
  if (!groq) {
    throw new Error('Groq client not initialized');
  }

  const response = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.3,
    response_format: jsonMode ? { type: 'json_object' } : undefined,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('Empty response received from Groq API');
  }

  return jsonMode ? JSON.parse(cleanJsonString(content)) : content;
};

/**
 * Generate full business plan report
 */
export const generateBusinessPlanAI = async (details, prompts) => {
  if (!isApiKeyConfigured || !groq) {
    return generateMockBusinessPlan(details);
  }

  try {
    return await callGroqChat(prompts.system, prompts.user, true);
  } catch (error) {
    console.error('Groq Business Plan API error, falling back to mock:', error.message);
    return generateMockBusinessPlan(details);
  }
};

/**
 * Generate market research report
 */
export const generateMarketResearchAI = async (details, prompts) => {
  if (!isApiKeyConfigured || !groq) {
    return generateMockMarketResearch(details);
  }

  try {
    return await callGroqChat(prompts.system, prompts.user, true);
  } catch (error) {
    console.error('Groq Market Research API error, falling back to mock:', error.message);
    return generateMockMarketResearch(details);
  }
};

/**
 * Generate pitch deck slides
 */
export const generatePitchDeckAI = async (details, prompts) => {
  if (!isApiKeyConfigured || !groq) {
    return generateMockPitchDeck(details);
  }

  try {
    return await callGroqChat(prompts.system, prompts.user, true);
  } catch (error) {
    console.error('Groq Pitch Deck API error, falling back to mock:', error.message);
    return generateMockPitchDeck(details);
  }
};

/**
 * Generate Validation Plan
 */
export const generateValidationAI = async (details, prompts) => {
  if (!isApiKeyConfigured || !groq) {
    return generateMockValidation(details);
  }

  try {
    return await callGroqChat(prompts.system, prompts.user, true);
  } catch (error) {
    console.error('Groq Validation API error, falling back to mock:', error.message);
    return generateMockValidation(details);
  }
};

/**
 * Chat conversation with Startup Coach
 */
export const chatWithStartupCoachAI = async (chatHistory) => {
  if (!isApiKeyConfigured || !groq) {
    return getMockCoachResponse(chatHistory);
  }

  try {
    const formattedMessages = [
      { role: 'system', content: getCoachSystemPrompt() },
      ...chatHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }))
    ];

    const response = await groq.chat.completions.create({
      messages: formattedMessages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || 'I encountered an issue processing that. What else can I guide you on?';
  } catch (error) {
    console.error('Groq Coach API error, falling back to mock:', error.message);
    return getMockCoachResponse(chatHistory);
  }
};

// ==========================================
// MOCK GENERATORS (FALLBACK FOR OUT-OF-BOX USE)
// ==========================================

const generateMockBusinessPlan = (d) => ({
  executiveSummary: `Executive Summary for ${d.name}. We are launching a premium ${d.businessType} service focused on solving key market inefficiencies. Our core idea is: "${d.idea}". By targeting "${d.targetMarket}", we aim to capture early market share and establish a sustainable business using our unique "${d.revenueModel}" model. We are currently in the "${d.fundingStage}" funding phase, seeking capital to scale operations.`,
  companyOverview: `${d.name} is registered as a ${d.businessType} startup. Our mission is to democratize accessibility and efficiency within "${d.targetMarket}". The firm operates with a lean management structure, prioritizing product excellence and high-velocity customer acquisition.`,
  problemStatement: `Currently, customers in "${d.targetMarket}" face massive challenges. Existing solutions are either too expensive, lack personalization, or run on outdated technology. This leaves users frustrated and seeking alternatives.`,
  solution: `Our solution resolves these gaps directly by utilizing "${d.idea}". We offer a sleek digital portal with automated optimizations, reduced costs, and direct self-service options, enabling customers to achieve results 10x faster.`,
  targetCustomers: `Our primary customers in "${d.targetMarket}" include small-to-medium business owners, tech-savvy early adopters, and enterprise companies looking for process automation. They value speed, transparency, and data-driven results.`,
  marketAnalysis: `The market size for this sector is experiencing a 15% CAGR. This rapid growth is driven by digitalization trends. By focusing initially on our niche, we project capturing 2% of SAM (Serviceable Addressable Market) within the first 18 months.`,
  competitiveAnalysis: `Major competitors include legacy providers who are slow to innovate and hold high price barriers. ${d.name} differentiates itself through smart automation, lower entry costs, and localized support.`,
  marketingStrategy: `We will utilize a multi-channel acquisition strategy focusing on: 1) Content marketing and SEO targeting search terms in "${d.targetMarket}". 2) Paid acquisition channels (Google Ads, LinkedIn Ads). 3) Strategic partnerships with industry aggregators.`,
  salesStrategy: `Our sales pipeline will consist of a self-serve tier for SMB users and a direct outbound sales team targeting enterprise customers. Product demos, free trial structures, and automated onboarding will drive high conversion rates.`,
  revenueModel: `Operating under the "${d.revenueModel}" structure, our pricing strategy includes a tiered subscription model (Starter, Professional, and Enterprise plans) to maximize lifetime value (LTV) and secure steady monthly recurring revenue (MRR).`,
  operationsPlan: `Day-to-day operations are handled remotely by a distributed team. Our processes are automated using SaaS software for task tracking, customer support, and sales pipelines, keeping operational overhead exceptionally low.`,
  technologyStack: `The application will be built using a modern stack: MongoDB for flexible databases, Node.js + Express for backend APIs, React + Tailwind CSS for a premium responsive frontend interface, and hosting on Vercel/Render with AWS S3 asset storage.`,
  hiringRequirements: `Over the next 12 months, we plan to hire: 2 Senior Full-Stack Developers, 1 Customer Support Specialist, and 1 Product Marketing Manager. This will allow us to scale product development and maintain customer happiness.`,
  riskAnalysis: `Key risks include: 1) Customer churn - mitigated by continuous product feedback loops. 2) Competitor retaliation - mitigated by fast feature iterations. 3) Regulatory compliance changes - mitigated by hiring external compliance advisors.`,
  financialProjection: `With initial traction, we project reaching profitability by Month 14. We estimate reaching $150,000 in monthly recurring revenue (MRR) by Year 2, with gross margins stabilizing around 82%.`,
  fiveYearGrowthPlan: `Year 1: Product launch and local product-market fit. Year 2: Expand features and grow SMB base. Year 3: Launch enterprise sales and double team. Year 4: International expansion. Year 5: Market leadership and preparation for exit or IPO.`,
  fundingRequirements: `We are raising $500,000 in seed capital. The funds will be allocated as follows: 50% for product engineering, 30% for marketing and customer acquisition, and 20% for operational reserves.`,
  conclusion: `${d.name} represents a highly scalable opportunity in a growing market. With a clear vision, a superior technological approach, and an experienced team, we are positioned to capture market share and return strong value to stakeholders.`
});

const generateMockMarketResearch = (d) => ({
  marketSize: `For "${d.targetMarket}", the Total Addressable Market (TAM) is estimated at $8.5 Billion. The Serviceable Addressable Market (SAM) is $1.2 Billion, and our initial target Serviceable Obtainable Market (SOM) is $45 Million.`,
  targetAudience: `Demographics: Age 22-48, professionals, founders, and managers in modern businesses. Geographics: Primarily metropolitan hubs and digital-first business centers. Psychographics: Value speed, automation, and efficiency.`,
  industryTrends: [
    "Accelerated shift toward cloud-based automation tools",
    "Rising demand for AI-driven business intelligence",
    "Growing integration of visual data metrics over raw spreadsheets",
    "Heightened security compliance standards globally"
  ],
  competitorAnalysis: `The market contains three primary segments: 1) Legacy providers (reliable but expensive and slow), 2) Modern startups (quick but lacks enterprise security), and 3) In-house custom solutions (expensive to maintain).`,
  swotAnalysis: {
    strengths: ["Innovative tech leveraging AI", "Low development overhead", "Agile product roadmap execution"],
    weaknesses: ["New brand with low initial awareness", "Limited initial sales force", "Dependency on API integrations"],
    opportunities: ["Rapid expansion of target market segment", "Untapped geographic regions", "Strategic integrations with Slack/Teams"],
    threats: ["Low barriers to entry for basic clones", "Pricing wars from legacy players", "Fluctuating server API hosting costs"]
  },
  pestleAnalysis: {
    political: "Stable remote-work policies encourage digital tool adoptions worldwide.",
    economic: "High interest rates favor cost-saving tools over expensive enterprise software suites.",
    social: "Modern founders prefer automated workflows to minimize employee headcount.",
    technological: "Advancements in LLMs and cloud structures enable rapid, powerful API integrations.",
    environmental: "Digital operations create a nearly zero carbon footprint compared to legacy setups.",
    legal: "Stricter data privacy laws (GDPR, CCPA) require high encryption standards."
  },
  customerPersonas: [
    {
      name: "Startup Founder Sarah",
      demographics: "Age 29, CEO of pre-seed tech startup, resides in Austin TX.",
      painPoints: ["Lacks time to build manually", "Has restricted pre-seed budget"],
      goals: ["Get investor-ready fast", "Validate ideas with minimal code"]
    },
    {
      name: "Corporate Innovator Mark",
      demographics: "Age 42, Director of Product at Mid-Market SaaS company, resides in Chicago.",
      painPoints: ["Legacy bureaucracy slows down new project launches", "Cross-team alignment issues"],
      goals: ["Build quick MVP validation test", "Present clean pitch decks to board directors"]
    }
  ],
  regulatoryRequirements: "Requires compliance with standard data encryption protocols (SSL/TLS), GDPR compliance for European user storage, and secure authentication standards (JWT/OAuth).",
  growthOpportunities: [
    "Creating white-label reporting versions for consultancies",
    "Integrating auto-sync with accounting platforms like QuickBooks"
  ],
  challenges: [
    "High customer acquisition cost (CAC) in early phases",
    "Educating non-technical users on the power of automated modeling"
  ]
});

const generateMockPitchDeck = (d) => ({
  slides: [
    {
      slideNumber: 1,
      title: "Title Slide",
      subtitle: `${d.name} - Pitch Presentation`,
      content: `Revolutionizing "${d.targetMarket}" through modern, automated tools.\nCreated for: "${d.idea}"\nFunding Stage: "${d.fundingStage}"`,
      speakerNotes: "Hello everyone, thank you for joining. Today I'm excited to present our company, which solves critical bottlenecks in our industry."
    },
    {
      slideNumber: 2,
      title: "Problem",
      subtitle: "The Core Pain Point",
      content: `1. Customers in "${d.targetMarket}" waste weeks on manual processes.\n2. Legacy tools are expensive and require high learning curves.\n3. Businesses lose revenue due to slow operational iterations.`,
      speakerNotes: "The problem is simple: founders and companies are wasting countless hours using outdated models. This slows down their growth."
    },
    {
      slideNumber: 3,
      title: "Solution",
      subtitle: "Our Innovative Product",
      content: `We introduce ${d.name}, powered by our unique methodology: "${d.idea}".\n- 10x faster execution than manual alternatives.\n- 70% cheaper than custom consultancies.\n- Sleek, intuitive self-serve design.`,
      speakerNotes: "Our solution is a complete workspace that automates these manual pipelines, delivering accurate outputs in minutes instead of weeks."
    },
    {
      slideNumber: 4,
      title: "Market Opportunity",
      subtitle: "Size & Timing",
      content: `- Total Addressable Market (TAM): $8.5 Billion\n- Serviceable Addressable Market (SAM): $1.2 Billion\n- Market is expanding at a 15% CAGR, driven by global automation trends.`,
      speakerNotes: "The timing is perfect. Cloud computing and AI are now mature enough to power this product, and the target market is eager for solutions."
    },
    {
      slideNumber: 5,
      title: "Business Model",
      subtitle: `Revenue Structure: "${d.revenueModel}"`,
      content: `- Tiered subscription plans: Starter ($29/mo), Pro ($79/mo), and Enterprise ($299/mo).\n- Enterprise custom licenses.\n- 82% projected gross margins with steady monthly recurring revenue.`,
      speakerNotes: "We use a predictable SaaS subscription model, which keeps our income highly recurring and aligns our growth directly with our users."
    },
    {
      slideNumber: 6,
      title: "Competition",
      subtitle: "Our Market Edge",
      content: `- Legacy Players: Expensive, bloated, and slow to adapt.\n- Basic Clones: Fail to offer deep analytical modeling.\n- Our Edge: High-speed engine, beautiful dashboards, and interactive sharing.`,
      speakerNotes: "While there are legacy tools, they remain unaffordable for small teams. We bridge the gap between premium analytics and budget accessibility."
    },
    {
      slideNumber: 7,
      title: "Marketing & Sales",
      subtitle: "Go-To-Market Plan",
      content: `- Organic SEO and content targeting pain points.\n- Strategic partnerships with accelerators and incubators.\n- Inbound self-serve funnel backed by email onboarding sequences.`,
      speakerNotes: "Our marketing channels focus on digital acquisition. We target business hubs and search queries to attract high-intent leads."
    },
    {
      slideNumber: 8,
      title: "Financials",
      subtitle: "Projections & Milestones",
      content: `- Year 1: $180k ARR with 1,200 active users.\n- Year 2: $1.8M ARR as we scale up marketing.\n- Profitability achieved within 14 months of launching.`,
      speakerNotes: "Financially, we have a very low cost of goods sold. We project breaking even early in Year 2 and scaling rapidly thereafter."
    },
    {
      slideNumber: 9,
      title: "Roadmap",
      subtitle: "Execution Plan",
      content: `- Q1: Public Beta launch & feedback loops.\n- Q2: Integrations with third-party tools.\n- Q3: Launch Enterprise tier features.\n- Q4: Initiate Series A fundraising round.`,
      speakerNotes: "Here is our roadmap. We are focused on product development in the first half of the year, transitioning to scale in the second half."
    },
    {
      slideNumber: 10,
      title: "Investment Ask",
      subtitle: `Funding Stage: ${d.fundingStage}`,
      content: `- Raising $500,000 in Seed funding.\n- Allocation: 50% Engineering, 30% Marketing, 20% Operations.\n- Join us in reshaping this multi-billion dollar market.`,
      speakerNotes: "We are raising capital to accelerate our product engineering and scale customer acquisition. We'd love to welcome you as partners."
    }
  ]
});

const generateMockValidation = (d) => ({
  validationChecklist: [
    { task: "Interview 15 target users", description: "Validate if they face the problem in their weekly work." },
    { task: "Set up a landing page with email signup", description: "Measure conversion rate on the value proposition." },
    { task: "Pre-sell 5 early-access subscriptions", description: "Confirm willingness to pay before writing core code." },
    { task: "Publish competitive comparison sheet", description: "Distinguish from existing tools and track feedback." }
  ],
  customerInterviewQuestions: [
    "How do you currently handle your startup planning and analysis workflows?",
    "What is the most frustrating part of that process, and how long does it take?",
    "How much do you spend on tools or consultants to get this done?",
    "If a software tool could automate this, what would you expect to pay?"
  ],
  mvpPlanning: "Create a simple landing page displaying mockup analytics. Provide a manual form submission for plans, deliver results manually via email within 24 hours to prove validation.",
  goToMarketStrategy: "1) Join target startup communities on Reddit and Slack. 2) Offer free manual plans to the first 50 signups in exchange for case studies. 3) Leverage viral sharing of plan links.",
  launchChecklist: [
    { task: "Perform user testing with 5 friendly clients", stage: "Pre-launch" },
    { task: "Configure domain name, SEO tags, and analytical tracking", stage: "Pre-launch" },
    { task: "Submit product launch on Product Hunt and Betalist", stage: "Launch" },
    { task: "Email the waitlist with a 30% discount coupon", stage: "Launch" },
    { task: "Analyze heatmap tools to locate checkout friction", stage: "Post-launch" }
  ],
  earlyMetrics: ["Landing page signup conversion rate (Target > 15%)", "Customer Acquisition Cost (CAC)", "First week retention rate"],
  successKpis: ["Monthly Active Users (MAU)", "Customer Lifetime Value (LTV)", "Net Promoter Score (NPS)"],
  riskAssessment: "Risk: Competitors copying the automated engine. Mitigation: Build a strong community and integrate personalized coach chats that competitors cannot replicate."
});

const getMockCoachResponse = (chatHistory) => {
  const lastMessage = chatHistory[chatHistory.length - 1]?.text?.toLowerCase() || '';

  if (lastMessage.includes('marketing') || lastMessage.includes('sell') || lastMessage.includes('customer')) {
    return `### Marketing & Growth Advice 🚀

To get your first customers, focus on organic outreach. Here is a 3-step action plan:

1. **Leverage Niche Communities**: Hang out where your customers are. If you are B2B, look on LinkedIn and target Reddit groups. Don't spam—provide value and share your build journey.
2. **Cold Outreach**: Reach out to 50 target clients directly. Ask for feedback on your product, not a sale. This builds relationships and early champions.
3. **SEO Strategy**: Write articles solving specific problems your customers search for.

What specific marketing channel are you planning to start with?`;
  }

  if (lastMessage.includes('raise') || lastMessage.includes('funding') || lastMessage.includes('investor') || lastMessage.includes('money')) {
    return `### Fundraising Preparation Guidelines 💰

When preparing to pitch to investors, you need to display three core elements:

1. **Market Size (TAM)**: Show that your startup can become a $100M+ ARR business.
2. **Traction**: Highlight weekly user signups, engagement rates, or early pre-sales. Numbers speak louder than ideas.
3. **Founder-Market Fit**: Why is your team uniquely positioned to win this space?

I recommend preparing a **10-slide Pitch Deck** and a **financial model** showing how 18 months of runway will get you to key milestones. What is your current target raise amount?`;
  }

  if (lastMessage.includes('legal') || lastMessage.includes('patent') || lastMessage.includes('law')) {
    return `### Startup Legal Basics ⚖️

For early-stage startups, focus on these legal priorities:

- **Entity Formation**: Incorporate as a Delaware C-Corp if you plan to raise VC funds, or an LLC if you are bootstrapping.
- **Co-founder Agreements**: Detail vesting schedules (e.g. 4-year vesting with a 1-year cliff) to prevent future disputes.
- **Intellectual Property (IP)**: Ensure all team members sign IP assignment agreements.

*Disclaimer: I am an AI coach, not an attorney. Consult a legal professional before finalizing contracts.*`;
  }

  return `### Hello! I am your AI Startup Coach 🧠

I'm here to help you build and scale your startup. You can ask me questions about:
- **Product validation and launch**
- **Fundraising & investor preparation**
- **Growth marketing & customer acquisition**
- **Hiring & team structuring**

What startup challenge are we tackling today?`;
};
