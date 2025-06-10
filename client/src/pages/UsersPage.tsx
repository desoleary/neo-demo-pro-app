import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import Modal from '../components/modal';
import ConfirmDialog from '../components/confirm-dialog';
import { GET_USERS, CREATE_USER, UPDATE_USER, DELETE_USER } from '../lib/graphql/operations';
import { userSchema } from '../lib/schemas';

export function UsersPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [cursor, setCursor] = useState<string | null>(null);

  const { data, loading, refetch } = useQuery(GET_USERS, {
    variables: {
      first: 10,
      after: cursor,
      orderBy: { field: '_id', direction: 'ASC' },
    },
  });

  const [createUser, { loading: createLoading }] = useMutation(CREATE_USER, {
    onCompleted: () => {
      setIsCreateModalOpen(false);
      refetch();
    },
  });

  const [updateUser, { loading: updateLoading }] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      setIsEditModalOpen(false);
      setSelectedUser(null);
      refetch();
    },
  });

  const [deleteUser, { loading: deleteLoading }] = useMutation(DELETE_USER, {
    onCompleted: () => {
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      refetch();
    },
  });

  const handleCreate = ({ formData }: any) => {
    createUser({
      variables: {
        id: formData.id,
        email: formData.email,
        password: formData.password,
        tier: formData.tier,
      },
    });
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdate = ({ formData }: any) => {
    updateUser({
      variables: {
        id: selectedUser._id,
        email: formData.email,
        password: formData.password,
        tier: formData.tier,
      },
    });
  };

  const handleDelete = (user: any) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      deleteUser({ variables: { id: selectedUser._id } });
    }
  };

  const handleNextPage = () => {
    if (data?.users?.pageInfo?.hasNextPage) {
      setCursor(data.users.pageInfo.endCursor);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCursor(null);
      setCurrentPage((prev) => prev - 1);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'basic':
        return 'bg-gray-100 text-gray-800';
      case 'gold':
        return 'bg-yellow-100 text-yellow-800';
      case 'platinum':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Users</CardTitle>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create New User
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.users?.edges?.map(({ node: user }: any) => (
                <TableRow key={user._id}>
                  <TableCell className="font-mono text-sm">{user.id}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getTierColor(user.tier)}>{user.tier}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(user)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">Total: {data?.users?.totalCount || 0} users</div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handlePrevPage} disabled={currentPage === 1}>
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={!data?.users?.pageInfo?.hasNextPage}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New User">
        <Form schema={userSchema} validator={validator} onSubmit={handleCreate} disabled={createLoading}>
          <div className="flex justify-end space-x-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createLoading}>
              {createLoading ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        title="Edit User"
      >
        {selectedUser && (
          <Form
            schema={userSchema}
            validator={validator}
            formData={{
              id: selectedUser.id,
              email: selectedUser.email,
              password: selectedUser.password,
              tier: selectedUser.tier,
            }}
            onSubmit={handleUpdate}
            disabled={updateLoading}
          >
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedUser(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateLoading}>
                {updateLoading ? 'Updating...' : 'Update User'}
              </Button>
            </div>
          </Form>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete user "${selectedUser?.email}"? This action cannot be undone.`}
        isLoading={deleteLoading}
      />
    </div>
  );
}
