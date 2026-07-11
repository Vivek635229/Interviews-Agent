import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../../components/animations/ScrollReveal';
import { FAQ_ITEMS } from '../../constants/mockData';

/**
 * FAQ — DESIGN.md component.faq-row.
 * Canvas bg, hairline bottom borders, heading-sm question, body-md answer.
 */
const FAQ = () => {
  const [openId, setOpenId] = useState(null);

  return (
    <section id="faq" className="py-section">
      <div className="max-w-[720px] mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="font-display text-display-lg text-ink mb-4">
              Frequently asked questions
            </h2>
            <p className="text-body-md text-body">
              Everything you need to know about InterviewAI.
            </p>
          </div>
        </ScrollReveal>

        <div className="divide-y divide-hairline">
          {FAQ_ITEMS.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 0.05}>
              <div className="py-4">
                <button
                  className="w-full flex items-center justify-between text-left"
                  onClick={() => setOpenId(openId === item.id ? null : item.id)}
                >
                  <span className="font-body text-heading-sm text-ink pr-4">{item.question}</span>
                  <motion.i
                    className={`bi-chevron-down text-sm text-mute flex-shrink-0`}
                    animate={{ rotate: openId === item.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  />
                </button>
                <AnimatePresence>
                  {openId === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="text-body-md text-body mt-3">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
