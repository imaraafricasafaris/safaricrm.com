import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  UserPlus,
  Settings2,
  Search,
  ArrowLeft,
  ArrowRight,
  CheckSquare,
  Check,
  Grid,
  Sparkles,
  Calendar,
  MapPin,
  Users,
  Camera,
  X,
  Plane,
  Hotel,
  Coffee,
  Car,
  Loader2
} from 'lucide-react';
import { Lead, LeadDestination, LeadTripType } from '../../types/leads';
import { getLeadDestinations, getLeadTripTypes, createLead } from '../../lib/api/leads';
import toast from 'react-hot-toast';
import {
  calculateLeadScore,
  generateSafariRecommendations,
  getRelevantAutomations,
  type LeadScore,
  type SafariRecommendation,
  type AutomationFlow
} from '../../services/aiLeadService';
import LeadAIRecommendations from './LeadAIRecommendations';
import { analyzeLead } from '../../lib/services/openai';

interface FormInputs {
  name: string;
  email: string;
  phone?: string;
  country: string;
  destinations: string[];
  trip_type: string[];
  duration: number;
  arrival_date?: string;
  departure_date?: string;
  adults: number;
  children: number;
  message?: string;
  marketing_consent: boolean;
  lead_source: string;
  budget_range: string;
  priority_level: string;
  assigned_to?: string;
  company_notes?: string;
  follow_up_date?: string;
  tags: string[];
  // Safari Preferences
  preferred_safari_style: string[];
  wildlife_interests: string[];
  photography_equipment?: string;
  physical_fitness_level: string;
  dietary_requirements?: string;
  // Accommodation
  accommodation_type: string[];
  room_preferences: string[];
  special_requests?: string;
  // Activities
  preferred_activities: string[];
  special_interests: string[];
  experience_level: string;
  // Travel Logistics
  arrival_airport?: string;
  departure_airport?: string;
  need_visa_assistance: boolean;
  need_travel_insurance: boolean;
  transfer_requirements?: string;
  mobility_requirements?: string;
}

interface MultiStepLeadFormProps {
  onSuccess?: (lead: Lead) => void;
  onCancel?: () => void;
}

const leadSources = [
  { id: 'website', name: 'Website Inquiry' },
  { id: 'referral', name: 'Referral' },
  { id: 'social_media', name: 'Social Media' },
  { id: 'travel_agent', name: 'Travel Agent' },
  { id: 'trade_show', name: 'Trade Show' },
  { id: 'phone_inquiry', name: 'Phone Inquiry' },
  { id: 'email_campaign', name: 'Email Campaign' },
  { id: 'online_ads', name: 'Online Ads' },
  { id: 'other', name: 'Other' }
];

const priorityLevels = [
  { id: 'high', name: 'High Priority', description: 'Immediate follow-up required' },
  { id: 'medium', name: 'Medium Priority', description: 'Follow-up within 24 hours' },
  { id: 'low', name: 'Low Priority', description: 'Follow-up within 48 hours' }
];

const budgetRanges = [
  { id: 'economy', name: '< $2,000', description: 'Economy Package' },
  { id: 'standard', name: '$2,000 - $5,000', description: 'Standard Package' },
  { id: 'premium', name: '$5,000 - $10,000', description: 'Premium Package' },
  { id: 'luxury', name: '$10,000+', description: 'Luxury Package' }
];

const safariStyles = [
  { id: 'luxury', name: 'Luxury Safari', description: 'High-end lodges and exclusive experiences' },
  { id: 'adventure', name: 'Adventure Safari', description: 'Active and immersive wildlife experiences' },
  { id: 'family', name: 'Family Safari', description: 'Child-friendly activities and accommodations' },
  { id: 'photography', name: 'Photography Safari', description: 'Optimized for wildlife photography' },
  { id: 'cultural', name: 'Cultural Safari', description: 'Emphasis on local communities and traditions' },
  { id: 'mobile', name: 'Mobile Camping', description: 'Authentic bush camping experience' }
];

const wildlifeInterests = [
  { id: 'big_five', name: 'Big Five', description: 'Lion, Leopard, Elephant, Rhino, Buffalo' },
  { id: 'birds', name: 'Bird Watching', description: 'Over 1,000 species of birds' },
  { id: 'predators', name: 'Predators', description: 'Focus on carnivores and hunting behavior' },
  { id: 'primates', name: 'Primates', description: 'Gorillas, Chimpanzees, and other primates' },
  { id: 'marine', name: 'Marine Life', description: 'Coastal and marine wildlife' },
  { id: 'migration', name: 'Great Migration', description: 'Wildebeest and zebra migration' }
];

