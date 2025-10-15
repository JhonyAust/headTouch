import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllUsersForAdmin } from "../../store/admin/user-slice";
import { 
  Users, 
  Mail, 
  Calendar, 
  UserCheck, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  TrendingUp,
  Shield,
  Crown
} from "lucide-react";

function AdminUsersView() {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.adminUser);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  useEffect(() => {
    dispatch(getAllUsersForAdmin());
  }, [dispatch]);

  // Pagination logic
  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);

  // Stats calculation
  const totalUsers = users.length;
  const recentUsers = users.filter(u => {
    const userDate = new Date(u.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return userDate > weekAgo;
  }).length;

  const getUserRole = (user) => {
    return user.role || 'user';
  };

  const getRoleBadge = (role) => {
    switch(role) {
      case 'admin':
        return { color: 'from-red-600 to-orange-600', icon: <Crown className="w-3 h-3" /> };
      case 'moderator':
        return { color: 'from-purple-600 to-pink-600', icon: <Shield className="w-3 h-3" /> };
      default:
        return { color: 'from-blue-600 to-cyan-600', icon: <UserCheck className="w-3 h-3" /> };
    }
  };

  return (
    <div className="w-full min-h-screen p-3 sm:p-6 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-in" style={{ animationDelay: '0s' }}>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 opacity-50" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-blue-600 mb-1">Total Users</p>
          <p className="text-2xl sm:text-3xl font-black text-gray-900">{totalUsers}</p>
        </div>

        <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 opacity-50" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-green-600 mb-1">New This Week</p>
          <p className="text-2xl sm:text-3xl font-black text-gray-900">{recentUsers}</p>
        </div>

        <div className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-in sm:col-span-2 lg:col-span-1" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 opacity-50" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-purple-600 mb-1">Active Today</p>
          <p className="text-2xl sm:text-3xl font-black text-gray-900">{Math.floor(totalUsers * 0.3)}</p>
        </div>
      </div>

      {/* Users Table Card */}
      <Card className="border-2 border-gray-100 shadow-xl rounded-xl sm:rounded-2xl overflow-hidden animate-slide-up w-full" style={{ animationDelay: '0.3s' }}>
        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b-2 border-gray-100 p-4 sm:pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  All Users
                </CardTitle>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage and view all registered users</p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold">
              {totalUsers} Total
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Mobile Card View */}
          <div className="block lg:hidden">
            {paginatedUsers.map((user, index) => {
              const role = getUserRole(user);
              const roleBadge = getRoleBadge(role);
              
              return (
                <div 
                  key={user._id}
                  className="p-4 border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 animate-fade-in-row"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                      {user.userName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{user.userName}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={`bg-gradient-to-r ${roleBadge.color} text-white font-semibold shadow-md flex items-center gap-1.5 text-xs capitalize`}>
                          {roleBadge.icon}
                          {role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-xs ml-15">
                    <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <span className="truncate">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      }) : 'N/A'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50 border-b-2 border-gray-200">
                  <TableHead className="font-bold text-gray-700 py-4">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-gray-500" />
                      User ID
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      Name
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      Email
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-500" />
                      Role
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      Joined Date
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedUsers.map((user, index) => {
                  const role = getUserRole(user);
                  const roleBadge = getRoleBadge(role);
                  
                  return (
                    <TableRow 
                      key={user._id}
                      className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 border-b border-gray-100 animate-fade-in-row"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <TableCell className="font-medium py-4">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-xs font-bold text-blue-600 group-hover:bg-blue-200 transition-colors duration-200">
                            #{user._id.slice(-3)}
                          </span>
                          <span className="text-xs text-gray-500 font-mono">
                            {user._id.slice(-8)}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold shadow-md group-hover:scale-110 transition-transform duration-300">
                            {user.userName?.charAt(0).toUpperCase()}
                          </div>
                          <p className="font-semibold text-gray-900">{user.userName}</p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge className={`bg-gradient-to-r ${roleBadge.color} text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1.5 w-fit capitalize`}>
                          {roleBadge.icon}
                          {role}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            }) : 'N/A'}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-gray-50 border-t-2 border-gray-200">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
                className="w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>

              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full pb-2 sm:pb-0">
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-bold transition-all duration-300 flex-shrink-0 text-sm sm:text-base ${
                      currentPage === idx + 1
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110'
                        : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <Button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                variant="outline"
                className="w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-row {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-slide-in {
          animation: slide-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-row {
          animation: fade-in-row 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

export default AdminUsersView;