import { useState } from 'react';
import { Box, Container, TextField, Typography, Button, MenuItem, CircularProgress, Paper } from '@mui/material';
import axios from 'axios';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedReply, setGeneratedReply] = useState('');

  const handleGenerateReply = async () => {
    if (!emailContent.trim()) return;
    setLoading(true);
    try { 
      const response = await axios.post('http://localhost:8080/api/email/generate', {
        emailContent,
        tone,
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data)
      );

    } catch (error) {
      console.error('Error generating reply:', error);
      setGeneratedReply('Failed to generate reply. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply);
    alert('Reply copied to clipboard ');
  };

  return (
  <Container maxWidth="md" sx={{ py: 4 }} className="app-container">
      <Typography variant="h3" component="h1" gutterBottom>
        Email Assistant App
      </Typography>

    
      <Box sx={{ mx: 3, mb: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Original Email Content"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
        />
      </Box>

      <Box sx={{ mx: 3, mb: 3 }}>
        <TextField
          select
          fullWidth
          label="Tone (Optional)"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="professional">Professional</MenuItem>
          <MenuItem value="friendly">Friendly</MenuItem>
          <MenuItem value="casual">Casual</MenuItem>
        </TextField>
      </Box>

      <Box sx={{ mx: 3, mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleGenerateReply}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Reply'}
        </Button>
      </Box>

      {generatedReply && (
        <Box sx={{ mx: 3, mt: 3 }}>
          <Paper elevation={3} sx={{ p: 2, position: 'relative' }} className="generated-reply">
            <Typography variant="h6">Generated Reply:</Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mt: 1 }}>
              {generatedReply}
            </Typography>

            <Button
              variant="outlined"
              size="small"
              sx={{ mt: 2 }}
              onClick={handleCopy}
            >
              Copy Mail
            </Button>
          </Paper>
        </Box>
      )}
    </Container>
  );
}


export default App;
