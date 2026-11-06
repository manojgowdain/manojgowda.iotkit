/**
 * Centralized SEO Management System
 * 
 * Provides unified access to keywords, alternative keywords, and descriptions
 * for all pages in the application.
 */

/* Re-export keyword database */
export { keywords, allKeywords, keywordCount, categoryCounts } from './keywords';

/* Re-export alternative keywords database */
export { 
  alternativeKeywords, 
  allAlternativeKeywords, 
  alternativeKeywordCount,
  alternativeCategoryCounts,
  totalAlternativeKeywordCount 
} from './alternativeKeywords';

/* Re-export descriptions database */
export { 
  descriptions, 
  getDescription, 
  allDescriptions, 
  descriptionCount,
  categoryDescriptionCounts,
  MIN_DESCRIPTION_COUNT
} from './descriptions';
