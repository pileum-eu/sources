import diacritics from 'diacritics';

import { Ministry, MinistryWithSlug } from '../../../types';

export const addMinistrySlug = (ministries: Ministry[]): MinistryWithSlug[] => {
  if (!ministries) {
    return ministries;
  }
  const slugified = ministries.map((ministry) => {
    const slug = diacritics.remove(ministry.name).toLowerCase();
    return { ...ministry, slug };
  });
  return slugified;
};