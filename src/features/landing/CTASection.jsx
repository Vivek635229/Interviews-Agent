import React from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../../components/animations/ScrollReveal';
import Button from '../../components/ui/Button';
import { ROUTES } from '../../constants/routes';

/**
 * CTASection — DESIGN.md component.cta-strip-dark.
 * Dark surface, heading-lg text, white pill CTA.
 */
const CTASection = () => (
  <section className="py-section">
    <div className="max-w-[900px] mx-auto px-6">
      <ScrollReveal>
        <div className="bg-surface-dark rounded-lg px-8 py-16 md:px-16 md:py-20 text-center">
          <h2 className="font-display text-display-lg text-on-dark mb-4">
            Ready to transform your interview skills?
          </h2>
          <p className="text-body-md text-on-dark-mute max-w-[480px] mx-auto mb-8">
            Join thousands of developers who have already improved their interview performance with AI-powered practice.
          </p>
          <Link to={ROUTES.DASHBOARD}>
            <Button variant="onDark" size="lg" icon="bi-arrow-right">
              Get Started Free
            </Button>
          </Link>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default CTASection;
