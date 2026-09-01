/**
 * Smart English Spell Checker & Typo Detector for Task Titles
 * Uses a curated vocabulary of common English words, common typos, and Levenshtein edit distance.
 */

// Common typos dictionary mapping directly to correct English words
const COMMON_TYPO_MAP = {
  'teh': 'the',
  'tomorow': 'tomorrow',
  'tommorrow': 'tomorrow',
  'tommorow': 'tomorrow',
  'tomo': 'tomorrow',
  'tmrw': 'tomorrow',
  'tmrow': 'tomorrow',
  'yestarday': 'yesterday',
  'yesturday': 'yesterday',
  'asignment': 'assignment',
  'asign': 'assign',
  'repot': 'report',
  'reprot': 'report',
  'repoting': 'reporting',
  'documant': 'document',
  'documet': 'document',
  'documnt': 'document',
  'presenation': 'presentation',
  'presantation': 'presentation',
  'presentaion': 'presentation',
  'desing': 'design',
  'desgine': 'design',
  'desginer': 'designer',
  'schecule': 'schedule',
  'shedule': 'schedule',
  'schedul': 'schedule',
  'calender': 'calendar',
  'calander': 'calendar',
  'definately': 'definitely',
  'definitly': 'definitely',
  'recieve': 'receive',
  'recive': 'receive',
  'seperate': 'separate',
  'seprate': 'separate',
  'projcet': 'project',
  'projct': 'project',
  'projeck': 'project',
  'reivew': 'review',
  'reveiw': 'review',
  'reviw': 'review',
  'meating': 'meeting',
  'metting': 'meeting',
  'meating': 'meeting',
  'develope': 'develop',
  'develp': 'develop',
  'laucnh': 'launch',
  'luanch': 'launch',
  'clietn': 'client',
  'complte': 'complete',
  'complate': 'complete',
  'compleat': 'complete',
  'writting': 'writing',
  'writen': 'written',
  'foward': 'forward',
  'focuse': 'focus',
  'importent': 'important',
  'improtant': 'important',
  'urgnet': 'urgent',
  'ugent': 'urgent',
  'workign': 'working',
  'exersice': 'exercise',
  'exercize': 'exercise',
  'workkout': 'workout',
  'finaize': 'finalize',
  'finialize': 'finalize',
  'prapare': 'prepare',
  'preprare': 'prepare',
  'analize': 'analyze',
  'anlyze': 'analyze',
  'discus': 'discuss',
  'discusion': 'discussion',
  'updte': 'update',
  'upadte': 'update',
  'upldate': 'update'
};

// Common task vocabulary for distance matching
const TASK_VOCABULARY = [
  'assignment', 'presentation', 'meeting', 'review', 'design', 'development',
  'schedule', 'calendar', 'document', 'report', 'complete', 'finalize',
  'tomorrow', 'yesterday', 'project', 'launch', 'client', 'update',
  'prepare', 'exercise', 'workout', 'discuss', 'analyze', 'implement',
  'refactor', 'research', 'urgent', 'important', 'overview', 'summary',
  'create', 'deploy', 'inspect', 'verify', 'polish', 'structure', 'deliverable'
];

/**
 * Calculates Levenshtein distance between two strings
 */
function levenshtein(a, b) {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  
  const matrix = [];
  for (let i = 0; i <= bn; ++i) matrix[i] = [i];
  for (let i = 0; i <= an; ++i) matrix[0][i] = i;
  
  for (let i = 1; i <= bn; ++i) {
    for (let j = 1; j <= an; ++j) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[bn][an];
}

/**
 * Checks a text string for English spelling errors.
 * Returns null if no errors, or an object with typos and suggestions.
 */
export function checkSpelling(text) {
  if (!text || typeof text !== 'string' || text.trim().length < 3) {
    return null;
  }

  // Extract individual words, ignoring tags (#tag), shortcuts (!high, ~45m), numbers
  const tokens = text.split(/\s+/);
  const typos = [];

  for (let i = 0; i < tokens.length; i++) {
    const rawToken = tokens[i];
    
    // Skip shortcuts, tags, times, numbers
    if (/^[#!~@0-9]/.test(rawToken) || /^\d+(m|min|h|hr|am|pm)?$/i.test(rawToken)) {
      continue;
    }

    // Strip punctuation
    const cleanWord = rawToken.toLowerCase().replace(/[^a-z]/g, '');
    if (cleanWord.length < 3) continue;

    // 1. Direct typo dictionary check
    if (COMMON_TYPO_MAP[cleanWord]) {
      typos.push({
        original: cleanWord,
        rawWord: rawToken,
        suggestion: COMMON_TYPO_MAP[cleanWord]
      });
      continue;
    }

    // 2. Levenshtein match for words >= 4 letters
    if (cleanWord.length >= 4) {
      for (const vocab of TASK_VOCABULARY) {
        if (cleanWord === vocab) break; // correct word

        const dist = levenshtein(cleanWord, vocab);
        // Distance of 1 (e.g. "desing" vs "design", "repot" vs "report")
        if (dist === 1 && Math.abs(cleanWord.length - vocab.length) <= 1) {
          typos.push({
            original: cleanWord,
            rawWord: rawToken,
            suggestion: vocab
          });
          break;
        }
      }
    }
  }

  if (typos.length === 0) return null;

  // Generate complete corrected sentence proposal
  let correctedSentence = text;
  typos.forEach(({ rawWord, suggestion }) => {
    // Preserve case if original was capitalized
    const isCapitalized = /^[A-Z]/.test(rawWord);
    const finalSuggestion = isCapitalized 
      ? suggestion.charAt(0).toUpperCase() + suggestion.slice(1)
      : suggestion;
    
    // Replace word safely
    const regex = new RegExp(`\\b${rawWord.replace(/[^a-zA-Z]/g, '')}\\b`, 'i');
    correctedSentence = correctedSentence.replace(regex, finalSuggestion);
  });

  return {
    typos,
    correctedSentence
  };
}
