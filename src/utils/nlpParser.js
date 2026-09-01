/**
 * Smart Natural Language Task Parser for "Your task"
 * Parses title, due date, priority, tags, and estimated time from plain text.
 * Includes intelligent semantic priority detection & AI task formalizer.
 * Example: "Finalize presentation deck tomorrow at 3pm #work !high ~45m"
 */

export function parseNaturalLanguageTask(text) {
  if (!text || typeof text !== 'string') {
    return {
      title: '',
      tags: [],
      priority: 'medium',
      dueDate: null,
      estimatedMinutes: 30,
      cleanText: ''
    };
  }

  let workingText = text.trim();
  let priority = null; // will compute from explicit flag or semantic keywords
  let tags = [];
  let estimatedMinutes = 30;
  let dueDate = null;

  // 1. Extract Explicit Priority: !high, !urgent, !p1, !low, !p3, !medium, !p2
  const priorityRegex = /!(high|urgent|p1|low|p3|med|medium|p2)\b/i;
  const priorityMatch = workingText.match(priorityRegex);
  if (priorityMatch) {
    const val = priorityMatch[1].toLowerCase();
    if (['high', 'urgent', 'p1'].includes(val)) priority = 'high';
    else if (['low', 'p3'].includes(val)) priority = 'low';
    else priority = 'medium';
    workingText = workingText.replace(priorityMatch[0], '');
  }

  // 2. Extract Tags: #work, #personal, #design, etc.
  const tagRegex = /#([a-zA-Z0-9_-]+)/g;
  let tagMatch;
  while ((tagMatch = tagRegex.exec(workingText)) !== null) {
    tags.push(tagMatch[1].toLowerCase());
  }
  workingText = workingText.replace(tagRegex, '');

  // 3. Extract Duration: ~30m, ~1h, ~90mins, ~2hours
  const durationRegex = /~(\d+)\s*(m|min|mins|h|hr|hours)?\b/i;
  const durationMatch = workingText.match(durationRegex);
  if (durationMatch) {
    const amount = parseInt(durationMatch[1], 10);
    const unit = (durationMatch[2] || 'm').toLowerCase();
    if (unit.startsWith('h')) {
      estimatedMinutes = amount * 60;
    } else {
      estimatedMinutes = amount;
    }
    workingText = workingText.replace(durationMatch[0], '');
  }

  // 4. Extract Due Date Keywords: today, tomorrow, next friday, in 3 days, 2pm, etc.
  const dateResult = parseDateString(workingText);
  if (dateResult.date) {
    dueDate = dateResult.date;
    workingText = dateResult.cleanText;
  }

  // 5. Intelligent Semantic Auto-Priority Detection (if not explicitly overridden by user)
  if (!priority) {
    const lowerText = workingText.toLowerCase();
    
    // High Urgency / Critical keywords
    if (/\b(urgent|asap|critical|emergency|deadline|fix bug|deploy|production|exam|blocker|important|crucial|immediately)\b/i.test(lowerText)) {
      priority = 'high';
    } 
    // Low Urgency keywords
    else if (/\b(optional|someday|later|maybe|read book|explore|when free|casual|chill|backlog)\b/i.test(lowerText)) {
      priority = 'low';
    } 
    // Default to medium
    else {
      priority = 'medium';
    }
  }

  // Clean title
  const cleanTitle = workingText.replace(/\s+/g, ' ').trim();

  // Auto infer smart category tags if none provided
  if (tags.length === 0) {
    const lower = cleanTitle.toLowerCase();
    if (/\b(ui|ux|design|figma|logo|color|theme)\b/i.test(lower)) tags.push('design');
    else if (/\b(code|bug|api|build|dev|deploy|react|vite|css)\b/i.test(lower)) tags.push('dev');
    else if (/\b(meeting|call|client|sync|interview|chat)\b/i.test(lower)) tags.push('work');
    else if (/\b(gym|workout|health|run|diet|walk|doctor)\b/i.test(lower)) tags.push('health');
    else tags.push('general');
  }

  return {
    title: cleanTitle || text,
    tags: Array.from(new Set(tags)),
    priority,
    dueDate: dueDate ? dueDate.toISOString() : null,
    estimatedMinutes,
    cleanText: cleanTitle
  };
}

/**
 * Transforms raw, informal task thoughts into a polished, formalized, professional task title
 */
export function formalizeTaskThought(rawText) {
  if (!rawText || !rawText.trim()) return '';

  let cleaned = rawText.trim();

  // Common informal shorthand expansions
  const shorthandMap = {
    '\\btmrow\\b': 'tomorrow',
    '\\btmrw\\b': 'tomorrow',
    '\\btoday\\b': 'today',
    '\\babt\\b': 'about',
    '\\bw/\\b': 'with',
    '\\bw/o\\b': 'without',
    '\\bpls\\b': 'please',
    '\\basap\\b': 'as soon as possible',
    '\\bprep\\b': 'prepare',
    '\\bdoc\\b': 'documentation',
    '\\bdev\\b': 'develop',
    '\\bpresentation\\b': 'presentation',
    '\\bpp\\b': 'presentation'
  };

  Object.entries(shorthandMap).forEach(([pattern, replacement]) => {
    cleaned = cleaned.replace(new RegExp(pattern, 'gi'), replacement);
  });

  // Capitalize first letter of each sentence/word
  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);

  return cleaned;
}

function parseDateString(text) {
  let date = new Date();
  let matched = false;
  let cleanText = text;

  // Pattern: "today", "tomorrow"
  if (/\btoday\b/i.test(cleanText)) {
    date.setHours(18, 0, 0, 0);
    cleanText = cleanText.replace(/\btoday\b/i, '');
    matched = true;
  } else if (/\btomorrow\b/i.test(cleanText)) {
    date.setDate(date.getDate() + 1);
    date.setHours(10, 0, 0, 0);
    cleanText = cleanText.replace(/\btomorrow\b/i, '');
    matched = true;
  } else {
    // Pattern: "in X days"
    const inDaysMatch = cleanText.match(/\bin\s+(\d+)\s+days?\b/i);
    if (inDaysMatch) {
      const days = parseInt(inDaysMatch[1], 10);
      date.setDate(date.getDate() + days);
      date.setHours(17, 0, 0, 0);
      cleanText = cleanText.replace(inDaysMatch[0], '');
      matched = true;
    } else {
      // Pattern: "next (monday|tuesday|wednesday|thursday|friday|saturday|sunday)"
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const nextDayMatch = cleanText.match(/\bnext\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i);
      if (nextDayMatch) {
        const targetDay = dayNames.indexOf(nextDayMatch[1].toLowerCase());
        const currentDay = date.getDay();
        let daysToAdd = (targetDay + 7 - currentDay) % 7;
        if (daysToAdd === 0) daysToAdd = 7;
        date.setDate(date.getDate() + daysToAdd);
        date.setHours(10, 0, 0, 0);
        cleanText = cleanText.replace(nextDayMatch[0], '');
        matched = true;
      }
    }
  }

  // Pattern: "at 4pm", "at 15:30", "at 9am"
  const timeMatch = cleanText.match(/\bat\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i);
  if (timeMatch) {
    let hours = parseInt(timeMatch[1], 10);
    const minutes = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
    const ampm = timeMatch[3] ? timeMatch[3].toLowerCase() : null;

    if (ampm === 'pm' && hours < 12) hours += 12;
    if (ampm === 'am' && hours === 12) hours = 0;

    date.setHours(hours, minutes, 0, 0);
    cleanText = cleanText.replace(timeMatch[0], '');
    matched = true;
  }

  return {
    date: matched ? date : null,
    cleanText
  };
}

