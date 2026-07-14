# Component Library

Milestone 3 introduces semantic UI primitives in `src/ui/components`.

## Primitives

- `Surface`: material-aware structural container with paper, stone, glass, metal, plate, and canvas variants.
- `Button`: default, primary, secondary, quiet, and plate variants.
- `TextField` and `SelectField`: shared archive controls with consistent focus and material behavior.
- `Chip`: selectable filter token with accessible pressed state.
- `Metric`: reusable statistic/value presentation.

## Adoption

The dashboard toolbar, statistics, and pagination now use the shared library. New category and feature components should compose these primitives instead of defining isolated borders, gradients, radii, and focus states.

```tsx
import { Button, Surface, TextField } from "@/ui";

<Surface material="glass" elevation={2} padding="md">
  <TextField label="Archive query" />
  <Button variant="primary">Run search</Button>
</Surface>
```
