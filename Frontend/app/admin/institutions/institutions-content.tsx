"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Building2, Edit, Trash2, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

// Inner component that uses useSearchParams
function InstitutionsContentInner({ institutions, loading }: { institutions: any[], loading: boolean }) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Get initial search from URL params if available
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearch(urlSearch);
    }
  }, [searchParams]);

  // Filter institutions based on search
  const filteredInstitutions = institutions.filter(inst =>
    inst.name?.toLowerCase().includes(search.toLowerCase()) ||
    inst.email?.toLowerCase().includes(search.toLowerCase()) ||
    inst.status?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg">Loading institutions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search institutions by name, email, or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Institutions</p>
                <p className="text-2xl font-bold">{institutions.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold">
                  {institutions.filter(i => i.status?.toLowerCase() === 'active').length}
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">
                  {institutions.filter(i => i.status?.toLowerCase() === 'pending').length}
                </p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Suspended</p>
                <p className="text-2xl font-bold">
                  {institutions.filter(i => i.status?.toLowerCase() === 'suspended').length}
                </p>
              </div>
              <Badge className="bg-red-100 text-red-800">Suspended</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Institutions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Institutions</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredInstitutions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {institutions.length === 0 ? 'No institutions found.' : 'No institutions match your search.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Registered Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInstitutions.map((institution) => (
                    <TableRow key={institution.id}>
                      <TableCell className="font-medium">{institution.name}</TableCell>
                      <TableCell>{institution.email}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(institution.status)}>
                          {institution.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{institution.type}</TableCell>
                      <TableCell>
                        {institution.createdAt ? new Date(institution.createdAt).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedInstitution(institution);
                              setViewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedInstitution(institution);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Institution Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Institution Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedInstitution?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedInstitution && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Basic Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Name:</span> {selectedInstitution.name}</div>
                  <div><span className="font-medium">Email:</span> {selectedInstitution.email}</div>
                  <div><span className="font-medium">Phone:</span> {selectedInstitution.phone || 'N/A'}</div>
                  <div><span className="font-medium">Type:</span> {selectedInstitution.type}</div>
                  <div>
                    <span className="font-medium">Status:</span>{' '}
                    <Badge className={getStatusColor(selectedInstitution.status)}>
                      {selectedInstitution.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Additional Details</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Address:</span> {selectedInstitution.address || 'N/A'}</div>
                  <div><span className="font-medium">Website:</span> {selectedInstitution.website || 'N/A'}</div>
                  <div><span className="font-medium">Contact Person:</span> {selectedInstitution.contactPerson || 'N/A'}</div>
                  <div><span className="font-medium">Registered:</span> {selectedInstitution.createdAt ? new Date(selectedInstitution.createdAt).toLocaleDateString() : 'N/A'}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedInstitution?.name} and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                // Handle delete logic here
                console.log('Deleting institution:', selectedInstitution?.id);
                setDeleteDialogOpen(false);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Main component wrapped in Suspense
export default function InstitutionsContent({ institutions, loading }: { institutions: any[], loading: boolean }) {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Loading institutions content...</div>
      </div>
    }>
      <InstitutionsContentInner institutions={institutions} loading={loading} />
    </Suspense>
  );
}
