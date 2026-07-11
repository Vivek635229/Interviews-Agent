import React from 'react';
import Card from '../../components/ui/Card';
import ScrollReveal from '../../components/animations/ScrollReveal';
import { FEATURES } from '../../constants/mockData';

/**
 * FeatureCards — 3-up grid following DESIGN.md pricing-card layout pattern.
 */
const FeatureCards = () => (
  <section id="features" className="py-section max-w-[1200px] mx-auto px-6">
    <ScrollReveal>
      <div className="text-center mb-16">
        <h2 className="font-display text-display-lg text-ink mb-4">
          Everything you need to ace your interview
        </h2>
        <p className="text-body-md text-body max-w-[560px] mx-auto">
          Our AI-powered platform provides comprehensive tools to prepare, practice, and perfect your interview skills.
        </p>
      </div>
    </ScrollReveal>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {FEATURES.map((feature, i) => (
        <ScrollReveal key={feature.id} delay={i * 0.1}>
          <Card hoverable className="h-full">
            <div className="w-10 h-10 rounded-full bg-surface-soft flex items-center justify-center mb-4">
              <i className={`${feature.icon} text-lg text-ink`} />
            </div>
            <h3 className="font-display text-heading-sm text-ink mb-2">{feature.title}</h3>
            <p className="text-body-sm text-body">{feature.description}</p>
          </Card>
        </ScrollReveal>
      ))}
    </div>
  </section>
);

export default FeatureCards;
