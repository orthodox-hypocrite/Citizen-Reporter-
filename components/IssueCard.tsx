
import React from 'react';
import { CivicIssue, IssueStatus } from '../types';
import { CATEGORY_COLORS, STATUS_COLORS, CATEGORY_ICONS } from '../constants';

interface IssueCardProps {
  issue: CivicIssue;
  onViewDetails?: (issue: CivicIssue) => void;
  isAdmin?: boolean;
  onUpdateStatus?: (id: string, status: IssueStatus) => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onViewDetails, isAdmin, onUpdateStatus }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-slate-100">
        <img 
          src={issue.imageUrl || `https://picsum.photos/seed/${issue.id}/400/300`} 
          alt={issue.category} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${CATEGORY_COLORS[issue.category]}`}>
            {CATEGORY_ICONS[issue.category]} {issue.category.replace('_', ' ')}
          </span>
        </div>
        <div className="absolute bottom-3 right-3">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm ${STATUS_COLORS[issue.status]}`}>
            {issue.status.replace('_', ' ')}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-slate-800 line-clamp-1">{issue.description}</h3>
          <div className="flex flex-col items-end">
             <span className="text-xs text-slate-400">Priority Score</span>
             <span className={`text-lg font-black ${issue.priorityScore > 75 ? 'text-red-500' : 'text-blue-500'}`}>
               {issue.priorityScore}
             </span>
          </div>
        </div>
        
        <p className="text-sm text-slate-500 mb-4 flex items-center gap-1">
          <i className="fas fa-map-marker-alt text-slate-400"></i>
          {issue.location.address || 'Location Tagged'}
        </p>

        {isAdmin ? (
          <div className="flex gap-2">
            <select 
              className="flex-1 bg-slate-50 border border-slate-200 text-sm rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
              value={issue.status}
              onChange={(e) => onUpdateStatus?.(issue.id, e.target.value as IssueStatus)}
            >
              {Object.values(IssueStatus).map(status => (
                <option key={status} value={status}>{status.replace('_', ' ')}</option>
              ))}
            </select>
            <button 
              onClick={() => onViewDetails?.(issue)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600"
            >
              <i className="fas fa-external-link-alt"></i>
            </button>
          </div>
        ) : (
          <button 
            onClick={() => onViewDetails?.(issue)}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm"
          >
            Track Status
          </button>
        )}
      </div>
    </div>
  );
};
