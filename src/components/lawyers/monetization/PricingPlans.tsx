```typescript
import React from 'react';
import { Check, Star } from 'lucide-react';
import { Button } from '../../shared/ui/Button';

const PLANS = [
  {
    name: 'Basic',
    price: 0,
    description: 'Essential features for getting started',
    features: [
      'Basic profile listing',
      'Message with potential clients',
      'Document sharing',
      'Case management tools'
    ]
  },
  {
    name: 'Professional',
    price: 49,
    description: 'Advanced features for growing your practice',
    features: [
      'Premium directory placement',
      'Advanced analytics & insights', 
      'Priority support',
      'Custom branding',
      'Client collaboration tools',
      'Document templates'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: 99,
    description: 'Complete solution for established practices',
    features: [
      'All Professional features',
      'Dedicated account manager',
      'Custom integrations',
      'API access',
      'Advanced reporting',
      'Team collaboration tools',
      'White-label options'
    ]
  }
] as const;

export function PricingPlans() {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-center">
            Pricing Plans
          </h1>
          <p className="mt-5 text-xl text-gray-500 sm:text-center">
            Choose the perfect plan for your practice
          </p>
        </div>
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
          {PLANS.map((plan) => (
            <div key={plan.name} className={`
              rounded-lg shadow-sm divide-y divide-gray-200 
              ${plan.popular ? 'border-2 border-indigo-500' : 'border border-gray-200'}
            `}>
              <div className="p-6">
                {plan.popular && (
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      <Star className="h-4 w-4 mr-1" />
                      Popular
                    </span>
                  </div>
                )}
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  {plan.name}
                </h2>
                <p className="mt-4">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-base font-medium text-gray-500">
                    /month
                  </span>
                </p>
                <p className="mt-4 text-sm text-gray-500">
                  {plan.description}
                </p>
              </div>
              <div className="px-6 pt-6 pb-8">
                <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">
                  What's included
                </h3>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex space-x-3">
                      <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-8"
                  fullWidth
                  variant={plan.popular ? 'primary' : 'secondary'}
                >
                  {plan.price === 0 ? 'Get started' : 'Subscribe'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```