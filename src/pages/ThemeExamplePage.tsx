import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  TextField,
  Paper,
  Stack,
  Chip,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Favorite,
  Share,
  Star,
  Info,
  Warning,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';

export const ThemeExamplePage = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h3" component="h1" gutterBottom>
        MUI Theme Examples
      </Typography>

      <Stack spacing={4} sx={{ mt: 3 }}>
        {/* Color Palette */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Color Palette
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 2, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 2, borderRadius: 1, minWidth: 100 }}>
              Primary
            </Box>
            <Box sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText', p: 2, borderRadius: 1, minWidth: 100 }}>
              Secondary
            </Box>
            <Box sx={{ bgcolor: 'error.main', color: 'error.contrastText', p: 2, borderRadius: 1, minWidth: 100 }}>
              Error
            </Box>
            <Box sx={{ bgcolor: 'warning.main', color: 'warning.contrastText', p: 2, borderRadius: 1, minWidth: 100 }}>
              Warning
            </Box>
            <Box sx={{ bgcolor: 'info.main', color: 'info.contrastText', p: 2, borderRadius: 1, minWidth: 100 }}>
              Info
            </Box>
            <Box sx={{ bgcolor: 'success.main', color: 'success.contrastText', p: 2, borderRadius: 1, minWidth: 100 }}>
              Success
            </Box>
          </Stack>
        </Paper>

        {/* Buttons */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Buttons
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 2, flexWrap: 'wrap', gap: 2 }}>
            <Button variant="contained" color="primary">
              Contained
            </Button>
            <Button variant="outlined" color="primary">
              Outlined
            </Button>
            <Button variant="text" color="primary">
              Text
            </Button>
            <Button variant="contained" color="secondary" startIcon={<Favorite />}>
              With Icon
            </Button>
            <Button variant="contained" color="success">
              Success
            </Button>
            <Button variant="contained" color="error">
              Error
            </Button>
            <Button variant="contained" disabled>
              Disabled
            </Button>
          </Stack>
        </Paper>

        {/* Typography */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Typography
          </Typography>
          <Stack spacing={1} sx={{ mt: 2 }}>
            <Typography variant="h1">Heading 1</Typography>
            <Typography variant="h2">Heading 2</Typography>
            <Typography variant="h3">Heading 3</Typography>
            <Typography variant="h4">Heading 4</Typography>
            <Typography variant="h5">Heading 5</Typography>
            <Typography variant="h6">Heading 6</Typography>
            <Typography variant="body1">Body 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Typography>
            <Typography variant="body2">Body 2: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Typography>
            <Typography variant="caption">Caption text</Typography>
          </Stack>
        </Paper>

        {/* Cards */}
        <Box>
          <Typography variant="h5" gutterBottom>
            Cards
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mt: 2 }}>
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Card Title
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This is a sample card component with MUI styling.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<Share />}>Share</Button>
                <Button size="small" startIcon={<Star />}>Star</Button>
              </CardActions>
            </Card>
            <Card elevation={3} sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Elevated Card
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This card has a higher elevation value.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">Learn More</Button>
              </CardActions>
            </Card>
            <Card variant="outlined" sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Outlined Card
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This card uses the outlined variant.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="secondary">Action</Button>
              </CardActions>
            </Card>
          </Stack>
        </Box>

        {/* Form Elements */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Form Elements
          </Typography>
          <Stack spacing={2} sx={{ mt: 2, maxWidth: 500 }}>
            <TextField label="Standard Input" variant="outlined" />
            <TextField label="Filled Input" variant="filled" />
            <TextField label="Required Field" variant="outlined" required />
            <TextField label="Error State" variant="outlined" error helperText="This field has an error" />
            <TextField label="With Helper Text" variant="outlined" helperText="Some helpful information" />
            <TextField label="Disabled" variant="outlined" disabled />
          </Stack>
        </Paper>

        {/* Alerts */}
        <Box>
          <Typography variant="h5" gutterBottom>
            Alerts
          </Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Alert icon={<CheckCircle />} severity="success">
              This is a success alert
            </Alert>
            <Alert icon={<Info />} severity="info">
              This is an info alert
            </Alert>
            <Alert icon={<Warning />} severity="warning">
              This is a warning alert
            </Alert>
            <Alert icon={<ErrorIcon />} severity="error">
              This is an error alert
            </Alert>
          </Stack>
        </Box>

        {/* Chips */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Chips
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
            <Chip label="Default" />
            <Chip label="Primary" color="primary" />
            <Chip label="Secondary" color="secondary" />
            <Chip label="Success" color="success" />
            <Chip label="Error" color="error" />
            <Chip label="Clickable" color="primary" onClick={() => alert('Clicked!')} />
            <Chip label="Deletable" color="secondary" onDelete={() => alert('Deleted!')} />
            <Chip icon={<Favorite />} label="With Icon" color="primary" />
          </Stack>
        </Paper>

        {/* Progress */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Progress Indicators
          </Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Box>
              <Typography variant="body2" gutterBottom>Primary</Typography>
              <LinearProgress />
            </Box>
            <Box>
              <Typography variant="body2" gutterBottom>Secondary</Typography>
              <LinearProgress color="secondary" value={60} variant="determinate" />
            </Box>
            <Box>
              <Typography variant="body2" gutterBottom>Success</Typography>
              <LinearProgress color="success" value={80} variant="determinate" />
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

