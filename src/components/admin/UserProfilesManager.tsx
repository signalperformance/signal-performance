import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Plus, Search, Edit, Trash2, Download } from 'lucide-react';
import { addMonths, isAfter, format, parseISO } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AddUserModal } from './AddUserModal';
import { EditUserModal } from './EditUserModal';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  membership_plan: 'basic' | 'pro';
  monthly_renewal_date?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function UserProfilesManager() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeUsers = users.filter(user => user.is_active).length;
  const proMembers = users.filter(user => user.membership_plan === 'pro').length;

  const handleAddUser = (userData: any) => {
    loadUsers(); // Reload users after adding
  };

  const handleUpdateUser = () => {
    loadUsers(); // Reload users after updating
    setEditingUser(null);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.functions.invoke('admin-delete-client', {
        body: { userId }
      });

      if (error) {
        console.error('Error deleting user:', error);
        toast({
          title: "Error",
          description: "Failed to delete user. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "User deleted successfully.",
      });

      await loadUsers();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getNextPaymentDue = (monthlyRenewalDate?: string): Date => {
    if (!monthlyRenewalDate) return new Date();
    
    const today = new Date();
    const renewalDate = parseISO(monthlyRenewalDate);
    
    // Create a date for this month with the renewal day
    const thisMonthRenewal = new Date(today.getFullYear(), today.getMonth(), renewalDate.getDate());
    
    // If this month's renewal date has already passed, get next month's date
    if (isAfter(today, thisMonthRenewal)) {
      return addMonths(thisMonthRenewal, 1);
    }
    
    return thisMonthRenewal;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Profiles Manager</h2>
          <p className="text-muted-foreground">Manage user accounts and memberships</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pro Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proMembers}</div>
            <p className="text-xs text-muted-foreground">Premium membership</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find users by name or email</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>
            Showing {filteredUsers.length} of {users.length} users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Membership</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Payment Due</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <Badge variant={user.membership_plan === 'pro' ? 'default' : 'secondary'}>
                      {user.membership_plan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.is_active ? 'default' : 'destructive'}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.monthly_renewal_date ? 
                      format(getNextPaymentDue(user.monthly_renewal_date), 'MMM dd, yyyy') :
                      'Not set'
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setEditingUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddUser={handleAddUser}
      />

      {editingUser && (
        <EditUserModal
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          onUpdateUser={() => {
            setEditingUser(null);
            loadUsers();
          }}
          user={editingUser}
        />
      )}
    </div>
  );
}