const accommodationTypes = [
  { id: 'luxury_lodge', name: 'Luxury Lodge', description: 'Premium lodges with all amenities' },
  { id: 'tented_camp', name: 'Tented Camp', description: 'Comfortable canvas accommodation' },
  { id: 'treehouse', name: 'Treehouse', description: 'Unique elevated accommodation' },
  { id: 'mobile_camp', name: 'Mobile Camp', description: 'Moving camp following wildlife' },
  { id: 'boutique', name: 'Boutique Hotel', description: 'Intimate, personalized service' },
  { id: 'villa', name: 'Private Villa', description: 'Exclusive use properties' }
];

const activities = [
  { id: 'game_drive', name: 'Game Drives', description: 'Traditional wildlife viewing' },
  { id: 'walking', name: 'Walking Safari', description: 'Guided bush walks' },
  { id: 'night_drive', name: 'Night Drives', description: 'Nocturnal wildlife viewing' },
  { id: 'boat_safari', name: 'Boat Safari', description: 'Water-based wildlife viewing' },
  { id: 'cultural_visit', name: 'Cultural Visits', description: 'Local community interactions' },
  { id: 'balloon', name: 'Hot Air Balloon', description: 'Aerial wildlife viewing' },
  { id: 'horseback', name: 'Horseback Safari', description: 'Riding among wildlife' },
  { id: 'photography', name: 'Photography', description: 'Specialized photo sessions' }
];

const roomTypes = [
  { id: 'single', name: 'Single Room', description: 'One person per room' },
  { id: 'double', name: 'Double Room', description: 'Queen/King bed for two' },
  { id: 'twin', name: 'Twin Room', description: 'Two single beds' },
  { id: 'triple', name: 'Triple Room', description: 'Three single beds or double + single' },
  { id: 'family', name: 'Family Room', description: 'Spacious room for families' },
  { id: 'suite', name: 'Suite', description: 'Separate living area and bedroom' },
  { id: 'interconnected', name: 'Interconnected Rooms', description: 'Two rooms with connecting door' },
];

const transportOptions = [
  { 
    id: 'landcruiser', 
    name: '4x4 Safari Land Cruiser', 
    description: 'Spacious and comfortable with pop-up roof for game viewing',
    capacity: '6-7 passengers'
  },
  { 
    id: 'safarivan', 
    name: '4x4 Safari Van', 
    description: 'Excellent visibility with pop-up roof',
    capacity: '7-8 passengers'
  },
  { 
    id: 'minibus', 
    name: 'Safari Minibus', 
    description: 'Ideal for larger groups',
    capacity: '12-14 passengers'
  },
  { 
    id: 'van', 
    name: 'Luxury Van', 
    description: 'Comfortable for airport transfers and city tours',
    capacity: '8-10 passengers'
  },
  { 
    id: 'sedan', 
    name: 'Sedan', 
    description: 'Perfect for airport transfers and city tours',
    capacity: '3-4 passengers'
  }
];

