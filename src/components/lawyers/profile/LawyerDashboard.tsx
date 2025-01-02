```typescript
import React from 'react';
import { Card } from '../../shared/ui/Card';
import { Button } from '../../shared/ui/Button';
import { Users, Calendar, FileText, MessageSquare, Settings } from 'lucide-react';
import { useLawyer } from '../../../hooks/lawyers/useLawyer';

export function LawyerDashboard() {
  const { lawyer, isLoading } = useLawyer();

  if (isLoading || !lawyer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Profile Overview */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{lawyer.name}</h2>
              <p className="mt-1 text-sm text-gray-500">{lawyer.location}</p>
            </div>
            <Button
              variant="secondary"
              href="/lawyers/profile/edit"
              icon={<Settings className="h-4 w-4" />}
            >
              Edit Profile
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Clients</dt>
                      <dd className="text-lg font-medium text-gray-900">12</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Meetings</dt>
                      <dd className="text-lg font-medium text-gray-900">4</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FileText className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Cases</dt>
                      <dd className="text-lg font-medium text-gray-900">8</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <MessageSquare className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Unread Messages</dt>
                      <dd className="text-lg font-medium text-gray-900">3</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          <div className="mt-4 space-y-4">
            {/* Add activity items here */}
          </div>
        </div>
      </Card>

      {/* Upcoming Tasks */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900">Upcoming Tasks</h3>
          <div className="mt-4 space-y-4">
            {/* Add task items here */}
          </div>
        </div>
      </Card>
    </div>
  );
}
```