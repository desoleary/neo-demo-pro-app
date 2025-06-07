import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import Modal from '../components/modal';
import ConfirmDialog from '../components/confirm-dialog';
import { GET_ACCOUNTS, CREATE_ACCOUNT, UPDATE_ACCOUNT, DELETE_ACCOUNT } from '../lib/graphql/operations';
import { accountSchema } from '../lib/schemas';

export function AccountsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, loading, refetch } = useQuery(GET_ACCOUNTS, {
    variables: {
      first: 10,
      after: cursor,
      orderBy: { field: '_id', direction: 'ASC' },
    },
  });

  const [createAccount, { loading: createLoading }] = useMutation(CREATE_ACCOUNT, {
    onCompleted: () => {
      setIsCreateModalOpen(false);
      refetch();
    },
  });

  const [updateAccount, { loading: updateLoading }] = useMutation(UPDATE_ACCOUNT, {
    onCompleted: () => {
      setIsEditModalOpen(false);
      setSelectedAccount(null);
      refetch();
    },
  });

  const [deleteAccount, { loading: deleteLoading }] = useMutation(DELETE_ACCOUNT, {
    onCompleted: () => {
      setIsDeleteDialogOpen(false);
      setSelectedAccount(null);
      refetch();
    },
  });

  const handleCreate = ({ formData }: any) => {
    createAccount({
      variables: {
        userId: formData.userId,
        type: formData.type,
        balance: Number.parseFloat(formData.balance),
      },
    });
  };

  const handleEdit = (account: any) => {
    setSelectedAccount(account);
    setIsEditModalOpen(true);
  };

  const handleUpdate = ({ formData }: any) => {
    updateAccount({
      variables: {
        id: selectedAccount._id,
        userId: formData.userId,
        type: formData.type,
        balance: Number.parseFloat(formData.balance),
      },
    });
  };

  const handleDelete = (account: any) => {
    setSelectedAccount(account);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedAccount) {
      deleteAccount({
        variables: { id: selectedAccount._id },
      });
    }
  };

  const handleNextPage = () => {
    if (data?.accounts?.pageInfo?.hasNextPage) {
      setCursor(data.accounts.pageInfo.endCursor);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCursor(null);
      setCurrentPage((prev) => prev - 1);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Accounts
          </CardTitle>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Account
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.accounts?.edges?.map(({ node: account }: any) => (
                <TableRow key={account._id}>
                  <TableCell className="font-mono text-sm">{account.userId}</TableCell>
                  <TableCell className="capitalize">{account.type}</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(account.balance)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(account)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(account)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">Total: {data?.accounts?.totalCount || 0} accounts</div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handlePrevPage} disabled={currentPage === 1}>
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={!data?.accounts?.pageInfo?.hasNextPage}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Account">
        <Form schema={accountSchema} validator={validator} onSubmit={handleCreate} disabled={createLoading}>
          <div className="flex justify-end space-x-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createLoading}>
              {createLoading ? 'Creating...' : 'Create Account'}
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAccount(null);
        }}
        title="Edit Account"
      >
        {selectedAccount && (
          <Form
            schema={accountSchema}
            validator={validator}
            formData={{
              userId: selectedAccount.userId,
              type: selectedAccount.type,
              balance: selectedAccount.balance,
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
                  setSelectedAccount(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateLoading}>
                {updateLoading ? 'Updating...' : 'Update Account'}
              </Button>
            </div>
          </Form>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedAccount(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Account"
        message={`Are you sure you want to delete this account? This action cannot be undone.`}
        isLoading={deleteLoading}
      />
    </div>
  );
}