const safariDestinations = {
  kenya: {
    name: 'Kenya',
    destinations: [
      {
        id: 'masai-mara',
        name: 'Masai Mara',
        description: 'Famous for the Great Migration and big cats'
      },
      {
        id: 'amboseli',
        name: 'Amboseli',
        description: 'Best views of Mt. Kilimanjaro and large elephant herds'
      },
      {
        id: 'samburu',
        name: 'Samburu',
        description: 'Unique species and stunning landscapes'
      },
      {
        id: 'tsavo',
        name: 'Tsavo',
        description: 'Kenya\'s largest national park with diverse wildlife'
      }
    ]
  },
  tanzania: {
    name: 'Tanzania',
    destinations: [
      {
        id: 'serengeti',
        name: 'Serengeti',
        description: 'Endless plains and spectacular wildlife migrations'
      },
      {
        id: 'ngorongoro',
        name: 'Ngorongoro Crater',
        description: 'Natural wonder with dense wildlife populations'
      },
      {
        id: 'tarangire',
        name: 'Tarangire',
        description: 'Famous for its ancient baobab trees and elephants'
      },
      {
        id: 'zanzibar',
        name: 'Zanzibar',
        description: 'Pristine beaches and historic Stone Town'
      }
    ]
  },
  uganda: {
    name: 'Uganda',
    destinations: [
      {
        id: 'bwindi',
        name: 'Bwindi Impenetrable Forest',
        description: 'Mountain gorilla tracking and bird watching'
      },
      {
        id: 'queen-elizabeth',
        name: 'Queen Elizabeth National Park',
        description: 'Tree-climbing lions and diverse ecosystems'
      },
      {
        id: 'kibale',
        name: 'Kibale Forest',
        description: 'Chimpanzee tracking and primate viewing'
      }
    ]
  },
  rwanda: {
    name: 'Rwanda',
    destinations: [
      {
        id: 'volcanoes',
        name: 'Volcanoes National Park',
        description: 'Mountain gorillas and golden monkeys'
      },
      {
        id: 'nyungwe',
        name: 'Nyungwe Forest',
        description: 'Canopy walks and diverse primates'
      },
      {
        id: 'akagera',
        name: 'Akagera National Park',
        description: 'Big Five and scenic savannah landscapes'
      }
    ]
  },
  southAfrica: {
    name: 'South Africa',
    destinations: [
      {
        id: 'kruger',
        name: 'Kruger National Park',
        description: 'Big Five and luxury lodges'
      },
      {
        id: 'cape-town',
        name: 'Cape Town',
        description: 'Table Mountain and Cape Peninsula'
      },
      {
        id: 'garden-route',
        name: 'Garden Route',
        description: 'Scenic coastal drive and wildlife experiences'
      }
    ]
  }
};

const steps = [
  { id: 'welcome', title: 'New Lead', icon: UserPlus },
  { id: 'lead-source', title: 'Lead Details', icon: Search },
  { id: 'client-info', title: 'Client Info', icon: Grid },
  { id: 'destinations', title: 'Destinations', icon: MapPin },
  { id: 'safari-preferences', title: 'Safari Preferences', icon: Camera },
  { id: 'accommodation', title: 'Accommodation', icon: Hotel },
  { id: 'activities', title: 'Activities', icon: Coffee },
  { id: 'travel-logistics', title: 'Travel Logistics', icon: Plane },
  { id: 'company-notes', title: 'Internal Notes', icon: Sparkles },
  { id: 'ai_recommendations', title: 'AI Recommendations', icon: Sparkles },
];

