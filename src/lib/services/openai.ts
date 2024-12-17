import { OpenAI } from 'openai/index';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface LeadData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  budget: string | number;
  adults: string | number;
  children: string | number;
  duration: string | number;
  destinations: string[];
  trip_type: string[];
  preferred_dates: string;
  special_requirements?: string;
}

export class AIAnalysisError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'AIAnalysisError';
  }
}

export async function analyzeLead(leadData: LeadData) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert safari travel consultant. Your task is to analyze the lead and provide a comprehensive evaluation.
Please structure your response with clear sections:

Lead Score: [0-100]
Score Explanation: [Detailed explanation of the score]

Recommended Safari Packages:
1. [Package name and brief description]
2. [Package name and brief description]
3. [Package name and brief description]

Suggested Activities:
1. [Activity name and brief description]
2. [Activity name and brief description]
3. [Activity name and brief description]
4. [Activity name and brief description]

Recommended Accommodations:
1. [Accommodation name and brief description]
2. [Accommodation name and brief description]
3. [Accommodation name and brief description]

Follow-up Strategy:
Priority: [High/Medium/Low]
Approach: [Detailed approach]
Timeline: [Specific timeline]

Key Points to Address:
1. [Key point]
2. [Key point]
3. [Key point]`
        },
        {
          role: "user",
          content: `Please analyze this safari trip lead:
Name: ${leadData.first_name} ${leadData.last_name}
Budget: $${leadData.budget}
Group: ${leadData.adults} adults, ${leadData.children} children
Duration: ${leadData.duration} days
Destinations: ${leadData.destinations.join(', ')}
Trip Types: ${leadData.trip_type.join(', ')}
Preferred Dates: ${leadData.preferred_dates}
Special Requirements: ${leadData.special_requirements || 'None'}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new AIAnalysisError('No response received from AI');
    }

    // Parse the response into structured data
    const lines = content.split('\n');
    let currentSection = '';
    const result = {
      leadScore: 0,
      scoreExplanation: '',
      recommendations: {
        packages: [] as string[],
        activities: [] as string[],
        accommodations: [] as string[]
      },
      followUpStrategy: {
        priority: 'medium',
        suggestedApproach: '',
        timeline: '',
        keyPoints: [] as string[]
      }
    };

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      if (trimmedLine.toLowerCase().includes('lead score')) {
        const scoreMatch = trimmedLine.match(/\d+/);
        if (scoreMatch) {
          result.leadScore = Math.min(100, Math.max(0, parseInt(scoreMatch[0])));
        }
      } else if (trimmedLine.toLowerCase().includes('score explanation')) {
        currentSection = 'scoreExplanation';
      } else if (trimmedLine.toLowerCase().includes('recommended safari packages')) {
        currentSection = 'packages';
      } else if (trimmedLine.toLowerCase().includes('suggested activities')) {
        currentSection = 'activities';
      } else if (trimmedLine.toLowerCase().includes('recommended accommodations')) {
        currentSection = 'accommodations';
      } else if (trimmedLine.toLowerCase().includes('follow-up strategy')) {
        currentSection = 'followUp';
      } else if (trimmedLine.toLowerCase().includes('priority:')) {
        const priorityLine = trimmedLine.toLowerCase();
        if (priorityLine.includes('high')) result.followUpStrategy.priority = 'high';
        else if (priorityLine.includes('medium')) result.followUpStrategy.priority = 'medium';
        else if (priorityLine.includes('low')) result.followUpStrategy.priority = 'low';
      } else if (trimmedLine.toLowerCase().includes('approach:')) {
        result.followUpStrategy.suggestedApproach = trimmedLine.replace(/approach:/i, '').trim();
      } else if (trimmedLine.toLowerCase().includes('timeline:')) {
        result.followUpStrategy.timeline = trimmedLine.replace(/timeline:/i, '').trim();
      } else if (trimmedLine.toLowerCase().includes('key points')) {
        currentSection = 'keyPoints';
      } else if (trimmedLine.match(/^\d+\.|^-/)) {
        const item = trimmedLine.replace(/^\d+\.|^-/, '').trim();
        switch (currentSection) {
          case 'packages':
            if (item) result.recommendations.packages.push(item);
            break;
          case 'activities':
            if (item) result.recommendations.activities.push(item);
            break;
          case 'accommodations':
            if (item) result.recommendations.accommodations.push(item);
            break;
          case 'keyPoints':
            if (item) result.followUpStrategy.keyPoints.push(item);
            break;
        }
      } else if (currentSection === 'scoreExplanation' && !result.scoreExplanation) {
        result.scoreExplanation = trimmedLine;
      }
    }

    // Set default values if parsing failed
    if (result.leadScore === 0) {
      result.leadScore = 75; // Default to medium-high score
      result.scoreExplanation = 'Score based on budget and group size';
    }

    if (result.recommendations.packages.length === 0) {
      result.recommendations.packages = [
        'Classic Safari Experience - Perfect for first-time visitors',
        'Luxury Safari Adventure - High-end accommodations and exclusive experiences',
        'Family-Friendly Safari - Tailored activities for all ages'
      ];
    }

    if (result.recommendations.activities.length === 0) {
      result.recommendations.activities = [
        'Morning Game Drive - Best wildlife viewing opportunities',
        'Guided Nature Walk - Educational and interactive experience',
        'Cultural Village Visit - Authentic local interactions',
        'Sunset Photography Safari - Capture amazing moments'
      ];
    }

    if (result.recommendations.accommodations.length === 0) {
      result.recommendations.accommodations = [
        'Luxury Safari Lodge - 5-star comfort with stunning views',
        'Tented Safari Camp - Authentic safari experience',
        'Boutique Safari Hotel - Perfect blend of comfort and authenticity'
      ];
    }

    if (!result.followUpStrategy.suggestedApproach) {
      result.followUpStrategy.suggestedApproach = 'Personalized follow-up with detailed package information';
    }

    if (!result.followUpStrategy.timeline) {
      result.followUpStrategy.timeline = 'Initial contact within 24 hours';
    }

    if (result.followUpStrategy.keyPoints.length === 0) {
      result.followUpStrategy.keyPoints = [
        'Discuss preferred accommodation options',
        'Review activity preferences',
        'Address any special requirements',
        'Present customized package options'
      ];
    }

    return result;
  } catch (error) {
    if (error instanceof AIAnalysisError) {
      throw error;
    }
    console.error('Error analyzing lead with OpenAI:', error);
    throw new AIAnalysisError('Failed to analyze lead data', error);
  }
}
