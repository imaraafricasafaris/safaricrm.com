import { LeadFormData } from '../types/leads';

export interface LeadScore {
  score: number;
  factors: {
    category: string;
    score: number;
    reason: string;
  }[];
  priority: 'high' | 'medium' | 'low';
}

export interface SafariRecommendation {
  id: string;
  name: string;
  description: string;
  matchScore: number;
  highlights: string[];
  estimatedBudget: {
    min: number;
    max: number;
  };
}

export interface AutomationFlow {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  steps: {
    type: string;
    action: string;
    delay?: number;
  }[];
  isActive: boolean;
}

export const calculateLeadScore = (leadData: LeadFormData): LeadScore => {
  let totalScore = 0;
  const factors = [];

  // Budget scoring
  if (leadData.budget) {
    const budgetScore = Math.min(leadData.budget / 1000, 30);
    totalScore += budgetScore;
    factors.push({
      category: 'Budget',
      score: budgetScore,
      reason: `Budget of ${leadData.budget} indicates strong purchasing power`
    });
  }

  // Group size scoring
  const groupSize = (leadData.adults || 0) + (leadData.children || 0);
  const groupScore = Math.min(groupSize * 5, 20);
  totalScore += groupScore;
  factors.push({
    category: 'Group Size',
    score: groupScore,
    reason: `Group size of ${groupSize} suggests significant booking potential`
  });

  // Duration scoring
  if (leadData.duration) {
    const durationScore = Math.min(leadData.duration * 2, 25);
    totalScore += durationScore;
    factors.push({
      category: 'Trip Duration',
      score: durationScore,
      reason: `${leadData.duration} day trip indicates higher value potential`
    });
  }

  // Destination scoring
  if (leadData.destinations && leadData.destinations.length > 0) {
    const destinationScore = Math.min(leadData.destinations.length * 5, 25);
    totalScore += destinationScore;
    factors.push({
      category: 'Destinations',
      score: destinationScore,
      reason: `Interest in ${leadData.destinations.length} destinations shows strong engagement`
    });
  }

  return {
    score: totalScore,
    factors,
    priority: totalScore >= 70 ? 'high' : totalScore >= 40 ? 'medium' : 'low'
  };
};

export const generateSafariRecommendations = (leadData: LeadFormData): SafariRecommendation[] => {
  const recommendations: SafariRecommendation[] = [];
  
  // Generate personalized recommendations based on user preferences
  if (leadData.destinations && leadData.destinations.length > 0) {
    leadData.destinations.forEach(destination => {
      const basePackage = getBasePackageForDestination(destination);
      if (basePackage) {
        recommendations.push({
          ...basePackage,
          matchScore: calculateMatchScore(basePackage, leadData)
        });
      }
    });
  }

  // Sort by match score
  return recommendations.sort((a, b) => b.matchScore - a.matchScore);
};

const getBasePackageForDestination = (destinationId: string): Omit<SafariRecommendation, 'matchScore'> | null => {
  const packages: { [key: string]: Omit<SafariRecommendation, 'matchScore'> } = {
    'masai-mara': {
      id: 'masai-luxury',
      name: 'Luxury Masai Mara Safari',
      description: 'Experience the ultimate luxury safari in the world-renowned Masai Mara',
      highlights: [
        'Luxury tented camps',
        'Private game drives',
        'Hot air balloon safari',
        'Cultural visits'
      ],
      estimatedBudget: {
        min: 5000,
        max: 10000
      }
    },
    'serengeti': {
      id: 'serengeti-migration',
      name: 'Great Migration Safari',
      description: 'Witness the spectacular wildebeest migration in the Serengeti',
      highlights: [
        'Migration viewing points',
        'Luxury lodges',
        'Professional photography guides',
        'All-inclusive package'
      ],
      estimatedBudget: {
        min: 6000,
        max: 12000
      }
    }
    // Add more base packages for other destinations
  };

  return packages[destinationId] || null;
};

const calculateMatchScore = (package_: Omit<SafariRecommendation, 'matchScore'>, leadData: LeadFormData): number => {
  let score = 0;

  // Budget match
  if (leadData.budget) {
    if (leadData.budget >= package_.estimatedBudget.min && leadData.budget <= package_.estimatedBudget.max) {
      score += 40;
    } else if (leadData.budget >= package_.estimatedBudget.min * 0.8) {
      score += 20;
    }
  }

  // Duration match
  if (leadData.duration) {
    if (leadData.duration >= 5 && leadData.duration <= 10) {
      score += 30;
    } else if (leadData.duration > 10) {
      score += 20;
    }
  }

  // Group size match
  const groupSize = (leadData.adults || 0) + (leadData.children || 0);
  if (groupSize >= 2 && groupSize <= 6) {
    score += 30;
  } else if (groupSize > 6) {
    score += 20;
  }

  return score;
};

export const getRelevantAutomations = (leadScore: LeadScore): AutomationFlow[] => {
  // This would typically fetch from your automation system
  // For now, returning mock data
  return [
    {
      id: 'high-value-nurture',
      name: 'High Value Lead Nurture',
      description: 'Premium follow-up sequence for high-value safari leads',
      triggers: ['lead.score >= 70'],
      steps: [
        {
          type: 'email',
          action: 'send_welcome',
          delay: 0
        },
        {
          type: 'email',
          action: 'send_brochure',
          delay: 24
        },
        {
          type: 'task',
          action: 'schedule_call',
          delay: 48
        }
      ],
      isActive: true
    },
    {
      id: 'medium-value-nurture',
      name: 'Standard Lead Nurture',
      description: 'Standard follow-up sequence for qualified leads',
      triggers: ['lead.score >= 40'],
      steps: [
        {
          type: 'email',
          action: 'send_welcome',
          delay: 0
        },
        {
          type: 'email',
          action: 'send_destinations',
          delay: 72
        }
      ],
      isActive: true
    }
  ];
};
