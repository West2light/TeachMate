import { useState } from 'react';
import { Teacher, Report } from '../types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { AlertCircle, Users, Shield, CheckCircle, XCircle } from 'lucide-react';
import { translations, Language } from '../translations';

interface AdminPanelProps {
  teachers: Teacher[];
  reports: Report[];
  onResolveReport: (reportId: string) => void;
  language: Language;
}

export function AdminPanel({ teachers, reports, onResolveReport, language }: AdminPanelProps) {
  const t = translations[language];
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  
  const filteredReports = reports.filter(report => 
    filter === 'all' || report.status === filter
  );
  
  const getTeacher = (id: string) => teachers.find(t => t.id === id);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-7 h-7" />
        <h2>{t.adminPanel}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-2">
          <div className="flex items-center gap-4">
            <Users className="w-12 h-12 text-blue-500" />
            <div>
              <p className="text-gray-600">{t.totalTeachers}</p>
              <p className="text-3xl">{teachers.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border-2">
          <div className="flex items-center gap-4">
            <AlertCircle className="w-12 h-12 text-orange-500" />
            <div>
              <p className="text-gray-600">{t.pendingReports}</p>
              <p className="text-3xl">
                {reports.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border-2">
          <div className="flex items-center gap-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
            <div>
              <p className="text-gray-600">{t.resolvedReports}</p>
              <p className="text-3xl">
                {reports.filter(r => r.status === 'resolved').length}
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      <Tabs defaultValue="teachers" className="w-full">
        <TabsList>
          <TabsTrigger value="teachers">{t.teachers}</TabsTrigger>
          <TabsTrigger value="reports">{t.reports}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="teachers">
          <Card className="border-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.teacher}</TableHead>
                  <TableHead>{t.nationality}</TableHead>
                  <TableHead>{t.experience}</TableHead>
                  <TableHead>{t.specialties}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border-2">
                          <AvatarImage src={teacher.avatar} alt={teacher.name} />
                          <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{teacher.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={teacher.nationality === 'Japanese' ? 'default' : 'secondary'}>
                        {teacher.nationality === 'Japanese' ? t.japanese : t.vietnamese}
                      </Badge>
                    </TableCell>
                    <TableCell>{teacher.experience} {t.yearsExperience}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {teacher.specialties.slice(0, 2).map((specialty) => (
                          <Badge key={specialty} variant="outline">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card className="p-4 border-2">
            <div className="flex gap-2 mb-4">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
              >
                {t.all}
              </Button>
              <Button
                variant={filter === 'pending' ? 'default' : 'outline'}
                onClick={() => setFilter('pending')}
              >
                {t.pending}
              </Button>
              <Button
                variant={filter === 'resolved' ? 'default' : 'outline'}
                onClick={() => setFilter('resolved')}
              >
                {t.resolved}
              </Button>
            </div>
            
            <div className="space-y-4">
              {filteredReports.map((report) => {
                const reporter = getTeacher(report.reporterId);
                const reportedUser = getTeacher(report.reportedUserId);
                
                return (
                  <Card key={report.id} className="p-4 border-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={report.status === 'pending' ? 'destructive' : 'default'}>
                            {report.status === 'pending' ? t.pending : t.resolved}
                          </Badge>
                          <span className="text-gray-500">
                            {report.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                        
                        <p className="mb-2">
                          <span className="text-gray-600">{t.reporter}: </span>
                          {reporter?.name || 'Unknown'}
                        </p>
                        
                        <p className="mb-2">
                          <span className="text-gray-600">{t.reportedUser}: </span>
                          {reportedUser?.name || 'Unknown'}
                        </p>
                        
                        <p className="text-gray-700">
                          <span className="text-gray-600">{t.reason}: </span>
                          {report.reason}
                        </p>
                      </div>
                      
                      {report.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onResolveReport(report.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            {t.resolve}
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
              
              {filteredReports.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {t.noReports}
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