export default function MultiStepLeadForm({ onSuccess, onCancel }: MultiStepLeadFormProps) {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [destinations, setDestinations] = useState<LeadDestination[]>([]);
  const [tripTypes, setTripTypes] = useState<LeadTripType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [leadScore, setLeadScore] = useState<LeadScore | null>(null);
  const [recommendations, setRecommendations] = useState<SafariRecommendation[]>([]);
  const [selectedAutomations, setSelectedAutomations] = useState<AutomationFlow[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors }
  } = useForm<FormInputs>({
    defaultValues: {
      destinations: [],
      trip_type: [],
      marketing_consent: false
    }
  });

  const watchDestinations = watch('destinations');
  const watchTripTypes = watch('trip_type');

  const handleViewAIAnalysis = async () => {
    const data = getValues();
    await handleFormSubmit(data);
  };

  const handleFormSubmit = async (data: FormInputs) => {
    try {
      setIsLoading(true);
      setError('');

      const formattedData = {
        first_name: data.name,
        last_name: '',
        email: data.email,
        phone: data.phone,
        budget: 0,
        adults: data.adults,
        children: data.children,
        duration: data.duration,
        destinations: Array.isArray(data.destinations) ? data.destinations : [],
        trip_type: Array.isArray(data.trip_type) ? data.trip_type : [],
        preferred_dates: '',
        special_requirements: data.message
      };

      const aiAnalysis = await analyzeLead(formattedData);
      setAiAnalysis(aiAnalysis);
      setCurrentStep('ai_recommendations');
    } catch (error) {
      console.error('Error analyzing lead:', error);
      setError(error instanceof AIAnalysisError ? error.message : 'Failed to analyze lead data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipAIAnalysis = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Create default AI response
      const defaultAIResponse = {
        leadScore: 50, // Default medium score
        scoreExplanation: 'Score based on basic lead information',
        recommendations: {
          packages: ['Standard Safari Package'],
          activities: ['Game Drive', 'Nature Walk'],
          accommodations: ['Standard Lodge Accommodation']
        },
        followUpStrategy: {
          priority: 'medium',
          suggestedApproach: 'Standard follow-up approach',
          timeline: 'Follow up within 48 hours',
          keyPoints: ['Review requirements', 'Present standard packages']
        }
      };

      setAiAnalysis(defaultAIResponse);
      setCurrentStep(steps[steps.length - 1].id); // Move to final step
    } catch (error) {
      console.error('Error setting default values:', error);
      setError('Failed to skip AI analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!aiAnalysis) {
      setError('No AI analysis available');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const formData = getValues();
      const leadData = {
        // Lead base data
        name: `${formData.first_name} ${formData.last_name}`,
        email: formData.email,
        phone: formData.phone,
        country: formData.country || 'Unknown',
        status: 'new',
        source: 'manual',
        lead_score: aiAnalysis.leadScore,
        lead_temperature: aiAnalysis.leadScore >= 80 ? 'hot' : aiAnalysis.leadScore >= 50 ? 'warm' : 'cold',
        notes: 'Created via lead form',
        follow_up_priority: aiAnalysis.followUpStrategy.priority || 'medium',
        
        // Lead details data
        first_name: formData.first_name,
        last_name: formData.last_name,
        destinations: Array.isArray(formData.destinations) ? formData.destinations : [],
        trip_type: Array.isArray(formData.trip_type) ? formData.trip_type : [],
        duration: parseInt(formData.duration) || 1,
        preferred_dates: formData.preferred_dates,
        adults: parseInt(formData.adults) || 1,
        children: parseInt(formData.children) || 0,
        budget: parseFloat(formData.budget) || 0,
        special_requirements: formData.special_requirements || '',
        
        // AI analysis data
        ai_score: aiAnalysis.leadScore,
        ai_score_explanation: aiAnalysis.scoreExplanation,
        ai_recommended_packages: aiAnalysis.recommendations.packages,
        ai_recommended_activities: aiAnalysis.recommendations.activities,
        ai_recommended_accommodations: aiAnalysis.recommendations.accommodations,
        ai_follow_up_priority: aiAnalysis.followUpStrategy.priority,
        ai_follow_up_approach: aiAnalysis.followUpStrategy.suggestedApproach,
        ai_follow_up_timeline: aiAnalysis.followUpStrategy.timeline,
        ai_follow_up_key_points: aiAnalysis.followUpStrategy.keyPoints
      };

      const newLead = await createLead(leadData);
      toast.success('Lead created successfully!');
      // router.push(`/leads/${newLead.id}`);
    } catch (error) {
      console.error('Error creating lead:', error);
      setError('Failed to create lead. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutomationToggle = (automationId: string) => {
    setSelectedAutomations(prevAutomations =>
      prevAutomations.map(automation =>
        automation.id === automationId
          ? { ...automation, isActive: !automation.isActive }
          : automation
      )
    );
  };

  const handleSkipStep = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <div className="text-center space-y-6 sm:space-y-8 py-8 sm:py-12">
            <div className="flex justify-center">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-primary/10 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform">
                <UserPlus className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Add New Sales Lead
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Track and manage potential safari bookings with our AI-powered lead management system.
                Get intelligent insights and follow-up recommendations.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 sm:px-6 py-2 sm:py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep('lead-source')}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2 order-1 sm:order-2"
              >
                Start Adding Lead
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      case 'lead-source':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Lead Source & Priority
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Lead Source *
                    </label>
                    <select
                      {...register('lead_source', { required: 'Lead source is required' })}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    >
                      <option value="">Select lead source</option>
                      {leadSources.map(source => (
                        <option key={source.id} value={source.id}>{source.name}</option>
                      ))}
                    </select>
                    {errors.lead_source && (
                      <p className="mt-1 text-sm text-red-500">{errors.lead_source.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority Level *
                    </label>
                    <div className="space-y-2">
                      {priorityLevels.map(priority => (
                        <label
                          key={priority.id}
                          className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <input
                            type="radio"
                            value={priority.id}
                            {...register('priority_level', { required: 'Priority level is required' })}
                            className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                          />
                          <div className="ml-3">
                            <span className="block text-sm font-medium text-gray-900 dark:text-white">
                              {priority.name}
                            </span>
                            <span className="block text-sm text-gray-500 dark:text-gray-400">
                              {priority.description}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                    {errors.priority_level && (
                      <p className="mt-1 text-sm text-red-500">{errors.priority_level.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Budget & Assignment
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Budget Range *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {budgetRanges.map(range => (
                        <label
                          key={range.id}
                          className="relative flex flex-col p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <input
                            type="radio"
                            value={range.id}
                            {...register('budget_range', { required: 'Budget range is required' })}
                            className="absolute right-2 top-2 w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                          />
                          <span className="block text-sm font-medium text-gray-900 dark:text-white">
                            {range.name}
                          </span>
                          <span className="block text-sm text-gray-500 dark:text-gray-400">
                            {range.description}
                          </span>
                        </label>
                      ))}
                    </div>
                    {errors.budget_range && (
                      <p className="mt-1 text-sm text-red-500">{errors.budget_range.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Assign To
                    </label>
                    <select
                      {...register('assigned_to')}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    >
                      <option value="">Select team member</option>
                      <option value="john">John Smith</option>
                      <option value="sarah">Sarah Johnson</option>
                      <option value="mike">Mike Wilson</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Follow-up Date
                    </label>
                    <input
                      type="date"
                      {...register('follow_up_date')}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights Panel */}
            {/*
              <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/20">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    AI Insights
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Recommended Packages
                    </h4>
                    <ul className="space-y-2">
                      {aiSuggestions.suggestedPackages.map((pkg, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <CheckSquare className="w-4 h-4 text-primary" />
                          {pkg}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Follow-up Strategy
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {aiSuggestions.followUpStrategy}
                    </p>
                    <div className="mt-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Estimated Close Rate:
                      </span>
                      <span className="ml-2 text-sm text-primary font-medium">
                        {aiSuggestions.estimatedCloseRate}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            */}
          </div>
        );

      case 'client-info':
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  {...register('name', { 
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                  })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  {...register('phone', {
                    pattern: {
                      value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                      message: 'Invalid phone number'
                    }
                  })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="+1 (234) 567-8900"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  {...register('country', { required: 'Country is required' })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="Enter your country"
                />
                {errors.country && (
                  <p className="mt-1 text-sm text-red-500">{errors.country.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'destinations':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Choose Your Safari Destinations
                </h3>

                {/* Country Selection */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(safariDestinations).map(([countryKey, country]) => (
                    <button
                      key={countryKey}
                      type="button"
                      onClick={() => setSelectedCountry(countryKey)}
                      className={`
                        p-4 rounded-xl border text-left transition-all
                        ${selectedCountry === countryKey
                          ? 'border-primary bg-primary/5 dark:bg-primary/10'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      <h4 className="text-base font-medium text-gray-900 dark:text-white">
                        {country.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {country.destinations.length} destinations
                      </p>
                    </button>
                  ))}
                </div>

                {/* Destinations for Selected Country */}
                {selectedCountry && (
                  <div className="mt-6">
                    <h4 className="text-base font-medium text-gray-900 dark:text-white mb-3">
                      {safariDestinations[selectedCountry].name} Destinations
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {safariDestinations[selectedCountry].destinations.map(destination => {
                        const isSelected = Array.isArray(watchDestinations) && 
                          watchDestinations.includes(destination.id);
                        return (
                          <label
                            key={destination.id}
                            className={`
                              flex items-center p-4 rounded-xl border cursor-pointer transition-all
                              ${isSelected 
                                ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                              }
                            `}
                          >
                            <input
                              type="checkbox"
                              className="hidden"
                              value={destination.id}
                              {...register('destinations')}
                            />
                            <div className="flex-1">
                              <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-1">
                                {destination.name}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {destination.description}
                              </p>
                            </div>
                            {isSelected && <CheckSquare className="w-5 h-5 text-primary ml-4" />}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Trip Details
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Arrival Date
                      </label>
                      <input
                        type="date"
                        {...register('arrival_date')}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Departure Date
                      </label>
                      <input
                        type="date"
                        {...register('departure_date')}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Duration (days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      {...register('duration', { min: 1 })}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Adults
                      </label>
                      <input
                        type="number"
                        min="1"
                        {...register('adults', { min: 1 })}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Children
                      </label>
                      <input
                        type="number"
                        min="0"
                        {...register('children', { min: 0 })}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'safari-preferences':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Safari Style & Interests
                </h3>
                
                {/* Safari Styles */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Safari Style
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {safariStyles.map(style => {
                      const isSelected = Array.isArray(watch('preferred_safari_style')) && 
                        watch('preferred_safari_style').includes(style.id);
                      return (
                        <label
                          key={style.id}
                          className={`
                            flex items-center p-4 rounded-xl border cursor-pointer transition-all
                            ${isSelected 
                              ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                              : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }
                          `}
                        >
                          <input
                            type="checkbox"
                            className="hidden"
                            value={style.id}
                            {...register('preferred_safari_style')}
                          />
                          <div className="flex-1">
                            <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-1">
                              {style.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {style.description}
                            </p>
                          </div>
                          {isSelected && <CheckSquare className="w-5 h-5 text-primary ml-4" />}
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Wildlife Interests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Wildlife Interests
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {wildlifeInterests.map(interest => {
                      const isSelected = Array.isArray(watch('wildlife_interests')) && 
                        watch('wildlife_interests').includes(interest.id);
                      return (
                        <label
                          key={interest.id}
                          className={`
                            flex items-center p-4 rounded-xl border cursor-pointer transition-all
                            ${isSelected 
                              ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                              : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }
                          `}
                        >
                          <input
                            type="checkbox"
                            className="hidden"
                            value={interest.id}
                            {...register('wildlife_interests')}
                          />
                          <div className="flex-1">
                            <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-1">
                              {interest.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {interest.description}
                            </p>
                          </div>
                          {isSelected && <CheckSquare className="w-5 h-5 text-primary ml-4" />}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Additional Preferences
                </h3>
                <div className="space-y-4">
                  {/* Photography Equipment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Photography Equipment
                    </label>
                    <textarea
                      {...register('photography_equipment')}
                      rows={3}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                      placeholder="List any photography equipment you'll bring"
                    />
                  </div>

                  {/* Physical Fitness Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Physical Fitness Level
                    </label>
                    <select
                      {...register('physical_fitness_level', { required: 'Physical fitness level is required' })}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    >
                      <option value="">Select fitness level</option>
                      <option value="easy">Easy - Light walking, minimal physical activity</option>
                      <option value="moderate">Moderate - Regular walking, some hiking</option>
                      <option value="active">Active - Extended hiking, climbing</option>
                      <option value="challenging">Challenging - Strenuous activities, long hikes</option>
                    </select>
                  </div>

                  {/* Dietary Requirements */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Dietary Requirements
                    </label>
                    <textarea
                      {...register('dietary_requirements')}
                      rows={3}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                      placeholder="Any dietary restrictions or preferences?"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'accommodation':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Choose Your Accommodation
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {accommodationTypes.map(accommodation => {
                    const isSelected = Array.isArray(watch('accommodation_type')) && watch('accommodation_type').includes(accommodation.id);
                    return (
                      <label
                        key={accommodation.id}
                        className={`
                          flex items-center p-4 rounded-xl border cursor-pointer transition-all
                          ${isSelected 
                            ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }
                        `}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          value={accommodation.id}
                          {...register('accommodation_type')}
                        />
                        <div className="flex-1">
                          <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-1">
                            {accommodation.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {accommodation.description}
                          </p>
                        </div>
                        {isSelected && <CheckSquare className="w-5 h-5 text-primary ml-4" />}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Accommodation Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Room Preferences
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {roomTypes.map(room => {
                        return (
                          <label
                            key={room.id}
                            className="flex items-center p-4 rounded-xl border cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <input
                              type="radio"
                              value={room.id}
                              {...register('room_preferences')}
                              className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                            />
                            <div className="ml-3">
                              <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-1">
                                {room.name}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {room.description}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Special Requests
                    </label>
                    <textarea
                      {...register('special_requests')}
                      rows={4}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                      placeholder="Any special requests or requirements?"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'activities':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Choose Your Activities
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {activities.map(activity => {
                    const isSelected = Array.isArray(watch('preferred_activities')) && watch('preferred_activities').includes(activity.id);
                    return (
                      <label
                        key={activity.id}
                        className={`
                          flex items-center p-4 rounded-xl border cursor-pointer transition-all
                          ${isSelected 
                            ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }
                        `}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          value={activity.id}
                          {...register('preferred_activities')}
                        />
                        <div className="flex-1">
                          <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-1">
                            {activity.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {activity.description}
                          </p>
                        </div>
                        {isSelected && <CheckSquare className="w-5 h-5 text-primary ml-4" />}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Activity Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Experience Level
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {[1, 2, 3, 4, 5].map(level => {
                        return (
                          <label
                            key={level}
                            className="flex items-center p-4 rounded-xl border cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <input
                              type="radio"
                              value={level}
                              {...register('experience_level')}
                              className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                            />
                            <div className="ml-3">
                              <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-1">
                                Level {level}
                              </h4>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Special Interests
                    </label>
                    <textarea
                      {...register('special_interests')}
                      rows={4}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                      placeholder="Any special interests or requirements?"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'travel-logistics':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Choose Your Travel Logistics
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {transportOptions.map(option => {
                    return (
                      <label
                        key={option.id}
                        className="flex items-center p-4 rounded-xl border cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <input
                          type="radio"
                          value={option.id}
                          {...register('logistics')}
                          className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <div className="ml-3">
                          <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-1">
                            {option.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {option.description}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Capacity: {option.capacity}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Logistics Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Arrival Airport
                    </label>
                    <input
                      type="text"
                      {...register('arrival_airport')}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder="Enter arrival airport"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Departure Airport
                    </label>
                    <input
                      type="text"
                      {...register('departure_airport')}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder="Enter departure airport"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Need Visa Assistance
                      </label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          {...register('need_visa_assistance')}
                          className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Need Travel Insurance
                      </label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          {...register('need_travel_insurance')}
                          className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Transfer Requirements
                    </label>
                    <textarea
                      {...register('transfer_requirements')}
                      rows={4}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                      placeholder="Any transfer requirements?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mobility Requirements
                    </label>
                    <textarea
                      {...register('mobility_requirements')}
                      rows={4}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                      placeholder="Any mobility requirements?"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'company-notes':
        return (
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Company Notes Section */}
            <div className="space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Internal Notes & Follow-up
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company Notes
                </label>
                <textarea
                  {...register('company_notes')}
                  rows={4}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                  placeholder="Internal notes about the lead (e.g., specific requirements, budget flexibility, preferred lodges...)"
                />
              </div>

              {/* Safari-specific Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lead Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Luxury Safari', 'Budget Safari', 'Family Friendly',
                    'Honeymoon', 'Photography', 'Wildlife Focus',
                    'Cultural Experience', 'Adventure', 'First Timer',
                    'Repeat Client', 'Group Booking', 'Special Occasion'
                  ].map((tag) => (
                    <label
                      key={tag}
                      className="inline-flex items-center px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        value={tag}
                        {...register('tags')}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Follow-up Requirements */}
            <div className="space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Follow-up Requirements
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Required Documents
                  </label>
                  <div className="space-y-2">
                    {[
                      'Itinerary Proposal',
                      'Price Quote',
                      'Accommodation Options',
                      'Flight Details',
                      'Visa Requirements',
                      'Travel Insurance'
                    ].map((doc) => (
                      <label key={doc} className="flex items-start">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary mt-1"
                        />
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{doc}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Follow-up Actions
                  </label>
                  <div className="space-y-2">
                    {[
                      'Send Welcome Pack',
                      'Schedule Video Call',
                      'Share Sample Itineraries',
                      'Provide Destination Guide',
                      'Request Travel Dates',
                      'Discuss Budget Details'
                    ].map((action) => (
                      <label key={action} className="flex items-start">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary mt-1"
                        />
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{action}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Marketing Consent */}
            <div className="flex items-start space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center h-5 mt-1">
                <input
                  type="checkbox"
                  {...register('marketing_consent')}
                  className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  Add to marketing list for safari updates and promotional offers
                </label>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Client will receive our safari newsletter and exclusive offers. Can unsubscribe anytime.
                </p>
              </div>
            </div>
          </div>
        );

      case 'ai_recommendations':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                AI Analysis & Recommendations
              </h2>
              <button
                onClick={handleFinalSubmit}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Complete Lead
              </button>
            </div>
            
            {aiAnalysis && (
              <div className="space-y-6">
                <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-primary" />
                    Lead Score: {aiAnalysis.leadScore}/100
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{aiAnalysis.scoreExplanation}</p>
                </div>

                <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                  <h3 className="text-lg font-semibold mb-4">Recommended Packages</h3>
                  <div className="space-y-4">
                    {aiAnalysis.recommendations.packages.map((pkg: string, index: number) => (
                      <div key={index} className="flex items-start">
                        <CheckSquare className="w-5 h-5 mr-2 text-primary flex-shrink-0 mt-1" />
                        <p className="text-gray-600 dark:text-gray-400">{pkg}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                    <h3 className="text-lg font-semibold mb-4">Suggested Activities</h3>
                    <div className="space-y-3">
                      {aiAnalysis.recommendations.activities.map((activity: string, index: number) => (
                        <div key={index} className="flex items-start">
                          <CheckSquare className="w-5 h-5 mr-2 text-primary flex-shrink-0 mt-1" />
                          <p className="text-gray-600 dark:text-gray-400">{activity}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                    <h3 className="text-lg font-semibold mb-4">Recommended Accommodations</h3>
                    <div className="space-y-3">
                      {aiAnalysis.recommendations.accommodations.map((accommodation: string, index: number) => (
                        <div key={index} className="flex items-start">
                          <CheckSquare className="w-5 h-5 mr-2 text-primary flex-shrink-0 mt-1" />
                          <p className="text-gray-600 dark:text-gray-400">{accommodation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                  <h3 className="text-lg font-semibold mb-4">Follow-up Strategy</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Priority:</span>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        aiAnalysis.followUpStrategy.priority === 'high' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : aiAnalysis.followUpStrategy.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {aiAnalysis.followUpStrategy.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{aiAnalysis.followUpStrategy.suggestedApproach}</p>
                    <div className="space-y-2">
                      <p className="font-medium">Key Points to Address:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                        {aiAnalysis.followUpStrategy.keyPoints.map((point: string, index: number) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                      Suggested Timeline: {aiAnalysis.followUpStrategy.timeline}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const isLastStep = currentStep === steps[steps.length - 1].id;
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="min-h-[min(100vh,800px)] flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Close Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          aria-label="Close form"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
      {/* Progress Steps */}
      <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="hidden sm:flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isCurrent = step.id === currentStep;
              const isCompleted = currentStepIndex > index;
              return (
                <React.Fragment key={step.id}>
                  {index > 0 && (
                    <div className={`flex-1 h-0.5 ${isCompleted ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`} />
                  )}
                  <div className="relative group">
                    <div className={`
                      w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all
                      ${isCurrent ? 'bg-primary text-black scale-110' : 
                        isCompleted ? 'bg-primary/20 text-primary' : 
                        'bg-gray-100 dark:bg-gray-800 text-gray-400'
                      }
                      group-hover:scale-110
                    `}>
                      <StepIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {step.title}
                    </span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          {/* Mobile Step Indicator */}
          <div className="sm:hidden flex items-center justify-between px-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {steps[currentStepIndex].title}
            </span>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 px-3 sm:px-4 lg:px-6 py-4 sm:py-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              {renderStepContent()}
            </form>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      {currentStep !== 'welcome' && (
        <div className="sticky bottom-0 left-0 right-0 px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {currentStep !== steps[0].id && (
              <button
                type="button"
                onClick={() => {
                  const currentIndex = steps.findIndex(step => step.id === currentStep);
                  setCurrentStep(steps[currentIndex - 1].id);
                }}
                className="flex items-center justify-center min-w-[8rem] px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </button>
            )}

            <div className="flex gap-4 ml-auto">
              {currentStep !== steps[steps.length - 1].id && currentStep !== steps[steps.length - 2].id && (
                <button
                  type="button"
                  onClick={handleSkipStep}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 border border-transparent rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Skip Step
                </button>
              )}

              {currentStep === steps[steps.length - 2].id ? (
                <>
                  <button
                    type="button"
                    onClick={handleSkipAIAnalysis}
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 border border-transparent rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Skip AI Analysis
                  </button>
                  <button
                    type="button"
                    onClick={handleViewAIAnalysis}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-primary border border-transparent rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <span className="mr-2">Analyzing...</span>
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </>
                    ) : (
                      'View AI Analysis'
                    )}
                  </button>
                </>
              ) : currentStep === steps[steps.length - 1].id ? (
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-primary border border-transparent rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <span className="mr-2">Creating Lead...</span>
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </>
                  ) : (
                    'Create Lead'
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = steps.findIndex(step => step.id === currentStep);
                    setCurrentStep(steps[currentIndex + 1].id);
                  }}
                  className="flex-1 flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-primary border border-transparent rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
