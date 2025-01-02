import { createBrowserRouter } from 'react-router-dom';
import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { AuthPage } from '../components/auth/AuthPage';
import { ErrorBoundary } from '../components/shared/ErrorBoundary';
import { DashboardContent } from '../components/dashboard/DashboardContent';
import { CaseList } from '../components/cases/list/CaseList';
import { CaseDetailsPage } from '../pages/CaseDetailsPage';
import { PrivateRoute } from './PrivateRoute';

// Import pages directly
import MessagesPage from '../pages/MessagesPage';
import LawyerDirectoryPage from '../pages/lawyers/LawyerDirectoryPage';
import LawyerSignupPage from '../pages/lawyers/LawyerSignupPage';
import LawyerDashboardPage from '../pages/lawyers/LawyerDashboardPage';
import LawyerMessagesPage from '../pages/lawyers/LawyerMessagesPage';
import LawyerProfilePage from '../pages/lawyers/LawyerProfilePage';
import { ContractAuditPage } from '../pages/cases/ContractAuditPage';
import { NewCasePage } from '../pages/NewCasePage';
import { DraftLawsuitPage } from '../pages/DraftLawsuitPage';
import { DraftContractPage } from '../pages/cases/DraftContractPage';
import { DraftLetterPage } from '../pages/cases/DraftLetterPage';
import { AnswerLawsuitPage } from '../pages/cases/AnswerLawsuitPage';
import { DepositionPrepPage } from '../pages/cases/DepositionPrepPage';
import { DiscoveryHubPage } from '../pages/cases/DiscoveryHubPage';
import { CaseAnalysisPage } from '../pages/cases/CaseAnalysisPage';
import { MedicalSummaryPage } from '../pages/cases/MedicalSummaryPage';
import { CommunityPage } from '../pages/CommunityPage';
import { CreatePostPage } from '../pages/CreatePostPage';
import { PostDetailsPage } from '../pages/PostDetailsPage';
import { LegalQuestionPage } from '../pages/LegalQuestionPage';
import { UserProfilePage } from '../pages/UserProfilePage';
import { NewDiscoveryPage } from '../pages/discovery/NewDiscoveryPage';
import { DiscoveryDetailsPage } from '../pages/discovery/DiscoveryDetailsPage';
import { DiscoveryResponsePage } from '../pages/discovery/DiscoveryResponsePage';
import { TemplatesPage } from '../pages/templates/TemplatesPage';
import { NewTemplatePage } from '../pages/templates/NewTemplatePage';
import { TemplateDetailsPage } from '../pages/templates/TemplateDetailsPage';
import { NewDocumentPage } from '../pages/documents/NewDocumentPage';
import { CalendarPage } from '../pages/CalendarPage';
import { DocumentsPage } from '../pages/DocumentsPage';
import { ESignPage } from '../pages/documents/ESignPage';
import { EditDocumentPage } from '../pages/documents/EditDocumentPage';

// Import pages directly to avoid lazy loading issues
import MessagesPage from '../pages/MessagesPage';
import LawyerDirectoryPage from '../pages/lawyers/LawyerDirectoryPage';
import LawyerSignupPage from '../pages/lawyers/LawyerSignupPage';
import LawyerDashboardPage from '../pages/lawyers/LawyerDashboardPage';
import LawyerMessagesPage from '../pages/lawyers/LawyerMessagesPage';
import LawyerProfilePage from '../pages/lawyers/LawyerProfilePage';

export const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthPage />
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <DashboardContent />
      },
      // ... other routes remain unchanged ...
      {
        path: 'messages',
        children: [
          { index: true, element: <MessagesPage /> },
          { path: ':id', element: <MessagesPage /> }
        ]
      },
      {
        path: 'lawyers',
        children: [
          { index: true, element: <LawyerDirectoryPage /> },
          { path: 'signup', element: <LawyerSignupPage /> },
          { path: 'dashboard', element: <LawyerDashboardPage /> },
          { path: ':id/messages', element: <LawyerMessagesPage /> },
          { path: ':id', element: <LawyerProfilePage /> }
        ]
      }
    ]
  }
]);