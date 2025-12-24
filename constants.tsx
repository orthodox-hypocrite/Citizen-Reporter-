
import React from 'react';
import { IssueCategory, IssueStatus } from './types';

export const CATEGORY_COLORS: Record<IssueCategory, string> = {
  [IssueCategory.POTHOLE]: 'bg-orange-100 text-orange-700 border-orange-200',
  [IssueCategory.WATER_LEAK]: 'bg-blue-100 text-blue-700 border-blue-200',
  [IssueCategory.WASTE_MGMT]: 'bg-green-100 text-green-700 border-green-200',
  [IssueCategory.STREET_LIGHT]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  [IssueCategory.OTHER]: 'bg-gray-100 text-gray-700 border-gray-200',
};

export const STATUS_COLORS: Record<IssueStatus, string> = {
  [IssueStatus.REPORTED]: 'bg-purple-100 text-purple-700',
  [IssueStatus.VERIFYING]: 'bg-indigo-100 text-indigo-700',
  [IssueStatus.ASSIGNED]: 'bg-blue-100 text-blue-700',
  [IssueStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-700',
  [IssueStatus.RESOLVED]: 'bg-emerald-100 text-emerald-700',
};

export const CATEGORY_ICONS: Record<IssueCategory, React.ReactNode> = {
  [IssueCategory.POTHOLE]: <i className="fas fa-road"></i>,
  [IssueCategory.WATER_LEAK]: <i className="fas fa-tint"></i>,
  [IssueCategory.WASTE_MGMT]: <i className="fas fa-trash-alt"></i>,
  [IssueCategory.STREET_LIGHT]: <i className="fas fa-lightbulb"></i>,
  [IssueCategory.OTHER]: <i className="fas fa-info-circle"></i>,
};
