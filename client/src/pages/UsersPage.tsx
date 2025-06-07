import React, { useState } from 'react';
import { DynamicForm } from '../components/DynamicForm';
import { userFormSchema } from '../schemas/userFormSchema';
import { DynamicTable } from '../components/DynamicTable';
import { userTableColumns, UserRow } from '../schemas/userTableSchema';
import { DynamicLayout } from '../components/DynamicLayout';

export function UsersPage() {
  const [rows, setRows] = useState<UserRow[]>([]);
  return (
    <DynamicLayout title="Users">
      <DynamicForm
        schema={userFormSchema}
        onSubmit={(values) =>
          setRows((r) => [...r, { id: (r.length + 1).toString(), ...values }])
        }
      />
      <div className="mt-4">
        <DynamicTable columns={userTableColumns} data={rows} />
      </div>
    </DynamicLayout>
  );
}
