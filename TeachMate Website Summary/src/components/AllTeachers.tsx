import React, { useState, useMemo, type FC } from 'react';
import { Teacher } from '../types';
import { translations, Language } from '../translations';
import { Card } from './ui/card';
import { Button as AntButton } from 'antd';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { UserPlus, Search, Filter, X, ChevronRight, ArrowLeft } from 'lucide-react';

interface AllTeachersProps {
  teachers: Teacher[];
  language: Language;
  onSendFriendRequest: (teacher: Teacher) => void;
  onViewTeacherProfile: (teacher: Teacher) => void;
  onBack: () => void;
}

export function AllTeachers({
  teachers,
  language,
  onSendFriendRequest,
  onViewTeacherProfile,
  onBack
}: AllTeachersProps) {
  const t = translations[language];

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedNationality, setSelectedNationality] = useState<string>('all');
  const [experienceRange, setExperienceRange] = useState<[number, number]>([0, 20]);
  const [showFilters, setShowFilters] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Get all unique specialties for filter
  const allSpecialties = useMemo(() => {
    const specialties = new Set<string>();
    teachers.forEach(teacher => {
      teacher.specialties.forEach(specialty => specialties.add(specialty));
    });
    return Array.from(specialties).sort();
  }, [teachers]);

  // Filter teachers based on search and filters
  const filteredTeachers = useMemo(() => {
    return teachers.filter(teacher => {
      // Search query filter
      const matchesSearch = searchQuery === '' ||
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.specialties.some(specialty =>
          specialty.toLowerCase().includes(searchQuery.toLowerCase())
        );

      // Specialty filter
      const matchesSpecialty = selectedSpecialty === 'all' ||
        teacher.specialties.includes(selectedSpecialty);

      // Nationality filter
      const matchesNationality = selectedNationality === 'all' ||
        teacher.nationality === selectedNationality;

      // Experience range filter
      const matchesExperience = teacher.experience >= experienceRange[0] &&
        teacher.experience <= experienceRange[1];

      return matchesSearch && matchesSpecialty && matchesNationality && matchesExperience;
    });
  }, [teachers, searchQuery, selectedSpecialty, selectedNationality, experienceRange]);

  // Paginated teachers
  const paginatedTeachers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTeachers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTeachers, currentPage]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSpecialty('all');
    setSelectedNationality('all');
    setExperienceRange([0, 20]);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <AntButton
            type="default"
            onClick={onBack}
            className="!flex items-center gap-2 !border-blue-200 hover:!border-blue-300"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.back}
          </AntButton>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {language === 'ja' ? 'すべての教師' : 'Tất cả giáo viên'}
          </h1>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-md border-2 border-blue-100 p-6">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Input
              placeholder={language === 'ja' ? '教師名、専門分野で検索...' : 'Tìm kiếm tên giáo viên, chuyên môn...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 pr-12 py-3 text-base border-2 border-gray-200 focus:border-blue-400 rounded-lg"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <AntButton
              type="default"
              onClick={() => setShowFilters(!showFilters)}
              className="!flex items-center gap-2 !border-blue-200 hover:!border-blue-300"
            >
              <Filter className="w-4 h-4" />
              {t.filterBySpecialty}
              {showFilters ? <X className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </AntButton>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {language === 'ja'
                  ? `${filteredTeachers.length} 件の結果`
                  : `${filteredTeachers.length} kết quả`}
              </span>
              <AntButton
                type="text"
                onClick={clearFilters}
                className="!flex items-center gap-2 !text-gray-500 hover:!text-blue-600"
              >
                {t.clearFilters}
              </AntButton>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border-2 border-blue-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Specialty Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    {t.filterBySpecialty}
                  </label>
                  <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger className="border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.allSpecialties}</SelectItem>
                      {allSpecialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Nationality Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    {t.filterByNationality}
                  </label>
                  <Select value={selectedNationality} onValueChange={setSelectedNationality}>
                    <SelectTrigger className="border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.allNationalities}</SelectItem>
                      <SelectItem value="Japanese">{t.japanese}</SelectItem>
                      <SelectItem value="Vietnamese">{t.vietnamese}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Experience Range Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    {t.filterByExperience}
                  </label>
                  <div className="space-y-2">
                    <Slider
                      value={experienceRange}
                      onValueChange={setExperienceRange}
                      max={20}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{experienceRange[0]} {t.yearsExperience}</span>
                      <span>{experienceRange[1]} {t.yearsExperience}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Teachers Grid */}
        {filteredTeachers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t.noTeachersFound}
            </h3>
            <p className="text-gray-500 mb-4">
              {language === 'ja'
                ? '検索条件を変更して再試行してください'
                : 'Hãy thử thay đổi bộ lọc tìm kiếm'}
            </p>
            <Button variant="outline" onClick={clearFilters}>
              {t.clearFilters}
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedTeachers.map((teacher) => (
                <Card
                  key={teacher.id}
                  className="p-6 border-2 hover:shadow-lg transition-shadow bg-white"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="w-16 h-16 border-2">
                      <AvatarImage src={teacher.avatar} alt={teacher.name} />
                      <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="truncate mb-1 font-semibold">{teacher.name}</h3>
                      <Badge variant="secondary" className="mb-2">
                        {teacher.nationality}
                      </Badge>
                      <p className="text-sm text-gray-600">
                        {teacher.experience} {t.yearsExperience}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">{t.specialties}:</p>
                    <div className="flex flex-wrap gap-2">
                      {teacher.specialties.slice(0, 3).map((specialty, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                    {teacher.bio}
                  </p>

                  <div className="flex gap-2">
                    <AntButton
                      type="default"
                      onClick={() => onViewTeacherProfile(teacher)}
                      className="flex-1 !border-blue-200 hover:!border-blue-300"
                    >
                      {t.viewProfile}
                    </AntButton>
                    <AntButton
                      type="primary"
                      onClick={() => onSendFriendRequest(teacher)}
                      className="flex-1 !flex items-center justify-center gap-2 !bg-blue-600 hover:!bg-blue-700"
                    >
                      <UserPlus className="w-4 h-4" />
                      {language === 'ja' ? '追加' : 'Thêm'}
                    </AntButton>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex gap-2 items-center">
                  <AntButton
                    type="default"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="!border-blue-200 hover:!border-blue-300"
                  >
                    {language === 'ja' ? '前へ' : 'Trước'}
                  </AntButton>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <AntButton
                          key={i}
                          type={currentPage === pageNum ? 'primary' : 'default'}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 ${currentPage === pageNum ? '!bg-blue-600 hover:!bg-blue-700' : '!border-blue-200 hover:!border-blue-300'}`}
                        >
                          {pageNum}
                        </AntButton>
                      );
                    })}
                  </div>
                  <AntButton
                    type="default"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="!border-blue-200 hover:!border-blue-300"
                  >
                    {language === 'ja' ? '次へ' : 'Sau'}
                  </AntButton>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

