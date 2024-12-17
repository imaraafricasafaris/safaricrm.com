import React from 'react';
import { LeadScore, SafariRecommendation, AutomationFlow } from '../../services/aiLeadService';
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";

interface LeadAIRecommendationsProps {
  leadScore: LeadScore;
  recommendations: SafariRecommendation[];
  selectedAutomations: AutomationFlow[];
  onAutomationToggle: (automationId: string) => void;
}

export default function LeadAIRecommendations({
  leadScore,
  recommendations,
  selectedAutomations,
  onAutomationToggle
}: LeadAIRecommendationsProps) {
  return (
    <div className="space-y-8">
      {/* Lead Score Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Lead Score Analysis
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Overall Score</span>
            <Badge
              variant={leadScore.priority === 'high' ? 'success' : leadScore.priority === 'medium' ? 'warning' : 'default'}
            >
              {leadScore.priority.toUpperCase()}
            </Badge>
          </div>
          <Progress value={leadScore.score} max={100} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {leadScore.factors.map((factor, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {factor.category}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {factor.score} pts
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {factor.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Personalized Safari Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((recommendation) => (
            <Card key={recommendation.id} className="relative overflow-hidden">
              <div className="absolute top-3 right-3">
                <Badge variant="secondary">
                  {recommendation.matchScore}% Match
                </Badge>
              </div>
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {recommendation.name}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {recommendation.description}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Estimated Budget
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${recommendation.estimatedBudget.min.toLocaleString()} - $
                      {recommendation.estimatedBudget.max.toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Highlights
                    </span>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {recommendation.highlights.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Automation Flows Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recommended Follow-up Automations
        </h3>
        <div className="space-y-4">
          {selectedAutomations.map((automation) => (
            <div
              key={automation.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-medium text-gray-900 dark:text-white">
                    {automation.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {automation.description}
                  </p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => onAutomationToggle(automation.id)}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${
                        automation.isActive
                          ? 'bg-primary/10 text-primary hover:bg-primary/20'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }
                    `}
                  >
                    {automation.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {automation.steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                  >
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 mr-3">
                      {index + 1}
                    </span>
                    <span>
                      {step.type === 'email'
                        ? 'Send Email:'
                        : step.type === 'task'
                        ? 'Create Task:'
                        : ''}{' '}
                      {step.action.replace('_', ' ')}
                      {step.delay
                        ? ` (after ${step.delay}h)`
                        : ' (immediately)'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
