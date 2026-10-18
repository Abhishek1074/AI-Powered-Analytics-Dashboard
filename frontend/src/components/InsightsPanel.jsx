import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { fetchInsights, errorMessage } from '../api/client.js';

// Split Claude's reply into headline, bullets and recommendation for nicer rendering.
function parseInsights(text) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const bullets = lines.filter((l) => l.startsWith('- ')).map((l) => l.slice(2));
  const rec = lines.find((l) => l.toLowerCase().startsWith('recommendation:'));
  const headline = lines.find((l) => !l.startsWith('- ') && l !== rec);
  return { headline, bullets, recommendation: rec?.replace(/^recommendation:\s*/i, '') };
}

export default function InsightsPanel({ filters, disabled }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchInsights(filters);
      setInsights(res);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const parsed = insights ? parseInsights(insights.insights) : null;

  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, rgba(79,70,229,0.06), rgba(8,145,178,0.06))',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoAwesomeIcon color="primary" />
            <Typography variant="h6">AI Insights</Typography>
            <Chip size="small" label="Powered by Claude" variant="outlined" />
          </Box>
          <Button
            variant="contained"
            onClick={generate}
            disabled={loading || disabled}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <AutoAwesomeIcon />}
          >
            {loading ? 'Analyzing...' : insights ? 'Regenerate' : 'Generate summary'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {!insights && !error && !loading && (
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Generate a plain-English summary of the data currently shown on the dashboard.
          </Typography>
        )}

        {parsed && (
          <Box sx={{ mt: 2 }}>
            {parsed.headline && (
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                {parsed.headline}
              </Typography>
            )}
            <List dense disablePadding>
              {parsed.bullets.map((b, i) => (
                <ListItem key={i} alignItems="flex-start" disableGutters>
                  <ListItemIcon sx={{ minWidth: 24, mt: 1 }}>
                    <FiberManualRecordIcon sx={{ fontSize: 8 }} color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={b} />
                </ListItem>
              ))}
            </List>
            {parsed.recommendation && (
              <Alert severity="info" sx={{ mt: 1 }}>
                <strong>Recommendation:</strong> {parsed.recommendation}
              </Alert>
            )}
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
              Generated {new Date(insights.generatedAt).toLocaleTimeString()} from the current filters. AI summaries can
              contain mistakes, so check key figures against the charts.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
