import React from 'react';
import Hero from '../features/landing/Hero';
import FeatureCards from '../features/landing/FeatureCards';
import HowItWorks from '../features/landing/HowItWorks';
import Benefits from '../features/landing/Benefits';
import Testimonials from '../features/landing/Testimonials';
import FAQ from '../features/landing/FAQ';
import CTASection from '../features/landing/CTASection';

const Landing = () => (
  <>
    <Hero />
    <FeatureCards />
    <HowItWorks />
    <Benefits />
    <Testimonials />
    <FAQ />
    <CTASection />
  </>
);

export default Landing;
