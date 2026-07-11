import React from 'react';
import ScrollReveal from '../../components/animations/ScrollReveal';
import Card from '../../components/ui/Card';

/**
 * Benefits — key benefits section with dark accent card.
 * Uses DESIGN.md pricing-card-dark pattern for emphasis.
 */
const Benefits = () => {
  const benefits = [
    { icon: 'bi-lightning-charge', title: 'Instant Feedback', description: 'Get real-time scoring and detailed suggestions after every answer.' },
    { icon: 'bi-shield-check', title: 'Private & Secure', description: 'Your data stays yours. All conversations are encrypted and never shared.' },
    { icon: 'bi-globe', title: 'Industry Coverage', description: 'Questions tailored for 50+ roles across tech, finance, consulting, and more.' },
  ];

  return (
    <section className="py-section max-w-[1200px] mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left — Dark accent card (single dark moment per DESIGN.md) */}
        <ScrollReveal direction="left">
          <Card variant="dark" className="p-8 md:p-12">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-caption-sm text-on-dark-mute">
                <i className="bi-stars" />
                AI-Powered
              </span>
            </div>
            <h2 className="font-display text-display-lg text-on-dark mb-4">
              Your personal interview coach, available 24/7
            </h2>
            <p className="text-body-md text-on-dark-mute mb-8">
              Our AI understands context, adapts to your skill level, and provides the kind of feedback that only a senior engineer could give.
            </p>

            {/* Terminal mockup per DESIGN.md terminal-card */}
            <div className="bg-black/30 rounded-lg p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="w-3 h-3 rounded-full bg-terminal-red" />
                <span className="w-3 h-3 rounded-full bg-terminal-yellow" />
                <span className="w-3 h-3 rounded-full bg-terminal-green" />
              </div>
              <div className="font-mono text-code-sm text-on-dark-mute space-y-1">
                <p><span className="text-terminal-green">$</span> interviewai start --role "Frontend Developer"</p>
                <p className="text-on-dark">✓ Loading your resume profile...</p>
                <p className="text-on-dark">✓ Generating personalized questions...</p>
                <p className="text-terminal-green">● Interview session ready. 10 questions prepared.</p>
              </div>
            </div>
          </Card>
        </ScrollReveal>

        {/* Right — Benefit cards */}
        <div className="space-y-6">
          {benefits.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.1} direction="right">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-soft flex items-center justify-center flex-shrink-0">
                  <i className={`${item.icon} text-lg text-ink`} />
                </div>
                <div>
                  <h3 className="font-body text-body-strong text-ink mb-1">{item.title}</h3>
                  <p className="text-body-sm text-body">{item.description}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
