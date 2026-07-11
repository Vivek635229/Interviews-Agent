import React from 'react';
import Button from '../ui/Button';

/**
 * EmptyState — beautiful empty state placeholder.
 */
const EmptyState = ({ icon = 'bi-inbox', title, description, actionLabel, onAction }) => (
  <div className="flex flex-col items-center justify-center py-section text-center">
    <div className="w-16 h-16 rounded-full bg-surface-soft flex items-center justify-center mb-6">
      <i className={`${icon} text-2xl text-mute`} />
    </div>
    <h3 className="font-display text-heading-md text-ink mb-2">{title}</h3>
    <p className="text-body-sm text-body max-w-sm mb-6">{description}</p>
    {actionLabel && (
      <Button onClick={onAction}>{actionLabel}</Button>
    )}
  </div>
);

export default EmptyState;
