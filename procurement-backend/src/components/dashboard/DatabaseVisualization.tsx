import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  useTheme
} from '@mui/material';
import {
  AccountTree as RelationshipIcon,
  Storage as DatabaseIcon,
  Link as LinkIcon
} from '@mui/icons-material';

interface EntityField {
  name: string;
  type: string;
  nullable: boolean;
  isKey?: boolean;
}

interface Entity {
  name: string;
  fields: EntityField[];
  relationships: {
    target: string;
    type: 'OneToMany' | 'ManyToOne';
  }[];
}

const entities: Entity[] = [
  {
    name: 'Request',
    fields: [
      { name: 'id', type: 'Long', nullable: false, isKey: true },
      { name: 'requestedBy', type: 'String', nullable: false },
      { name: 'quantity', type: 'int', nullable: false },
      { name: 'status', type: 'String', nullable: false },
      { name: 'justification', type: 'String', nullable: false }
    ],
    relationships: [
      { target: 'Product', type: 'ManyToOne' }
    ]
  },
  {
    name: 'Product',
    fields: [
      { name: 'id', type: 'Long', nullable: false, isKey: true },
      { name: 'name', type: 'String', nullable: false },
      { name: 'description', type: 'String', nullable: false },
      { name: 'category', type: 'String', nullable: false },
      { name: 'price', type: 'double', nullable: false }
    ],
    relationships: [
      { target: 'Supplier', type: 'ManyToOne' }
    ]
  },
  {
    name: 'Supplier',
    fields: [
      { name: 'id', type: 'Long', nullable: false, isKey: true },
      { name: 'name', type: 'String', nullable: false },
      { name: 'email', type: 'String', nullable: false },
      { name: 'phone', type: 'String', nullable: false },
      { name: 'category', type: 'String', nullable: false },
      { name: 'contactPerson', type: 'String', nullable: false },
      { name: 'status', type: 'String', nullable: false }
    ],
    relationships: []
  }
];

const DatabaseVisualization: React.FC = () => {
  const theme = useTheme();

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <DatabaseIcon color="primary" />
        <Typography variant="h6">Database Schema</Typography>
      </Box>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {entities.map((entity) => (
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }} key={entity.name}>
            <Card 
              sx={{ 
                height: '100%',
                border: `1px solid ${theme.palette.divider}`,
                '&:hover': {
                  boxShadow: theme.shadows[4]
                }
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DatabaseIcon fontSize="small" />
                  {entity.name}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Fields:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {entity.fields.map((field) => (
                      <Chip
                        key={field.name}
                        label={`${field.name}: ${field.type}`}
                        size="small"
                        color={field.isKey ? 'primary' : 'default'}
                        variant={field.isKey ? 'filled' : 'outlined'}
                      />
                    ))}
                  </Box>
                </Box>

                {entity.relationships.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Relationships:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {entity.relationships.map((rel) => (
                        <Chip
                          key={rel.target}
                          icon={<LinkIcon />}
                          label={`${rel.type} → ${rel.target}`}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default DatabaseVisualization; 