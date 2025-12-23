import React from 'react';
import { Card, Image, Text, Button } from '@mantine/core';
import type { Launch } from '../types';

interface LaunchCardProps {
  launch: Launch;
  onSelect: (launch: Launch) => void;
}

export const LaunchCard: React.FC<LaunchCardProps> = ({ launch, onSelect }) => {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Card.Section>
        <Image
          src={launch.links.mission_patch_small || '/placeholder.svg'}
          height={160}
          alt={launch.mission_name}
          fit="contain"
          p="md"
        />
      </Card.Section>
      <Text fw={700} size="lg" mt="md" ta="center">
        {launch.mission_name.toLowerCase()}
      </Text>
      <Text c="dimmed" size="sm" ta="center">
        {launch.rocket.rocket_name}
      </Text>
      <Button
        fullWidth
        mt="md"
        radius="md"
        onClick={() => onSelect(launch)}
      >
        See more
      </Button>
    </Card>
  );
};