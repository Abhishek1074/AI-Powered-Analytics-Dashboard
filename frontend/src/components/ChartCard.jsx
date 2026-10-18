import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';

export default function ChartCard({ title, loading, empty, height = 300, children }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ height, position: 'relative' }}>
          {loading ? (
            <Skeleton variant="rounded" width="100%" height="100%" />
          ) : empty ? (
            <Box sx={{ height: '100%', display: 'grid', placeItems: 'center' }}>
              <Typography color="text.secondary">No data for these filters</Typography>
            </Box>
          ) : (
            children
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
