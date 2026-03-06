'use client';

import { useState } from 'react';
import { Switch, Typography, Stack, Button, Box } from '@mui/material';
import Link from 'next/link';

export default function HomeForm({ trans }: { trans: Record<string, string> }) {
  const [userType, setUserType] = useState<'company' | 'person'>('company');

  const handleUserTypeChange = (value: boolean) => {
    setUserType(value ? 'company' : 'person');
  }

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={4} sx={{ mt: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
        <Typography variant="body1">{trans.personal_user}</Typography>
        <Switch
          checked={userType === 'company'}
          onChange={(e) => handleUserTypeChange(e.target.checked)}
          color="primary"
        />
        <Typography variant="body1">{trans.company_user}</Typography>
      </Stack>
      <Box sx={{ width: { xs: 0, md: 100 } }} />
      <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
        <Button
          component={Link}
          href={`/login?userType=${userType}`}
          variant="contained"
          color="primary"
          sx={{ minWidth: 100 }}
        >
          {trans.login}
        </Button>
        <Button
          component={Link}
          href={`/register?userType=${userType}`}
          variant="contained"
          color="warning" // or suitable color for orange
          sx={{ minWidth: 100, backgroundColor: '#fb923c', '&:hover': { backgroundColor: '#fdba74', color: '#0f172a' } }}
        >
          {trans.register}
        </Button>
      </Stack>
    </Stack>
  )
}
