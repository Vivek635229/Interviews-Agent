import React from 'react';
import ScrollReveal from '../../components/animations/ScrollReveal';
import { HOW_IT_WORKS_STEPS } from '../../constants/mockData';

/**
 * HowItWorks — step-by-step timeline section.
 */
const HowItWorks = () => (
  <section id="how-it-works" className="py-section bg-surface-soft">
    <div className="max-w-[900px] mx-auto px-6">
      <ScrollReveal>
        <div className="text-center mb-16">
          <h2 className="font-display text-display-lg text-ink mb-4">
            How it works
          </h2>
          <p className="text-body-md text-body max-w-[480px] mx-auto">
            Get started in four simple steps. From resume upload to detailed performance insights.
          </p>
        </div>
      </ScrollReveal>

      <div className="relative">
        {/* Vertical line */}
        <div className="hidden md:block absolute left-8 top-0 bottom-0 w-px bg-hairline" />

        <div className="space-y-12">
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <ScrollReveal key={step.step} delay={i * 0.15}>
              <div className="flex gap-6 md:gap-8">
                {/* Step number */}
                <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center font-display text-heading-md">
                  {step.step}
                </div>

                {/* Content */}
                <div className="pt-3">
                  <h3 className="font-display text-heading-sm text-ink mb-2">{step.title}</h3>
                  <p className="text-body-sm text-body max-w-[440px]">{step.description}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorks;
