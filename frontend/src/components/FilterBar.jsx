import { Card, CardContent, Grid, TextField, MenuItem, Button } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

export const EMPTY_FILTERS = { from: '', to: '', region: 'All', category: 'All' };

export default function FilterBar({ filters, options, onChange }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="From"
              value={filters.from}
              onChange={set('from')}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="To"
              value={filters.to}
              onChange={set('to')}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
            <TextField select fullWidth size="small" label="Region" value={filters.region} onChange={set('region')}>
              <MenuItem value="All">All regions</MenuItem>
              {options.regions.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Category"
              value={filters.category}
              onChange={set('category')}
            >
              <MenuItem value="All">All categories</MenuItem>
              {options.categories.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 1 }}>
            <Button fullWidth startIcon={<RestartAltIcon />} onClick={() => onChange(EMPTY_FILTERS)}>
              Reset
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
