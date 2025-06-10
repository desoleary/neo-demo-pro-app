import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Plus, Edit, Trash2, ArrowRightLeft } from 'lucide-react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import Modal from '../components/modal';
import ConfirmDialog from '../components/confirm-dialog';
import { GET_TRANSFERS, CREATE_TRANSFER, UPDATE_TRANSFER, DELETE_TRANSFER } from '../lib/graphql/operations';
import { transferSchema } from '../lib/schemas';

export function TransfersPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<any>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, loading, refetch } = useQuery(GET_TRANSFERS, {
    variables: {
      first: 10,
      after: cursor,
      orderBy: { field: '_id', direction: 'ASC' },
    },
  });

  const [createTransfer, { loading: createLoading }] = useMutation(CREATE_TRANSFER, {
    onCompleted: () => {
      setIsCreateModalOpen(false);
      refetch();
    },
  });

  const [updateTransfer, { loading: updateLoading }] = useMutation(UPDATE_TRANSFER, {
    onCompleted: () => {
      setIsEditModalOpen(false);
      setSelectedTransfer(null);
      refetch();
    },
  });

  const [deleteTransfer, { loading: deleteLoading }] = useMutation(DELETE_TRANSFER, {
    onCompleted: () => {
      setIsDeleteDialogOpen(false);
      setSelectedTransfer(null);
      refetch();
    },
  });

  const handleCreate = ({ formData }: any) => {
    createTransfer({
      variables: {
        id: formData.id,
        status: formData.status,
      },
    });
  };

  const handleEdit = (transfer: any) => {
    setSelectedTransfer(transfer);
    setIsEditModalOpen(true);
  };

  const handleUpdate = ({ formData }: any) => {
    updateTransfer({
      variables: {
        id: selectedTransfer._id,
        status: formData.status,
      },
    });
  };

  const handleDelete = (transfer: any) => {
    setSelectedTransfer(transfer);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedTransfer) {
      deleteTransfer({
        variables: { id: selectedTransfer._id },
      });
    }
  };

  const handleNextPage = () => {
    if (data?.transfers?.pageInfo?.hasNextPage) {
      setCursor(data.transfers.pageInfo.endCursor);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCursor(null);
      setCurrentPage((prev) => prev - 1);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <ArrowRightLeft className="h-5 w-5 mr-2" />
            Transfers
          </CardTitle>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Transfer
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.transfers?.edges?.map(({ node: transfer }: any) => (
                <TableRow key={transfer._id}>
                  <TableCell className="font-mono text-sm">{transfer.id}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(transfer.status)}>{transfer.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(transfer)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(transfer)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">Total: {data?.transfers?.totalCount || 0} transfers</div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handlePrevPage} disabled={currentPage === 1}>
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={!data?.transfers?.pageInfo?.hasNextPage}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Transfer">
        <Form schema={transferSchema} validator={validator} onSubmit={handleCreate} disabled={createLoading}>
          <div className="flex justify-end space-x-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createLoading}>
              {createLoading ? 'Creating...' : 'Create Transfer'}
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTransfer(null);
        }}
        title="Edit Transfer"
      >
        {selectedTransfer && (
          <Form
            schema={transferSchema}
            validator={validator}
            formData={{
              id: selectedTransfer.id,
              status: selectedTransfer.status,
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
                  setSelectedTransfer(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateLoading}>
                {updateLoading ? 'Updating...' : 'Update Transfer'}
              </Button>
            </div>
          </Form>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedTransfer(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Transfer"
        message={`Are you sure you want to delete transfer "${selectedTransfer?.id}"? This action cannot be undone.`}
        isLoading={deleteLoading}
      />
    </div>
  );
}
