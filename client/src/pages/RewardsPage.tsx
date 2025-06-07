import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Plus, Edit, Trash2, Gift } from 'lucide-react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import Modal from '../components/modal';
import ConfirmDialog from '../components/confirm-dialog';
import { GET_REWARDS, CREATE_REWARD, UPDATE_REWARD, DELETE_REWARD } from '../lib/graphql/operations';
import { rewardSchema } from '../lib/schemas';

export function RewardsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, loading, refetch } = useQuery(GET_REWARDS, {
    variables: {
      first: 10,
      after: cursor,
      orderBy: { field: '_id', direction: 'ASC' },
    },
  });

  const [createReward, { loading: createLoading }] = useMutation(CREATE_REWARD, {
    onCompleted: () => {
      setIsCreateModalOpen(false);
      refetch();
    },
  });

  const [updateReward, { loading: updateLoading }] = useMutation(UPDATE_REWARD, {
    onCompleted: () => {
      setIsEditModalOpen(false);
      setSelectedReward(null);
      refetch();
    },
  });

  const [deleteReward, { loading: deleteLoading }] = useMutation(DELETE_REWARD, {
    onCompleted: () => {
      setIsDeleteDialogOpen(false);
      setSelectedReward(null);
      refetch();
    },
  });

  const handleCreate = ({ formData }: any) => {
    createReward({
      variables: {
        id: formData.id,
        description: formData.description,
        points: Number.parseFloat(formData.points),
      },
    });
  };

  const handleEdit = (reward: any) => {
    setSelectedReward(reward);
    setIsEditModalOpen(true);
  };

  const handleUpdate = ({ formData }: any) => {
    updateReward({
      variables: {
        id: selectedReward._id,
        description: formData.description,
        points: Number.parseFloat(formData.points),
      },
    });
  };

  const handleDelete = (reward: any) => {
    setSelectedReward(reward);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedReward) {
      deleteReward({
        variables: { id: selectedReward._id },
      });
    }
  };

  const handleNextPage = () => {
    if (data?.rewards?.pageInfo?.hasNextPage) {
      setCursor(data.rewards.pageInfo.endCursor);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCursor(null);
      setCurrentPage((prev) => prev - 1);
    }
  };

  const getPointsBadgeColor = (points: number) => {
    if (points >= 1000) return 'bg-purple-100 text-purple-800';
    if (points >= 500) return 'bg-blue-100 text-blue-800';
    if (points >= 100) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Gift className="h-5 w-5 mr-2" />
            Rewards
          </CardTitle>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Reward
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.rewards?.edges?.map(({ node: reward }: any) => (
                <TableRow key={reward._id}>
                  <TableCell className="font-mono text-sm">{reward.id}</TableCell>
                  <TableCell className="max-w-xs truncate">{reward.description}</TableCell>
                  <TableCell>
                    <Badge className={getPointsBadgeColor(reward.points)}>{reward.points} pts</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(reward)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(reward)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">Total: {data?.rewards?.totalCount || 0} rewards</div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handlePrevPage} disabled={currentPage === 1}>
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={!data?.rewards?.pageInfo?.hasNextPage}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Reward">
        <Form schema={rewardSchema} validator={validator} onSubmit={handleCreate} disabled={createLoading}>
          <div className="flex justify-end space-x-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createLoading}>
              {createLoading ? 'Creating...' : 'Create Reward'}
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedReward(null);
        }}
        title="Edit Reward"
      >
        {selectedReward && (
          <Form
            schema={rewardSchema}
            validator={validator}
            formData={{
              id: selectedReward.id,
              description: selectedReward.description,
              points: selectedReward.points,
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
                  setSelectedReward(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateLoading}>
                {updateLoading ? 'Updating...' : 'Update Reward'}
              </Button>
            </div>
          </Form>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedReward(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Reward"
        message={`Are you sure you want to delete reward "${selectedReward?.description}"? This action cannot be undone.`}
        isLoading={deleteLoading}
      />
    </div>
  );
}
