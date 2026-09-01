/**
 * AI Task Assistant Engine for "Your task"
 * Generates smart, actionable subtasks based on task title and context.
 */

export function generateAISubtasks(taskTitle, category = 'general') {
  const title = taskTitle.toLowerCase();

  // Smart template heuristics
  if (title.includes('app') || title.includes('website') || title.includes('build') || title.includes('code')) {
    return [
      { id: Date.now() + 1, title: 'Outline core UI layout & wireframe specifications', completed: false },
      { id: Date.now() + 2, title: 'Set up component hierarchy and state architecture', completed: false },
      { id: Date.now() + 3, title: 'Implement responsive styling & dark mode aesthetics', completed: false },
      { id: Date.now() + 4, title: 'Perform cross-browser testing and optimization', completed: false }
    ];
  }

  if (title.includes('design') || title.includes('logo') || title.includes('ui') || title.includes('ux')) {
    return [
      { id: Date.now() + 1, title: 'Gather visual inspiration & color moodboard', completed: false },
      { id: Date.now() + 2, title: 'Draft high-fidelity typography & component system', completed: false },
      { id: Date.now() + 3, title: 'Create interactive prototype transitions', completed: false },
      { id: Date.now() + 4, title: 'Collect stakeholder feedback and polish details', completed: false }
    ];
  }

  if (title.includes('report') || title.includes('deck') || title.includes('presentation') || title.includes('write') || title.includes('doc')) {
    return [
      { id: Date.now() + 1, title: 'Research key metrics, sources, and data points', completed: false },
      { id: Date.now() + 2, title: 'Draft executive summary & structural outline', completed: false },
      { id: Date.now() + 3, title: 'Refine visual slides/formatting for clarity', completed: false },
      { id: Date.now() + 4, title: 'Final proofread and export clean PDF', completed: false }
    ];
  }

  if (title.includes('workout') || title.includes('gym') || title.includes('health') || title.includes('run')) {
    return [
      { id: Date.now() + 1, title: 'Prepare hydration & workout gear', completed: false },
      { id: Date.now() + 2, title: 'Complete 10-min mobility warmup', completed: false },
      { id: Date.now() + 3, title: 'Execute targeted high-intensity training session', completed: false },
      { id: Date.now() + 4, title: 'Post-workout stretch & recovery nutrition', completed: false }
    ];
  }

  if (title.includes('meeting') || title.includes('call') || title.includes('interview')) {
    return [
      { id: Date.now() + 1, title: 'Review agenda & key discussion topics', completed: false },
      { id: Date.now() + 2, title: 'Prepare slide deck & background notes', completed: false },
      { id: Date.now() + 3, title: 'Document action items & clear next steps', completed: false }
    ];
  }

  // Fallback generic intelligent subtasks
  return [
    { id: Date.now() + 1, title: `Deconstruct requirements for "${taskTitle}"`, completed: false },
    { id: Date.now() + 2, title: 'Execute primary milestone phase', completed: false },
    { id: Date.now() + 3, title: 'Review output & confirm quality checklist', completed: false }
  ];
}

/**
 * Calculates Eisenhower Matrix priority quadrant & effort score
 */
export function evaluateTaskPriority(priority, dueDate, estimatedMinutes) {
  let score = 50;

  if (priority === 'high') score += 35;
  if (priority === 'low') score -= 20;

  if (dueDate) {
    const hoursLeft = (new Date(dueDate) - new Date()) / (1000 * 60 * 60);
    if (hoursLeft < 24) score += 30;
    else if (hoursLeft < 72) score += 15;
  }

  if (estimatedMinutes > 60) score += 10;

  let quadrant = 'Do First';
  if (score >= 75) quadrant = 'Do First (Urgent & Important)';
  else if (score >= 50) quadrant = 'Schedule (Important)';
  else if (score >= 35) quadrant = 'Delegate (Urgent)';
  else quadrant = 'Backlog (Low Impact)';

  return { score: Math.min(100, Math.max(0, score)), quadrant };
}
