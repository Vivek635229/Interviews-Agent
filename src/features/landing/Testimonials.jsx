import React from 'react';
import ScrollReveal from '../../components/animations/ScrollReveal';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import { TESTIMONIALS } from '../../constants/mockData';

/**
 * Testimonials — user testimonials with avatar and role.
 */
const Testimonials = () => (
  <section id="testimonials" className="py-section bg-surface-soft">
    <div className="max-w-[1200px] mx-auto px-6">
      <ScrollReveal>
        <div className="text-center mb-16">
          <h2 className="font-display text-display-lg text-ink mb-4">
            Loved by engineers worldwide
          </h2>
          <p className="text-body-md text-body max-w-[480px] mx-auto">
            Join thousands of developers who have transformed their interview performance.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <ScrollReveal key={t.id} delay={i * 0.1}>
            <Card className="h-full flex flex-col">
              {/* Stars */}
              <div className="flex gap-1 mb-4 text-ink">
                {[...Array(5)].map((_, j) => (
                  <i key={j} className="bi-star-fill text-sm" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-body-md text-body flex-1 mb-6">"{t.content}"</p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-hairline">
                <Avatar name={t.name} size="sm" />
                <div>
                  <p className="text-body-sm-strong text-ink">{t.name}</p>
                  <p className="text-caption-sm text-mute">{t.role}</p>
                </div>
              </div>
            </Card>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
