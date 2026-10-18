import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';

export default function KpiCard({ title, value, icon, color = 'primary.main', loading }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
            bgcolor: color,
            color: '#fff',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          {loading ? (
            <Skeleton width={100} height={36} />
          ) : (
            <Typography variant="h5" fontWeight={700}>
              {value}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
